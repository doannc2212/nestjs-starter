import { Order } from '../aggregate/order';

export interface OrderRepository {
  /**
   * I've find answer for question "Can command return a value?" in CQRS
   * In CQRS, commands and queries segregation is based on the operation behaviour. Query returns data and does not change the application's state. Command modifies the state
   * as reference in https://event-driven.io/en/can_command_return_a_value/
   *
   * */
  save(order: Order | Order[]): Promise<void>;
  findById(id: string): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[] | null>;
  removeItem(itemId: string): Promise<void>;
}
