import { Test } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { OrderResolver } from './order.resolver';
import { CreateOrderCommand } from '../../core/command/create-order.command';
import { AddItemCommand } from '../../core/command/add-item.command';
import { RemoveItemCommand } from '../../core/command/remove-item.command';
import { UpdateQuantityCommand } from '../../core/command/update-quantity.command';
import { CloseOrderCommand } from '../../core/command/close-order.command';
import { FindOrderByIdQuery } from '../../core/query/find-order-by-id.query';

describe('OrderResolver', () => {
  let resolver: OrderResolver;
  let commandBus: jest.Mocked<CommandBus>;
  let queryBus: jest.Mocked<QueryBus>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OrderResolver,
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

    resolver = module.get<OrderResolver>(OrderResolver);
    commandBus = module.get(CommandBus);
    queryBus = module.get(QueryBus);
  });

  describe('getOrder', () => {
    it('should execute FindOrderByIdQuery', async () => {
      const mockOrder = { id: '1', items: [] };
      queryBus.execute.mockResolvedValue(mockOrder);

      const result = await resolver.findOrderById('1');

      expect(queryBus.execute).toHaveBeenCalledWith(
        new FindOrderByIdQuery('1'),
      );
      expect(result).toBe(mockOrder);
    });
  });

  describe('addItem', () => {
    it('should execute AddItemCommand', async () => {
      const input = { orderId: '1', itemId: '2', quantity: 3 };

      await resolver.addItem(input.orderId, input.itemId, input.quantity);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new AddItemCommand(input.orderId, input.itemId, input.quantity),
      );
    });
  });

  describe('removeItem', () => {
    it('should execute RemoveItemCommand', async () => {
      const input = { orderId: '1', itemId: '2' };

      await resolver.removeItem(input.orderId, input.itemId);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new RemoveItemCommand(input.orderId, input.itemId),
      );
    });
  });

  describe('updateQuantity', () => {
    it('should execute UpdateQuantityCommand', async () => {
      const input = { orderId: '1', itemId: '2', quantity: 5 };

      await resolver.updateQuantity(
        input.orderId,
        input.itemId,
        input.quantity,
      );

      expect(commandBus.execute).toHaveBeenCalledWith(
        new UpdateQuantityCommand(input.orderId, input.itemId, input.quantity),
      );
    });
  });

  describe('closeOrder', () => {
    it('should execute CloseOrderCommand', async () => {
      const orderId = '1';

      await resolver.closeOrder(orderId);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new CloseOrderCommand(orderId),
      );
    });
  });

  describe('createOrder', () => {
    it('should execute CreateOrderCommand', async () => {
      const input = {
        userId: 'user-1',
        address: '123 Main St, Test City, Test Country',
      };

      await resolver.createOrder(input.userId, input.address);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new CreateOrderCommand(input.userId, input.address),
      );
    });
  });
});
