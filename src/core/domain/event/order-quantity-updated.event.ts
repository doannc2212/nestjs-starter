import { IEvent } from '@nestjs/cqrs';

export class OrderQuantityUpdatedEvent implements IEvent {
  constructor(
    readonly orderItemId: string,
    readonly quantity: number,
  ) {}
}
