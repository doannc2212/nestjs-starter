import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AddItemCommand } from '../../core/command/add-item.command';
import { RemoveItemCommand } from '../../core/command/remove-item.command';
import { UpdateQuantityCommand } from '../../core/command/update-quantity.command';
import { FindOrderByIdQuery } from '../../core/query/find-order-by-id.query';
import { Order } from '../../core/domain/aggregate/order';
import { OrderServiceControllerMethods } from './specifications/schema';
import { CloseOrderCommand } from '../../core/command/close-order.command';
import { CreateOrderCommand } from '../../core/command/create-order.command';

@Controller()
@OrderServiceControllerMethods()
export class OrderGrpcController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async findOrderById(data: { id: string }): Promise<Order> {
    const query = new FindOrderByIdQuery(data.id);
    return this.queryBus.execute(query);
  }

  async addItem(data: {
    order_id: string;
    item_id: string;
    quantity: number;
  }): Promise<void> {
    const command = new AddItemCommand(
      data.order_id,
      data.item_id,
      data.quantity,
    );
    await this.commandBus.execute(command);
  }

  async removeItem(data: { order_id: string; item_id: string }): Promise<void> {
    const command = new RemoveItemCommand(data.order_id, data.item_id);
    await this.commandBus.execute(command);
  }

  async updateQuantity(data: {
    order_id: string;
    item_id: string;
    quantity: number;
  }): Promise<void> {
    const command = new UpdateQuantityCommand(
      data.order_id,
      data.item_id,
      data.quantity,
    );
    await this.commandBus.execute(command);
  }

  async closeOrder(data: { id: string }): Promise<void> {
    const command = new CloseOrderCommand(data.id);
    await this.commandBus.execute(command);
  }

  async createOrder(data: { user_id: string; address: string }): Promise<void> {
    const command = new CreateOrderCommand(data.user_id, data.address);
    await this.commandBus.execute(command);
  }
}
