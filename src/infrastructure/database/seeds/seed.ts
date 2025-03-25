import { connectionSource } from '../datasource/typeorm';
import { OrderItemEntity } from '../entities/order-item.entity';
import { OrderEntity } from '../entities/order.entity';
import { _orderItems } from './order-item.seed';
import { _orders } from './order.seed';

export async function seed() {
  const connection = await connectionSource.initialize();

  try {
    await connection.getRepository(OrderEntity).save(_orders);

    await connection.getRepository(OrderItemEntity).save(_orderItems);

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await connection.destroy();
  }
}
