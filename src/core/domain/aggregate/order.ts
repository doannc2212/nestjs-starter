import { AggregateRoot } from '@nestjs/cqrs';
import { v4 } from 'uuid';
import { OrderClosedEvent } from '../event/order-closed.event';
import { OrderItemAddedEvent } from '../event/order-item-added.event';
import { OrderItemRemovedEvent } from '../event/order-item-removed.event';
import { OrderQuantityUpdatedEvent } from '../event/order-quantity-updated.event';
import { OrderItem } from './order-item';

export interface OrderAttributes {
  readonly id: string;
  readonly userId: string;
  address: string;
  readonly createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
  orderItems: OrderItem[];
}

export class Order extends AggregateRoot {
  private readonly id: string;
  private readonly userId: string;
  private readonly createdAt: Date;
  private updatedAt: Date | null;
  private deletedAt: Date | null;
  orderItems: OrderItem[];
  private address: string;

  constructor(props: OrderAttributes) {
    super();
    Object.assign(this, props);
  }

  addItem(itemId: string, quantity: number) {
    const orderItem = new OrderItem({
      id: v4(),
      itemId,
      orderId: this.id,
      quantity,
    });
    this.orderItems.push(orderItem);

    this.apply(new OrderItemAddedEvent(orderItem));
  }

  removeItem(itemId: string) {
    let removedId = null;
    // item id is unique among order items
    const newValue = this.orderItems.filter((item) => {
      removedId = item.id;
      return itemId !== item.itemId;
    });
    this.orderItems = newValue;

    this.apply(new OrderItemRemovedEvent(removedId));
  }

  updateQuantity(itemId: string, quantity: number) {
    const _orderItem = this.orderItems.find((item) => item.itemId === itemId);
    _orderItem.quantity = quantity;

    this.apply(new OrderQuantityUpdatedEvent(_orderItem.id, quantity));
  }

  closeOrder() {
    this.deletedAt = new Date();

    this.apply(new OrderClosedEvent(this.id));
  }
}
