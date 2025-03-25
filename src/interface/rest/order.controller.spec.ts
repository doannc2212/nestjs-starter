import { Test } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { OrderRestController } from './order.controller';
import { CreateOrderCommand } from '../../core/command/create-order.command';
import { FindOrderByIdQuery } from '../../core/query/find-order-by-id.query';
import { AddItemCommand } from '../../core/command/add-item.command';
import { RemoveItemCommand } from '../../core/command/remove-item.command';
import { UpdateQuantityCommand } from '../../core/command/update-quantity.command';
import { CloseOrderCommand } from '../../core/command/close-order.command';

describe('OrderRestController', () => {
  let controller: OrderRestController;
  let commandBus: jest.Mocked<CommandBus>;
  let queryBus: jest.Mocked<QueryBus>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [OrderRestController],
      providers: [
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrderRestController>(OrderRestController);
    commandBus = module.get(CommandBus);
    queryBus = module.get(QueryBus);
  });

  describe('findOrderById', () => {
    it('should execute FindOrderByIdQuery', async () => {
      const mockOrder = { id: '1', items: [] };
      queryBus.execute.mockResolvedValue(mockOrder);

      const result = await controller.findOrderById('1');

      expect(queryBus.execute).toHaveBeenCalledWith(
        new FindOrderByIdQuery('1'),
      );
      expect(result).toBe(mockOrder);
    });
  });

  describe('addItem', () => {
    it('should execute AddItemCommand', async () => {
      const request = { orderId: '1', itemId: '2', quantity: 3 };

      await controller.addItem('1', request);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new AddItemCommand(request.orderId, request.itemId, request.quantity),
      );
    });
  });

  describe('removeItem', () => {
    it('should execute RemoveItemCommand', async () => {
      await controller.removeItem('1', '2');

      expect(commandBus.execute).toHaveBeenCalledWith(
        new RemoveItemCommand('1', '2'),
      );
    });
  });

  describe('updateQuantity', () => {
    it('should execute UpdateQuantityCommand', async () => {
      const request = { quantity: 5 };

      await controller.updateQuantity('1', '2', request);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new UpdateQuantityCommand('1', '2', request.quantity),
      );
    });
  });

  describe('closeOrder', () => {
    it('should execute CloseOrderCommand', async () => {
      await controller.closeOrder('1');

      expect(commandBus.execute).toHaveBeenCalledWith(
        new CloseOrderCommand('1'),
      );
    });
  });

  describe('createOrder', () => {
    it('should execute CreateOrderCommand', async () => {
      const request = {
        userId: 'user-1',
        address: 'address-1',
      };

      await controller.createOrder(request);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new CreateOrderCommand(request.userId, request.address),
      );
    });
  });
});
