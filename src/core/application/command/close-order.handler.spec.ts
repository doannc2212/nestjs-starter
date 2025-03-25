import { Test } from '@nestjs/testing';
import { CloseOrderHandler } from './close-order.handler';
import { CloseOrderCommand } from '../../command/close-order.command';
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

describe('CloseOrderHandler', () => {
  let handler: CloseOrderHandler;
  let orderRepository: jest.Mocked<any>;

  beforeEach(async () => {
    orderRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        CloseOrderHandler,
        {
          provide: InjectionToken.OrderRepository,
          useValue: orderRepository,
        },
      ],
    }).compile();

    handler = moduleRef.get<CloseOrderHandler>(CloseOrderHandler);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fail when order does not exist', async () => {
    orderRepository.findById.mockResolvedValue(null);

    const command = new CloseOrderCommand('order-1');
    await expect(handler.execute(command)).rejects.toThrow(
      ErrorMessage.OrderIsNotExist,
    );
  });

  it('should successfully close the order', async () => {
    const mockOrder = {
      id: 'order-1',
      closeOrder: jest.fn(),
      commit: jest.fn(),
    };
    orderRepository.findById.mockResolvedValue(mockOrder);
    orderRepository.save.mockResolvedValue(undefined);

    const command = new CloseOrderCommand('order-1');
    await handler.execute(command);

    expect(mockOrder.closeOrder).toHaveBeenCalled();
    expect(orderRepository.save).toHaveBeenCalledWith(mockOrder);
    expect(mockOrder.commit).toHaveBeenCalled();
  });

  it('should successfully handle transaction', async () => {
    const mockOrder = {
      id: 'order-1',
      closeOrder: jest.fn(),
      commit: jest.fn(),
    };
    orderRepository.findById.mockResolvedValue(mockOrder);

    const command = new CloseOrderCommand('order-1');
    await handler.execute(command);

    expect(writeActionManager.startTransaction).toHaveBeenCalled();
    expect(writeActionManager.commitTransaction).toHaveBeenCalled();
    expect(writeActionManager.rollbackTransaction).not.toHaveBeenCalled();
  });

  it('should rollback transaction on error', async () => {
    const mockOrder = {
      id: 'order-1',
      closeOrder: jest.fn().mockImplementation(() => {
        throw new Error('Some error');
      }),
    };
    orderRepository.findById.mockResolvedValue(mockOrder);

    const command = new CloseOrderCommand('order-1');
    await expect(handler.execute(command)).rejects.toThrow('Some error');

    expect(writeActionManager.startTransaction).toHaveBeenCalled();
    expect(writeActionManager.rollbackTransaction).toHaveBeenCalled();
    expect(writeActionManager.commitTransaction).not.toHaveBeenCalled();
  });
});
