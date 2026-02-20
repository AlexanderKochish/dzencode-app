import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../events/events.gateway';
import { PushService } from '../push/push.service';

interface MockPrismaClient {
  $transaction: jest.Mock;
  product: {
    findMany: jest.Mock;
    count: jest.Mock;
    findUnique: jest.Mock;
    delete: jest.Mock;
  };
}

describe('ProductsService', () => {
  let service: ProductsService;
  let mockClient: MockPrismaClient;
  let eventsGateway: { sendToAll: jest.Mock };
  let pushService: { broadcast: jest.Mock };

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
    mockClient = {
      $transaction: jest.fn(),
      product: {
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
    };

    eventsGateway = { sendToAll: jest.fn() };
    pushService = { broadcast: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: { client: mockClient } },
        { provide: EventsGateway, useValue: eventsGateway },
        { provide: PushService, useValue: pushService },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return items and totalCount without filters', async () => {
      const mockItems = [mockProduct];
      mockClient.$transaction.mockResolvedValue([mockItems, 1]);

      const result = await service.findAll(20, 0);

      expect(result).toEqual({ items: mockItems, totalCount: 1 });
      expect(mockClient.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should apply type filter when provided', async () => {
      mockClient.$transaction.mockResolvedValue([[], 0]);

      await service.findAll(20, 0, 'Monitor');

      expect(mockClient.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should apply spec filter when provided', async () => {
      mockClient.$transaction.mockResolvedValue([[], 0]);

      await service.findAll(20, 0, undefined, 'Full HD');

      expect(mockClient.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should apply both type and spec filters', async () => {
      mockClient.$transaction.mockResolvedValue([[], 0]);

      await service.findAll(20, 0, 'Monitor', 'Full HD');

      expect(mockClient.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should clamp limit to minimum of 1', async () => {
      mockClient.$transaction.mockResolvedValue([[], 0]);

      await service.findAll(0, 0);

      expect(mockClient.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should clamp limit to maximum of 100', async () => {
      mockClient.$transaction.mockResolvedValue([[], 0]);

      await service.findAll(200, 0);

      expect(mockClient.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should clamp negative offset to 0', async () => {
      mockClient.$transaction.mockResolvedValue([[], 0]);

      await service.findAll(20, -10);

      expect(mockClient.$transaction).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUniqueTypes', () => {
    it('should return unique product types', async () => {
      mockClient.product.findMany.mockResolvedValue([
        { type: 'Monitor' },
        { type: 'Mouse' },
        { type: 'Keyboard' },
      ]);

      const result = await service.getUniqueTypes();

      expect(result).toEqual(['Monitor', 'Mouse', 'Keyboard']);
      expect(mockClient.product.findMany).toHaveBeenCalledWith({
        distinct: ['type'],
        select: { type: true },
        orderBy: { type: 'asc' },
      });
    });

    it('should return empty array when no products', async () => {
      mockClient.product.findMany.mockResolvedValue([]);

      const result = await service.getUniqueTypes();

      expect(result).toEqual([]);
    });
  });

  describe('getUniqueSpecs', () => {
    it('should return unique product specifications', async () => {
      mockClient.product.findMany.mockResolvedValue([
        { specification: 'Full HD' },
        { specification: '4K' },
      ]);

      const result = await service.getUniqueSpecs();

      expect(result).toEqual(['Full HD', '4K']);
      expect(mockClient.product.findMany).toHaveBeenCalledWith({
        distinct: ['specification'],
        select: { specification: true },
        orderBy: { specification: 'asc' },
      });
    });

    it('should return empty array when no products', async () => {
      mockClient.product.findMany.mockResolvedValue([]);

      const result = await service.getUniqueSpecs();

      expect(result).toEqual([]);
    });
  });

  describe('remove', () => {
    it('should delete an existing product, emit event, and send push', async () => {
      mockClient.product.findUnique.mockResolvedValue(mockProduct);
      mockClient.product.delete.mockResolvedValue(mockProduct);

      const result = await service.remove(1);

      expect(result).toEqual(mockProduct);
      expect(mockClient.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockClient.product.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(eventsGateway.sendToAll).toHaveBeenCalledWith('productDeleted', {
        id: 1,
      });
      expect(pushService.broadcast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Продукт удалён',
          tag: 'product-deleted-1',
        }),
      );
    });

    it('should throw NotFoundException when product does not exist', async () => {
      mockClient.product.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      await expect(service.remove(999)).rejects.toThrow(
        'Product with id 999 not found',
      );
      expect(mockClient.product.delete).not.toHaveBeenCalled();
      expect(eventsGateway.sendToAll).not.toHaveBeenCalled();
      expect(pushService.broadcast).not.toHaveBeenCalled();
    });
  });
});
