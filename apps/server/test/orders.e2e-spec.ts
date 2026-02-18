import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { OrdersResolver } from '@/orders/orders.resolver';
import { OrdersService } from '@/orders/orders.service';

describe('Orders GraphQL (e2e)', () => {
  let app: INestApplication;
  let ordersService: {
    findAll: jest.Mock;
    remove: jest.Mock;
  };

  const mockOrder = {
    id: 1,
    title: 'Order #1',
    date: new Date('2024-06-15T00:00:00.000Z'),
    description: 'Test order',
    products: [
      {
        id: 1,
        serialNumber: 1001,
        isNew: 1,
        photo: 'photo.jpg',
        title: 'Product 1',
        type: 'Monitor',
        specification: 'Full HD',
        guarantee: { start: '2024-01-01', end: '2025-01-01' },
        price: [
          { value: 100, symbol: 'USD', isDefault: 1 },
          { value: 4000, symbol: 'UAH', isDefault: 0 },
        ],
        orderId: 1,
        date: '2024-01-01',
      },
    ],
  };

  beforeAll(async () => {
    ordersService = {
      findAll: jest.fn(),
      remove: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: true,
          path: '/graphql',
        }),
      ],
      providers: [
        OrdersResolver,
        { provide: OrdersService, useValue: ordersService },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Query: orders', () => {
    it('should return orders with total calculated', async () => {
      ordersService.findAll.mockResolvedValue({
        items: [mockOrder],
        totalCount: 1,
      });

      const query = `
        query {
          orders(limit: 20, offset: 0) {
            items {
              id
              title
              description
              total {
                symbol
                value
              }
            }
            totalCount
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200);

      const { data } = response.body;
      expect(data.orders.items).toHaveLength(1);
      expect(data.orders.items[0].id).toBe(1);
      expect(data.orders.items[0].title).toBe('Order #1');
      expect(data.orders.totalCount).toBe(1);
      expect(data.orders.items[0].total).toEqual(
        expect.arrayContaining([
          { symbol: 'USD', value: 100 },
          { symbol: 'UAH', value: 4000 },
        ]),
      );
    });

    it('should handle empty results', async () => {
      ordersService.findAll.mockResolvedValue({
        items: [],
        totalCount: 0,
      });

      const query = `
        query {
          orders(limit: 10, offset: 0) {
            items { id }
            totalCount
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200);

      expect(response.body.data.orders.items).toEqual([]);
      expect(response.body.data.orders.totalCount).toBe(0);
    });
  });

  describe('Mutation: removeOrder', () => {
    it('should remove an order and return it', async () => {
      ordersService.remove.mockResolvedValue({
        ...mockOrder,
        products: [],
      });

      const mutation = `
        mutation {
          removeOrder(id: 1) {
            id
            title
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation })
        .expect(200);

      expect(response.body.data.removeOrder.id).toBe(1);
      expect(response.body.data.removeOrder.title).toBe('Order #1');
      expect(ordersService.remove).toHaveBeenCalledWith(1);
    });
  });
});
