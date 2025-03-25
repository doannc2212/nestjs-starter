import { connectionSource } from '../datasource/typeorm';
import { OrderItemEntity } from '../entities/order-item.entity';
import { OrderEntity } from '../entities/order.entity';
import { _orderItems } from './order-item.seed';
import { _orders } from './order.seed';

export async function unseed() {
  const connection = await connectionSource.initialize();

  try {
    await connection
      .getRepository(OrderItemEntity)
      .delete(_orderItems.map((orderItem) => orderItem.id));
    await connection
      .getRepository(OrderEntity)
      .delete(_orders.map((order) => order.id));

    console.log('Unseeding completed successfully');
  } catch (error) {
    console.error('Error unseeding database:', error);
  } finally {
    await connection.destroy();
  }
}
