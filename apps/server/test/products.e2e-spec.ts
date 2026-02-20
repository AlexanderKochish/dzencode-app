import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ProductsResolver } from '@/products/products.resolver';
import { ProductsService } from '@/products/products.service';
import { Server } from 'http';

interface GraphQLBody {
  data: {
    products: {
      items: Array<{
        id: number;
        title: string;
        type: string;
        specification: string;
      }>;
      totalCount: number;
    };
    productTypes: string[];
    productSpecs: string[];
    removeProduct: { id: number; title: string };
  };
}

describe('Products GraphQL (e2e)', () => {
  let app: INestApplication;
  let productsService: {
    findAll: jest.Mock;
    remove: jest.Mock;
    getUniqueTypes: jest.Mock;
    getUniqueSpecs: jest.Mock;
  };

  const mockProduct = {
    id: 1,
    serialNumber: 1001,
    isNew: 1,
    photo: 'photo.jpg',
    title: 'Monitor LG',
    type: 'Monitor',
    specification: 'Full HD',
    guarantee: { start: '2024-01-01', end: '2025-01-01' },
    price: [{ value: 200, symbol: 'USD', isDefault: 1 }],
    order: { id: 1, title: 'Order #1', date: '2024-01-01', products: [] },
    orderId: 1,
    date: '2024-06-01',
  };

  beforeAll(async () => {
    productsService = {
      findAll: jest.fn(),
      remove: jest.fn(),
      getUniqueTypes: jest.fn(),
      getUniqueSpecs: jest.fn(),
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
        ProductsResolver,
        { provide: ProductsService, useValue: productsService },
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

  describe('Query: products', () => {
    it('should return products with pagination', async () => {
      productsService.findAll.mockResolvedValue({
        items: [mockProduct],
        totalCount: 1,
      });

      const query = `
        query {
          products(limit: 20, offset: 0) {
            items {
              id
              title
              type
              specification
            }
            totalCount
          }
        }
      `;

      const response = await request(app.getHttpServer() as Server)
        .post('/graphql')
        .send({ query })
        .expect(200);

      const body = response.body as GraphQLBody;
      expect(body.data.products.items).toHaveLength(1);
      expect(body.data.products.items[0].title).toBe('Monitor LG');
      expect(body.data.products.totalCount).toBe(1);
    });

    it('should accept type and spec filters', async () => {
      productsService.findAll.mockResolvedValue({
        items: [],
        totalCount: 0,
      });

      const query = `
        query {
          products(limit: 10, offset: 0, type: "Monitor", spec: "4K") {
            items { id }
            totalCount
          }
        }
      `;

      await request(app.getHttpServer() as Server)
        .post('/graphql')
        .send({ query })
        .expect(200);

      expect(productsService.findAll).toHaveBeenCalledWith(
        10,
        0,
        'Monitor',
        '4K',
      );
    });
  });

  describe('Query: productTypes', () => {
    it('should return unique product types', async () => {
      productsService.getUniqueTypes.mockResolvedValue([
        'Monitor',
        'Mouse',
        'Keyboard',
      ]);

      const query = `
        query {
          productTypes
        }
      `;

      const response = await request(app.getHttpServer() as Server)
        .post('/graphql')
        .send({ query })
        .expect(200);

      const body = response.body as GraphQLBody;
      expect(body.data.productTypes).toEqual(['Monitor', 'Mouse', 'Keyboard']);
    });
  });

  describe('Query: productSpecs', () => {
    it('should return unique product specs', async () => {
      productsService.getUniqueSpecs.mockResolvedValue(['Full HD', '4K']);

      const query = `
        query {
          productSpecs
        }
      `;

      const response = await request(app.getHttpServer() as Server)
        .post('/graphql')
        .send({ query })
        .expect(200);

      const body = response.body as GraphQLBody;
      expect(body.data.productSpecs).toEqual(['Full HD', '4K']);
    });
  });

  describe('Mutation: removeProduct', () => {
    it('should remove a product and return it', async () => {
      productsService.remove.mockResolvedValue(mockProduct);

      const mutation = `
        mutation {
          removeProduct(id: 1) {
            id
            title
          }
        }
      `;

      const response = await request(app.getHttpServer() as Server)
        .post('/graphql')
        .send({ query: mutation })
        .expect(200);

      const body = response.body as GraphQLBody;
      expect(body.data.removeProduct.id).toBe(1);
      expect(body.data.removeProduct.title).toBe('Monitor LG');
      expect(productsService.remove).toHaveBeenCalledWith(1);
    });
  });
});
