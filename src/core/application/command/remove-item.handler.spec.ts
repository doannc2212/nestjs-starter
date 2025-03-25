import { Test } from '@nestjs/testing';
import { RemoveItemHandler } from './remove-item.handler';
import { RemoveItemCommand } from '../../command/remove-item.command';
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

describe('RemoveItemHandler', () => {
  let handler: RemoveItemHandler;
  let orderRepository: jest.Mocked<any>;

  beforeEach(async () => {
    orderRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      removeItem: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        RemoveItemHandler,
        {
          provide: InjectionToken.OrderRepository,
          useValue: orderRepository,
        },
      ],
    }).compile();

    handler = moduleRef.get<RemoveItemHandler>(RemoveItemHandler);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully remove item from order', async () => {
    const mockOrder = {
      id: 'order-1',
      orderItems: [{ itemId: 'item-1' }],
      removeItem: jest.fn(),
      commit: jest.fn(),
    };
    orderRepository.findById.mockResolvedValue(mockOrder);

    const command = new RemoveItemCommand('order-1', 'item-1');
    await handler.execute(command);

    expect(orderRepository.save).toHaveBeenCalled();
    expect(mockOrder.commit).toHaveBeenCalled();
  });

  it('should fail when order does not exist', async () => {
    orderRepository.findById.mockResolvedValue(null);

    const command = new RemoveItemCommand('order-1', 'item-1');
    await expect(handler.execute(command)).rejects.toThrow(
      ErrorMessage.OrderIsNotExist,
    );
  });

  it('should fail when item does not exist in order', async () => {
    const mockOrder = {
      id: 'order-1',
      orderItems: [{ itemId: 'item-2' }],
      removeItem: jest.fn(),
    };
    orderRepository.findById.mockResolvedValue(mockOrder);

    const command = new RemoveItemCommand('order-1', 'item-1');
    await expect(handler.execute(command)).rejects.toThrow(
      ErrorMessage.ItemIsNotExist,
    );
  });

  it('should successfully handle transaction', async () => {
    const mockOrder = {
      id: 'order-1',
      orderItems: [{ itemId: 'item-1' }],
      removeItem: jest.fn(),
      commit: jest.fn(),
    };
    orderRepository.findById.mockResolvedValue(mockOrder);

    const command = new RemoveItemCommand('order-1', 'item-1');
    await handler.execute(command);

    expect(writeActionManager.startTransaction).toHaveBeenCalled();
    expect(writeActionManager.commitTransaction).toHaveBeenCalled();
    expect(writeActionManager.rollbackTransaction).not.toHaveBeenCalled();
  });

  it('should rollback transaction on error', async () => {
    const mockOrder = {
      id: 'order-1',
      orderItems: [{ itemId: 'item-1' }],
      removeItem: jest.fn().mockImplementation(() => {
        throw new Error('Some error');
      }),
    };
    orderRepository.findById.mockResolvedValue(mockOrder);

    const command = new RemoveItemCommand('order-1', 'item-1');
    await expect(handler.execute(command)).rejects.toThrow('Some error');

    expect(writeActionManager.startTransaction).toHaveBeenCalled();
    expect(writeActionManager.rollbackTransaction).toHaveBeenCalled();
    expect(writeActionManager.commitTransaction).not.toHaveBeenCalled();
  });
});
