import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { seed } from 'src/infrastructure/database/seeds/seed';
import { unseed } from 'src/infrastructure/database/seeds/unseed';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Order GraphQL (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    await seed();
  });

  afterAll(async () => {
    await unseed();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  const orderId = '91a94544-721f-422b-9e20-426fd6a79cb5'; // seed
  const userId = '7110ca9b-87a6-4ad5-8d65-c2cf17c27a0c'; // seed

  it('should get order by id', () => {
    const query = `
      query {
        findOrderById(id: "${orderId}") {
          id
          userId
          address
          orderItems {
            id
            itemId
            quantity
          }
        }
      }
    `;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.findOrderById).toBeDefined();
        expect(res.body.data.findOrderById.id).toBe(orderId);
      });
  });

  it('should create new order', () => {
    const mutation = `
      mutation {
        createOrder(
          userId: "${userId}", 
          address: "123 Test Street"
        )
      }
    `;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.createOrder).toBeNull();
      });
  });

  it('should add item to order', () => {
    const mutation = `
      mutation {
        addItem(
          orderId: "${orderId}", 
          itemId: "test-item-1", 
          quantity: 2
        )
      }
    `;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.addItem).toBeNull();
      });
  });

  it('should remove item from order', () => {
    const mutation = `
      mutation {
        removeItem(
          orderId: "${orderId}", 
          itemId: "test-item-1"
        )
      }
    `;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.removeItem).toBeNull();
      });
  });

  it('should update item quantity', () => {
    const mutation = `
      mutation {
        updateQuantity(
          orderId: "${orderId}", 
          itemId: "96da504f-afff-4952-affe-30da17e92cc1", 
          quantity: 5
        )
      }
    `;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.updateQuantity).toBeNull();
      });
  });

  it('should close order', () => {
    const mutation = `
      mutation {
        closeOrder(orderId: "${orderId}")
      }
    `;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.closeOrder).toBeNull();
      });
  });
});
