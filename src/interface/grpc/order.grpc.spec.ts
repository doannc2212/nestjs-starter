import { Test } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { OrderGrpcController } from './order.grpc';
import { CreateOrderCommand } from '../../core/command/create-order.command';
import { FindOrderByIdQuery } from '../../core/query/find-order-by-id.query';
import { AddItemCommand } from '../../core/command/add-item.command';
import { RemoveItemCommand } from '../../core/command/remove-item.command';
import { UpdateQuantityCommand } from '../../core/command/update-quantity.command';
import { CloseOrderCommand } from '../../core/command/close-order.command';

describe('OrderGrpcController', () => {
  let controller: OrderGrpcController;
  let commandBus: jest.Mocked<CommandBus>;
  let queryBus: jest.Mocked<QueryBus>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [OrderGrpcController],
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

    controller = module.get<OrderGrpcController>(OrderGrpcController);
    commandBus = module.get(CommandBus);
    queryBus = module.get(QueryBus);
  });

  describe('findOrderById', () => {
    it('should execute FindOrderByIdQuery', async () => {
      const mockOrder = { id: '1', items: [] };
      queryBus.execute.mockResolvedValue(mockOrder);

      const result = await controller.findOrderById({ id: '1' });

      expect(queryBus.execute).toHaveBeenCalledWith(
        new FindOrderByIdQuery('1'),
      );
      expect(result).toBe(mockOrder);
    });
  });

  describe('addItem', () => {
    it('should execute AddItemCommand', async () => {
      const data = { order_id: '1', item_id: '2', quantity: 3 };

      await controller.addItem(data);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new AddItemCommand(data.order_id, data.item_id, data.quantity),
      );
    });
  });

  describe('removeItem', () => {
    it('should execute RemoveItemCommand', async () => {
      const data = { order_id: '1', item_id: '2' };

      await controller.removeItem(data);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new RemoveItemCommand(data.order_id, data.item_id),
      );
    });
  });

  describe('updateQuantity', () => {
    it('should execute UpdateQuantityCommand', async () => {
      const data = { order_id: '1', item_id: '2', quantity: 5 };

      await controller.updateQuantity(data);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new UpdateQuantityCommand(data.order_id, data.item_id, data.quantity),
      );
    });
  });

  describe('closeOrder', () => {
    it('should execute CloseOrderCommand', async () => {
      const data = { id: '1' };

      await controller.closeOrder(data);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new CloseOrderCommand(data.id),
      );
    });
  });

  describe('createOrder', () => {
    it('should execute CreateOrderCommand', async () => {
      const data = {
        user_id: 'user-1',
        address: '137 Tran Phu, Da Nang, Vietnam',
      };

      await controller.createOrder(data);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new CreateOrderCommand(data.user_id, data.address),
      );
    });
  });
});
