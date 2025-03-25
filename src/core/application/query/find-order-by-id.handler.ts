import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../../../injection-token';
import { OrderRepository } from '../../../core/domain/repository/order.repository';
import { ErrorMessage } from '../error-message';
import { FindOrderByIdQuery } from '../../query/find-order-by-id.query';

@QueryHandler(FindOrderByIdQuery)
export class FindOrderByIdHandler implements IQueryHandler<FindOrderByIdQuery> {
  @Inject(InjectionToken.OrderRepository)
  private readonly orderRepository: OrderRepository;

  async execute(query: FindOrderByIdQuery) {
    const data = await this.orderRepository.findById(query.id);
    if (!data) {
      throw new Error(ErrorMessage.OrderIsNotExist);
    }

    return data;
  }
}
