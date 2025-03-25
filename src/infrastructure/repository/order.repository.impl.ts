import { Inject, Injectable } from '@nestjs/common';
import { Order, OrderAttributes } from '../../core/domain/aggregate/order';
import { OrderFactory } from '../../core/domain/factory/order.factory';
import { OrderRepository } from '../../core/domain/repository/order.repository';
import { readActionManager } from '../database/database.module';
import { OrderItemEntity } from '../database/entities/order-item.entity';
import { OrderEntity } from '../database/entities/order.entity';

@Injectable()
export class OrderRepositoryImpl implements OrderRepository {
  constructor(@Inject() private readonly orderFactory: OrderFactory) {}

  async findById(id: string): Promise<Order | null> {
    const entity = await readActionManager
      .getRepository(OrderEntity)
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .where('order.id = :id', { id })
      .getOne();
    return entity ? this.entityToModel(entity) : null;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const entities = await readActionManager
      .getRepository(OrderEntity)
      .findBy({ userId });
    if (!entities || entities.length === 0) {
      return null;
    }
    return entities.map((entity) => this.entityToModel(entity));
  }

  public async save(order: Order | Order[]): Promise<void> {
    const models = Array.isArray(order) ? order : [order];
    const entities = await Promise.all(
      models.map((model) => this.modelToEntity(model)),
    );
    await readActionManager.getRepository(OrderEntity).save(entities);
  }

  public async removeItem(itemId: string): Promise<void> {
    await readActionManager
      .getRepository(OrderItemEntity)
      .delete({ itemId: itemId });
  }

  private async modelToEntity(model: Order): Promise<OrderEntity> {
    // assume that all Order is built from OrderAttributes constructor, so can parse it back to OrderAttributes
    const attrs = model as unknown as OrderAttributes;
    const orderItems = await readActionManager
      .getRepository(OrderItemEntity)
      .save(
        attrs.orderItems.map((orderItem) => ({
          id: orderItem.id,
          orderId: orderItem.orderId,
          itemId: orderItem.itemId,
          quantity: orderItem.quantity,
        })),
      );
    return {
      id: attrs.id,
      userId: attrs.userId,
      address: attrs.address,
      createdAt: attrs.createdAt,
      updatedAt: attrs.updatedAt,
      deletedAt: attrs.deletedAt,
      orderItems: orderItems,
    };
  }

  private entityToModel(attr: OrderEntity): Order {
    return this.orderFactory.reconstitute(attr);
  }
}
