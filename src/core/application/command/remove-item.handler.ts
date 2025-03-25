import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../../../injection-token';
import { OrderRepository } from '../../domain/repository/order.repository';
import { ErrorMessage } from '../error-message';
import { RemoveItemCommand } from '../../command/remove-item.command';
import { Transactional } from '../transactional.decorator';

@CommandHandler(RemoveItemCommand)
export class RemoveItemHandler {
  @Inject(InjectionToken.OrderRepository)
  private readonly orderRepository: OrderRepository;

  @Transactional()
  async execute(command: RemoveItemCommand): Promise<void> {
    const order = await this.orderRepository.findById(command.orderId);
    if (!order) {
      throw new Error(ErrorMessage.OrderIsNotExist);
    }

    const hasItem = order.orderItems.some(
      (item) => item.itemId === command.itemId,
    );
    if (!hasItem) {
      throw new Error(ErrorMessage.ItemIsNotExist);
    }

    await this.orderRepository.removeItem(command.itemId);

    order.removeItem(command.itemId);

    await this.orderRepository.save(order);

    order.commit();
  }
}
