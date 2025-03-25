import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { OrderEntity } from './order.entity';

@Entity('order_item')
@Unique(['orderId', 'itemId'])
export class OrderItemEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @Column()
  itemId: string;

  @Column()
  quantity: number;

  @ManyToOne(() => OrderEntity, (order) => order.orderItems)
  @JoinColumn({ name: 'orderId' })
  order: OrderEntity;
}
