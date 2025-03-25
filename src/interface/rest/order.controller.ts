import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AddItemCommand } from '../../core/command/add-item.command';
import { CloseOrderCommand } from '../../core/command/close-order.command';
import { CreateOrderCommand } from '../../core/command/create-order.command';
import { RemoveItemCommand } from '../../core/command/remove-item.command';
import { UpdateQuantityCommand } from '../../core/command/update-quantity.command';
import { Order } from '../../core/domain/aggregate/order';
import { FindOrderByIdQuery } from '../../core/query/find-order-by-id.query';
import { AddItemRequestDto } from './dto/add-item.request.dto';
import { CreateOrderRequestDto } from './dto/create-order.request.dto';
import { UpdateQuantityRequestDto } from './dto/update-quantity.request.dto';

@Controller('order')
export class OrderRestController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(':id')
  async findOrderById(@Param('id') id: string): Promise<Order> {
    const query = new FindOrderByIdQuery(id);
    return this.queryBus.execute(query);
  }

  @Post()
  async createOrder(@Body() request: CreateOrderRequestDto): Promise<void> {
    const command = new CreateOrderCommand(request.userId, request.address);
    await this.commandBus.execute(command);
  }

  @Post(':orderId/item')
  async addItem(
    @Param('orderId') orderId: string,
    @Body() request: AddItemRequestDto,
  ): Promise<void> {
    const command = new AddItemCommand(
      orderId,
      request.itemId,
      request.quantity,
    );
    await this.commandBus.execute(command);
  }

  @Delete(':orderId/item/:itemId')
  async removeItem(
    @Param('orderId') orderId: string,
    @Param('itemId') itemId: string,
  ): Promise<void> {
    const command = new RemoveItemCommand(orderId, itemId);
    await this.commandBus.execute(command);
  }

  @Patch(':orderId/item/:itemId')
  async updateQuantity(
    @Param('orderId') orderId: string,
    @Param('itemId') itemId: string,
    @Body() request: UpdateQuantityRequestDto,
  ): Promise<void> {
    const command = new UpdateQuantityCommand(
      orderId,
      itemId,
      request.quantity,
    );
    await this.commandBus.execute(command);
  }

  @Put(':id/close')
  async closeOrder(@Param('id') id: string): Promise<void> {
    const command = new CloseOrderCommand(id);
    await this.commandBus.execute(command);
  }
}
