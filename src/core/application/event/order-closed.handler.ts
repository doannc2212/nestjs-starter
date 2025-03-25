import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderClosedEvent } from '../../../core/domain/event/order-closed.event';
import { Transactional } from '../transactional.decorator';

@EventsHandler(OrderClosedEvent)
export class OrderClosedHandler implements IEventHandler<OrderClosedEvent> {
  @Transactional()
  async handle(event: OrderClosedEvent) {}
}
