import { Test } from '@nestjs/testing';
import { AddItemHandler } from './add-item.handler';
import { AddItemCommand } from '../../command/add-item.command';
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

describe('AddItemHandler', () => {
  let handler: AddItemHandler;
  let orderRepository: jest.Mocked<any>;

  beforeEach(async () => {
    orderRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AddItemHandler,
        { provide: InjectionToken.OrderRepository, useValue: orderRepository },
      ],
    }).compile();

    handler = moduleRef.get<AddItemHandler>(AddItemHandler);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should throw when item already exists in order', async () => {
      const mockOrder = {
        id: 'order-1',
        orderItems: [{ itemId: 'item-1', quantity: 1 }],
      };
      orderRepository.findById.mockResolvedValue(mockOrder);

      const command = new AddItemCommand('order-1', 'item-1', 2);
      await expect(handler.execute(command)).rejects.toThrow(
        ErrorMessage.ItemAlreadyExist,
      );
    });

    it('should throw when order does not exist', async () => {
      orderRepository.findById.mockResolvedValue(null);

      const command = new AddItemCommand('order-1', 'item-1', 2);
      await expect(handler.execute(command)).rejects.toThrow(
        ErrorMessage.OrderIsNotExist,
      );
    });

    it('should throw when quantity is less than 1', async () => {
      const mockOrder = {
        id: 'order-1',
        orderItems: [],
      };
      orderRepository.findById.mockResolvedValue(mockOrder);

      const command = new AddItemCommand('order-1', 'item-1', 0);
      await expect(handler.execute(command)).rejects.toThrow(
        ErrorMessage.QuantityMustBePositive,
      );
    });

    it('should handle successful item addition', async () => {
      const mockOrder = {
        id: 'order-1',
        orderItems: [],
        addItem: jest.fn(),
        commit: jest.fn(),
      };
      orderRepository.findById.mockResolvedValue(mockOrder);

      const command = new AddItemCommand('order-1', 'item-1', 2);
      await handler.execute(command);

      expect(mockOrder.addItem).toHaveBeenCalledWith('item-1', 2);
      expect(orderRepository.save).toHaveBeenCalledWith(mockOrder);
    });

    it('should successfully handle transaction', async () => {
      const mockOrder = {
        id: 'order-1',
        orderItems: [],
        addItem: jest.fn(),
        commit: jest.fn(),
      };
      orderRepository.findById.mockResolvedValue(mockOrder);

      const command = new AddItemCommand('order-1', 'item-1', 2);
      await handler.execute(command);

      expect(writeActionManager.startTransaction).toHaveBeenCalled();
      expect(writeActionManager.commitTransaction).toHaveBeenCalled();
      expect(writeActionManager.rollbackTransaction).not.toHaveBeenCalled();
    });

    it('should rollback transaction on error', async () => {
      const mockOrder = {
        id: 'order-1',
        orderItems: [],
        addItem: jest.fn().mockImplementation(() => {
          throw new Error('Some error');
        }),
      };
      orderRepository.findById.mockResolvedValue(mockOrder);

      const command = new AddItemCommand('order-1', 'item-1', 2);
      await expect(handler.execute(command)).rejects.toThrow('Some error');

      expect(writeActionManager.startTransaction).toHaveBeenCalled();
      expect(writeActionManager.rollbackTransaction).toHaveBeenCalled();
      expect(writeActionManager.commitTransaction).not.toHaveBeenCalled();
    });
  });
});
