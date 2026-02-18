import { Test, TestingModule } from '@nestjs/testing';
import { OrdersResolver } from './orders.resolver';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';

describe('OrdersResolver', () => {
  let resolver: OrdersResolver;
  let ordersService: { findAll: jest.Mock; remove: jest.Mock };

  const mockOrder = {
    id: 1,
    title: 'Test Order',
    date: new Date('2024-01-01'),
    description: 'Test',
    products: [],
  };

  beforeEach(async () => {
    ordersService = {
      findAll: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersResolver,
        { provide: OrdersService, useValue: ordersService },
      ],
    }).compile();

    resolver = module.get<OrdersResolver>(OrdersResolver);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAll', () => {
    it('should return orders response with default params', async () => {
      const expected = { items: [mockOrder], totalCount: 1 };
      ordersService.findAll.mockResolvedValue(expected);

      const result = await resolver.findAll(20, 0);

      expect(result).toEqual(expected);
      expect(ordersService.findAll).toHaveBeenCalledWith(20, 0);
    });

    it('should pass custom limit and offset', async () => {
      ordersService.findAll.mockResolvedValue({ items: [], totalCount: 0 });

      await resolver.findAll(50, 10);

      expect(ordersService.findAll).toHaveBeenCalledWith(50, 10);
    });
  });

  describe('removeOrder', () => {
    it('should call service.remove with correct id', async () => {
      ordersService.remove.mockResolvedValue(mockOrder);

      const result = await resolver.removeOrder(1);

      expect(result).toEqual(mockOrder);
      expect(ordersService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('total (ResolveField)', () => {
    it('should calculate totals from products with single currency', () => {
      const order = {
        ...mockOrder,
        products: [
          { price: [{ symbol: 'USD', value: 10.5 }] },
          { price: [{ symbol: 'USD', value: 20.3 }] },
        ],
      } as unknown as Order;

      const result = resolver.total(order);

      expect(result).toEqual([{ symbol: 'USD', value: 30.8 }]);
    });

    it('should calculate totals from products with multiple currencies', () => {
      const order = {
        ...mockOrder,
        products: [
          {
            price: [
              { symbol: 'USD', value: 10 },
              { symbol: 'UAH', value: 400 },
            ],
          },
          {
            price: [
              { symbol: 'USD', value: 5.99 },
              { symbol: 'UAH', value: 200.5 },
            ],
          },
        ],
      } as unknown as Order;

      const result = resolver.total(order);

      expect(result).toEqual([
        { symbol: 'USD', value: 15.99 },
        { symbol: 'UAH', value: 600.5 },
      ]);
    });

    it('should return empty array when no products', () => {
      const order = {
        ...mockOrder,
        products: [],
      } as unknown as Order;

      const result = resolver.total(order);

      expect(result).toEqual([]);
    });

    it('should return empty array when products is undefined', () => {
      const order = {
        ...mockOrder,
        products: undefined,
      } as unknown as Order;

      const result = resolver.total(order);

      expect(result).toEqual([]);
    });

    it('should round totals to 2 decimal places', () => {
      const order = {
        ...mockOrder,
        products: [
          { price: [{ symbol: 'USD', value: 0.1 }] },
          { price: [{ symbol: 'USD', value: 0.2 }] },
        ],
      } as unknown as Order;

      const result = resolver.total(order);

      expect(result[0].value).toBe(0.3);
    });
  });
});
