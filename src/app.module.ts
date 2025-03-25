import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { InjectionToken } from './injection-token';
import { AddItemHandler } from './core/application/command/add-item.handler';
import { CloseOrderHandler } from './core/application/command/close-order.handler';
import { RemoveItemHandler } from './core/application/command/remove-item.handler';
import { UpdateQuantityHandler } from './core/application/command/update-quantity.handler';
import { OrderClosedHandler } from './core/application/event/order-closed.handler';
import { OrderItemAddedHandler } from './core/application/event/order-item-added.handler';
import { OrderItemRemovedHandler } from './core/application/event/order-item-removed.handler';
import { OrderQuantityUpdatedHandler } from './core/application/event/order-quantity-updated.handler';
import { FindOrderByIdHandler } from './core/application/query/find-order-by-id.handler';
import { OrderRepositoryImpl } from './infrastructure/repository/order.repository.impl';
import { OrderResolver } from './interface/graphql/order.resolver';
import { OrderGrpcController } from './interface/grpc/order.grpc';
import { OrderFactory } from './core/domain/factory/order.factory';
import { graphQLModule } from './graphql.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { OrderRestController } from './interface/rest/order.controller';
import { CreateOrderHandler } from './core/application/command/create-order.handler';

const application = [
  // query
  FindOrderByIdHandler,

  // command
  AddItemHandler,
  RemoveItemHandler,
  UpdateQuantityHandler,
  CloseOrderHandler,
  CreateOrderHandler,

  // event
  OrderClosedHandler,
  OrderItemAddedHandler,
  OrderItemRemovedHandler,
  OrderQuantityUpdatedHandler,
];

const domain = [OrderFactory];

const infrastructure = [
  {
    provide: InjectionToken.OrderRepository,
    useClass: OrderRepositoryImpl,
  },
];

const core = [...domain, ...application];

@Module({
  imports: [DatabaseModule, CqrsModule, graphQLModule],
  controllers: [OrderGrpcController, OrderRestController],
  providers: [...infrastructure, ...core, OrderResolver],
})
export class AppModule {}
