import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../../../injection-token';
import { OrderRepository } from '../../../core/domain/repository/order.repository';
import { ErrorMessage } from '../error-message';
import { CloseOrderCommand } from '../../command/close-order.command';
import { Transactional } from '../transactional.decorator';

@CommandHandler(CloseOrderCommand)
export class CloseOrderHandler {
  @Inject(InjectionToken.OrderRepository)
  private readonly orderRepository: OrderRepository;

  @Transactional()
  async execute(command: CloseOrderCommand): Promise<void> {
    const order = await this.orderRepository.findById(command.id);
    if (!order) {
      throw new Error(ErrorMessage.OrderIsNotExist);
    }

    order.closeOrder();

    await this.orderRepository.save(order);

    order.commit();
  }
}
