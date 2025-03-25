import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderItemAddedEvent } from '../../../core/domain/event/order-item-added.event';
import { Transactional } from '../transactional.decorator';

@EventsHandler(OrderItemAddedEvent)
export class OrderItemAddedHandler
  implements IEventHandler<OrderItemAddedEvent>
{
  @Transactional()
  async handle(event: OrderItemAddedEvent) {}
}
