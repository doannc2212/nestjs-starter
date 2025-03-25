import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderQuantityUpdatedEvent } from '../../../core/domain/event/order-quantity-updated.event';
import { Transactional } from '../transactional.decorator';

@EventsHandler(OrderQuantityUpdatedEvent)
export class OrderQuantityUpdatedHandler
  implements IEventHandler<OrderQuantityUpdatedEvent>
{
  @Transactional()
  async handle(event: OrderQuantityUpdatedEvent) {}
}
