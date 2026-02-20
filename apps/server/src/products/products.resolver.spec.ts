import { Test, TestingModule } from '@nestjs/testing';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';

describe('ProductsResolver', () => {
  let resolver: ProductsResolver;
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
    title: 'Test Product',
    type: 'Monitor',
    specification: 'Full HD',
    guarantee: { start: '2024-01-01', end: '2025-01-01' },
    price: [{ value: 100, symbol: 'USD', isDefault: 1 }],
    orderId: 1,
    date: '2024-01-01',
  };

  beforeEach(async () => {
    productsService = {
      findAll: jest.fn(),
      remove: jest.fn(),
      getUniqueTypes: jest.fn(),
      getUniqueSpecs: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsResolver,
        { provide: ProductsService, useValue: productsService },
      ],
    }).compile();

    resolver = module.get<ProductsResolver>(ProductsResolver);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAll', () => {
    it('should return products response with default params', async () => {
      const expected = { items: [mockProduct], totalCount: 1 };
      productsService.findAll.mockResolvedValue(expected);

      const result = await resolver.findAll(20, 0);

      expect(result).toEqual(expected);
      expect(productsService.findAll).toHaveBeenCalledWith(
        20,
        0,
        undefined,
        undefined,
      );
    });

    it('should pass type and spec filters', async () => {
      productsService.findAll.mockResolvedValue({ items: [], totalCount: 0 });

      await resolver.findAll(20, 0, 'Monitor', 'Full HD');

      expect(productsService.findAll).toHaveBeenCalledWith(
        20,
        0,
        'Monitor',
        'Full HD',
      );
    });
  });

  describe('removeProduct', () => {
    it('should call service.remove with correct id', async () => {
      productsService.remove.mockResolvedValue(mockProduct);

      const result = await resolver.removeProduct(1);

      expect(result).toEqual(mockProduct);
      expect(productsService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('productTypes', () => {
    it('should return unique product types', async () => {
      productsService.getUniqueTypes.mockResolvedValue([
        'Monitor',
        'Mouse',
        'Keyboard',
      ]);

      const result = await resolver.productTypes();

      expect(result).toEqual(['Monitor', 'Mouse', 'Keyboard']);
      expect(productsService.getUniqueTypes).toHaveBeenCalledTimes(1);
    });
  });

  describe('productSpecs', () => {
    it('should return unique product specifications', async () => {
      productsService.getUniqueSpecs.mockResolvedValue(['Full HD', '4K']);

      const result = await resolver.productSpecs();

      expect(result).toEqual(['Full HD', '4K']);
      expect(productsService.getUniqueSpecs).toHaveBeenCalledTimes(1);
    });
  });
});
