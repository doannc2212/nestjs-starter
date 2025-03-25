import { IEvent } from '@nestjs/cqrs';

export class OrderItemRemovedEvent implements IEvent {
  constructor(readonly orderItemId: string) {}
}
