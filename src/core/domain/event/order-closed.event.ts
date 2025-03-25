import { IEvent } from '@nestjs/cqrs';

export class OrderClosedEvent implements IEvent {
  constructor(readonly orderId: string) {}
}
