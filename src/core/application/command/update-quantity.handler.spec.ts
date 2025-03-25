import { Test } from '@nestjs/testing';
import { UpdateQuantityHandler } from './update-quantity.handler';
import { UpdateQuantityCommand } from '../../command/update-quantity.command';
import { InjectionToken } from '../../../injection-token';
import { ErrorMessage } from '../error-message';

jest.mock('../../../infrastructure/database/database.module', () => ({
  writeActionManager: {
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    isTransactionActive: true,
  },
}));

import { writeActionManager } from '../../../infrastructure/database/database.module';
import { _orderItems } from 'src/infrastructure/database/seeds/order-item.seed';

describe('UpdateQuantityHandler', () => {
  let handler: UpdateQuantityHandler;
  let orderRepository: jest.Mocked<any>;

  beforeEach(async () => {
    orderRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdateQuantityHandler,
        {
          provide: InjectionToken.OrderRepository,
          useValue: orderRepository,
        },
      ],
    }).compile();

    handler = moduleRef.get<UpdateQuantityHandler>(UpdateQuantityHandler);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fail when order does not exist', async () => {
    orderRepository.findById.mockResolvedValue(null);

    const command = new UpdateQuantityCommand('order-1', 'item-1', 5);
    await expect(handler.execute(command)).rejects.toThrow(
      ErrorMessage.OrderIsNotExist,
    );
  });

  it('should fail when attempting to update with negative quantity', async () => {
    const mockOrder = {
      id: 'order-1',
      updateQuantity: jest.fn(),
      commit: jest.fn(),
    };
    orderRepository.findById.mockResolvedValue(mockOrder);

    const command = new UpdateQuantityCommand('order-1', 'item-1', -1);
    await expect(handler.execute(command)).rejects.toThrow(
      ErrorMessage.QuantityMustBePositive,
    );
  });

  it('should successfully update item quantity in order', async () => {
    const mockOrder = {
      id: 'order-1',
      orderItems: [
        {
          itemId: 'item-1',
          quantity: 5,
        },
      ],
      updateQuantity: jest.fn(),
      commit: jest.fn(),
    };
    orderRepository.findById.mockResolvedValue(mockOrder);
    orderRepository.save.mockResolvedValue(undefined);

    const command = new UpdateQuantityCommand('order-1', 'item-1', 5);
    await handler.execute(command);

    expect(mockOrder.updateQuantity).toHaveBeenCalledWith('item-1', 5);
    expect(orderRepository.save).toHaveBeenCalledWith(mockOrder);
    expect(mockOrder.commit).toHaveBeenCalled();
  });

  it('should successfully handle transaction', async () => {
    const mockOrder = {
      id: 'order-1',
      orderItems: [
        {
          itemId: 'item-1',
          quantity: 4,
        },
      ],
      updateQuantity: jest.fn(),
      commit: jest.fn(),
    };
    orderRepository.findById.mockResolvedValue(mockOrder);

    const command = new UpdateQuantityCommand('order-1', 'item-1', 5);
    await handler.execute(command);

    expect(writeActionManager.startTransaction).toHaveBeenCalled();
    expect(writeActionManager.commitTransaction).toHaveBeenCalled();
    expect(writeActionManager.rollbackTransaction).not.toHaveBeenCalled();
  });

  it('should rollback transaction when error', async () => {
    const mockOrder = {
      id: 'order-1',
      orderItems: [
        {
          itemId: 'item-1',
          quantity: 4,
        },
      ],
      updateQuantity: jest.fn().mockImplementation(() => {
        throw new Error('Some error');
      }),
    };
    orderRepository.findById.mockResolvedValue(mockOrder);

    const command = new UpdateQuantityCommand('order-1', 'item-1', 5);
    await expect(handler.execute(command)).rejects.toThrow('Some error');

    expect(writeActionManager.startTransaction).toHaveBeenCalled();
    expect(writeActionManager.rollbackTransaction).toHaveBeenCalled();
    expect(writeActionManager.commitTransaction).not.toHaveBeenCalled();
  });
});
