import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { v4 } from 'uuid';
import { Order, OrderAttributes } from '../aggregate/order';

type CreateOrderOptions = {
  userId: string;
  address: string;
};

export class OrderFactory {
  @Inject(EventPublisher) private readonly eventPublisher: EventPublisher;

  create(props: CreateOrderOptions): Order {
    // https://github.com/nestjs/cqrs/blob/master/src/event-publisher.ts#L37-L56
    return this.eventPublisher.mergeObjectContext(
      new Order({
        id: v4(),
        ...props,
        orderItems: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }),
    );
  }

  reconstitute(props: OrderAttributes): Order {
    return this.eventPublisher.mergeObjectContext(
      new Order({ ...props, orderItems: props.orderItems ?? [] }),
    );
  }
}
