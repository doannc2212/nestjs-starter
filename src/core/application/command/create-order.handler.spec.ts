import { Test } from '@nestjs/testing';
import { CreateOrderHandler } from './create-order.handler';
import { CreateOrderCommand } from '../../command/create-order.command';
import { InjectionToken } from '../../../injection-token';
import { OrderFactory } from '../../domain/factory/order.factory';

jest.mock('../../../infrastructure/database/database.module', () => ({
  writeActionManager: {
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    isTransactionActive: true,
  },
}));

import { writeActionManager } from '../../../infrastructure/database/database.module';

describe('CreateOrderHandler', () => {
  let handler: CreateOrderHandler;
  let orderRepository: jest.Mocked<any>;
  let orderFactory: any;

  beforeEach(async () => {
    orderRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    };
    orderFactory = {
      create: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateOrderHandler,
        {
          provide: InjectionToken.OrderRepository,
          useValue: orderRepository,
        },
        {
          provide: OrderFactory,
          useValue: orderFactory,
        },
      ],
    }).compile();

    handler = moduleRef.get<CreateOrderHandler>(CreateOrderHandler);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully create a new order', async () => {
    const mockOrder = {
      address: 'address-1',
      userId: 'user-1',
      commit: jest.fn(),
    };
    orderFactory.create.mockReturnValue(mockOrder);
    orderRepository.save.mockResolvedValue(undefined);

    const command = new CreateOrderCommand('user-1', 'address-1');
    await handler.execute(command);

    expect(orderFactory.create).toHaveBeenCalledWith({
      userId: 'user-1',
      address: 'address-1',
    });
    expect(orderRepository.save).toHaveBeenCalledWith(mockOrder);
    expect(mockOrder.commit).toHaveBeenCalled();
  });

  it('should successfully handle transaction', async () => {
    const mockOrder = {
      commit: jest.fn(),
    };
    orderFactory.create.mockReturnValue(mockOrder);
    orderRepository.save.mockResolvedValue(undefined);

    const command = new CreateOrderCommand('user-1', 'address-1');
    await handler.execute(command);

    expect(writeActionManager.startTransaction).toHaveBeenCalled();
    expect(writeActionManager.commitTransaction).toHaveBeenCalled();
    expect(writeActionManager.rollbackTransaction).not.toHaveBeenCalled();
  });

  it('should rollback transaction when error', async () => {
    orderFactory.create.mockImplementation(() => {
      throw new Error('Some error');
    });

    const command = new CreateOrderCommand('user-1', 'address-1');
    await expect(handler.execute(command)).rejects.toThrow('Some error');

    expect(writeActionManager.startTransaction).toHaveBeenCalled();
    expect(writeActionManager.rollbackTransaction).toHaveBeenCalled();
    expect(writeActionManager.commitTransaction).not.toHaveBeenCalled();
  });
});
