import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderItemRemovedEvent } from '../../../core/domain/event/order-item-removed.event';
import { Transactional } from '../transactional.decorator';

@EventsHandler(OrderItemRemovedEvent)
export class OrderItemRemovedHandler
  implements IEventHandler<OrderItemRemovedEvent>
{
  @Transactional()
  async handle(event: OrderItemRemovedEvent) {}
}
