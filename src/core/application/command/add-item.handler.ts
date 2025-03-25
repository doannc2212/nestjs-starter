import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../../../injection-token';
import { OrderRepository } from '../../../core/domain/repository/order.repository';
import { ErrorMessage } from '../error-message';
import { Transactional } from '../transactional.decorator';
import { AddItemCommand } from '../../command/add-item.command';

@CommandHandler(AddItemCommand)
export class AddItemHandler {
  @Inject(InjectionToken.OrderRepository)
  private readonly orderRepository: OrderRepository;

  @Transactional()
  async execute(command: AddItemCommand): Promise<void> {
    const order = await this.orderRepository.findById(command.orderId);
    // for save time, we will not implement validation for itemId, you can do it yourself.
    // we assume that the itemId is valid
    if (!order) {
      throw new Error(ErrorMessage.OrderIsNotExist);
    }

    const hasItem = order.orderItems.some(
      (item) => item.itemId === command.itemId,
    );

    if (hasItem) {
      throw new Error(ErrorMessage.ItemAlreadyExist);
    }

    if (command.quantity <= 0) {
      throw new Error(ErrorMessage.QuantityMustBePositive);
    }

    order.addItem(command.itemId, command.quantity);

    await this.orderRepository.save(order);

    order.commit();
  }
}
