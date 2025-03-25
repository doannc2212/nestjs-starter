import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../../../injection-token';
import { CreateOrderCommand } from '../../command/create-order.command';
import { OrderFactory } from '../../domain/factory/order.factory';
import { OrderRepository } from '../../domain/repository/order.repository';
import { Transactional } from '../transactional.decorator';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler {
  @Inject(InjectionToken.OrderRepository)
  private readonly orderRepository: OrderRepository;

  @Inject()
  private readonly orderFactory: OrderFactory;

  @Transactional()
  async execute(command: CreateOrderCommand): Promise<void> {
    const order = this.orderFactory.create({
      userId: command.userId,
      address: command.address,
    });

    await this.orderRepository.save(order);

    order.commit();
  }
}
