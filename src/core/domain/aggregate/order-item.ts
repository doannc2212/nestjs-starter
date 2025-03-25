export type OrderItemAttributes = {
  id: string;
  orderId: string;
  itemId: string;
  quantity: number;
};

export class OrderItem {
  readonly id: string;
  readonly orderId: string;
  readonly itemId: string;
  quantity: number;

  constructor(props: OrderItemAttributes) {
    if (props.quantity < 0) {
      throw new Error('Quantity must be greater than 0');
    }
    Object.assign(this, props);
  }
}
