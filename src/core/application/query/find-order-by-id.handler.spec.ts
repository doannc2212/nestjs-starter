import { Test } from '@nestjs/testing';
import { FindOrderByIdHandler } from './find-order-by-id.handler';
import { FindOrderByIdQuery } from '../../query/find-order-by-id.query';
import { InjectionToken } from '../../../injection-token';
import { ErrorMessage } from '../error-message';

describe('FindOrderByIdHandler', () => {
  let handler: FindOrderByIdHandler;
  let orderRepository: any;

  beforeEach(async () => {
    const orderRepositoryMock = {
      findById: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        FindOrderByIdHandler,
        {
          provide: InjectionToken.OrderRepository,
          useValue: orderRepositoryMock,
        },
      ],
    }).compile();

    handler = moduleRef.get<FindOrderByIdHandler>(FindOrderByIdHandler);
    orderRepository = moduleRef.get(InjectionToken.OrderRepository);
  });

  it('should throw error when order not found', async () => {
    orderRepository.findById.mockResolvedValue(null);

    const query = new FindOrderByIdQuery('order-1');
    await expect(handler.execute(query)).rejects.toThrow(
      ErrorMessage.OrderIsNotExist,
    );
  });

  it('should return order when found', async () => {
    const mockOrder = { id: 'order-1' };
    orderRepository.findById.mockResolvedValue(mockOrder);

    const query = new FindOrderByIdQuery('order-1');
    const result = await handler.execute(query);

    expect(result).toBe(mockOrder);
  });
});
