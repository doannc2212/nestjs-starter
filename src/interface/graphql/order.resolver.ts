import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateOrderCommand } from 'src/core/command/create-order.command';
import { AddItemCommand } from '../../core/command/add-item.command';
import { CloseOrderCommand } from '../../core/command/close-order.command';
import { RemoveItemCommand } from '../../core/command/remove-item.command';
import { UpdateQuantityCommand } from '../../core/command/update-quantity.command';
import { FindOrderByIdQuery } from '../../core/query/find-order-by-id.query';
import { Order } from './dtos/graphql';

@Resolver('Order')
export class OrderResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query(() => Order)
  async findOrderById(@Args('id') id: string): Promise<Order> {
    const query = new FindOrderByIdQuery(id);
    return this.queryBus.execute(query);
  }

  @Mutation()
  async addItem(
    @Args('orderId') orderId: string,
    @Args('itemId') itemId: string,
    @Args('quantity') quantity: number,
  ): Promise<void> {
    const command = new AddItemCommand(orderId, itemId, quantity);
    await this.commandBus.execute(command);
  }

  @Mutation()
  async removeItem(
    @Args('orderId') orderId: string,
    @Args('itemId') itemId: string,
  ): Promise<void> {
    const command = new RemoveItemCommand(orderId, itemId);
    await this.commandBus.execute(command);
  }

  @Mutation()
  async updateQuantity(
    @Args('orderId') orderId: string,
    @Args('itemId') itemId: string,
    @Args('quantity') quantity: number,
  ): Promise<void> {
    const command = new UpdateQuantityCommand(orderId, itemId, quantity);
    await this.commandBus.execute(command);
  }

  @Mutation()
  async closeOrder(@Args('orderId') orderId: string): Promise<void> {
    const command = new CloseOrderCommand(orderId);
    await this.commandBus.execute(command);
  }

  @Mutation()
  async createOrder(
    @Args('userId') userId: string,
    @Args('address') address: string,
  ): Promise<void> {
    const command = new CreateOrderCommand(userId, address);
    await this.commandBus.execute(command);
  }
}
