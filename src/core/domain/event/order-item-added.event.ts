import { IEvent } from '@nestjs/cqrs';
import { OrderItem } from '../aggregate/order-item';

/**
 * *The one below is copy from slide 20 step 8 code - explanation
 * Domain Event - Example
 * Order received
 * User logged in
 * Delivery sent
 * A record was inserted into a table  => Not a domain event
 * (A Domain Event is an interesting and business relevant event that happened during the business process. It always sounds like a verb in past tense, together with a noun that designates the subject or object for the verb.)
 */

export class OrderItemAddedEvent implements IEvent {
  constructor(readonly orderItem: OrderItem) {}
}
