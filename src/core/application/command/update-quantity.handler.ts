import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../../../injection-token';
import { OrderRepository } from '../../../core/domain/repository/order.repository';
import { ErrorMessage } from '../error-message';
import { UpdateQuantityCommand } from '../../command/update-quantity.command';
import { Transactional } from '../transactional.decorator';

@CommandHandler(UpdateQuantityCommand)
export class UpdateQuantityHandler {
  @Inject(InjectionToken.OrderRepository)
  private readonly orderRepository: OrderRepository;

  @Transactional()
  async execute(command: UpdateQuantityCommand): Promise<void> {
    if (command.quantity < 0) {
      throw new Error(ErrorMessage.QuantityMustBePositive);
    }
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

    order.updateQuantity(command.itemId, command.quantity);

    await this.orderRepository.save(order);

    order.commit();
  }
}
