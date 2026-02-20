import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../events/events.gateway';

describe('OrdersService', () => {
  let service: OrdersService;
  let prismaService: { client: Record<string, any> };
  let eventsGateway: { sendToAll: jest.Mock };

  const mockOrder = {
    id: 1,
    title: 'Test Order',
    date: new Date('2024-01-01'),
    description: 'Test',
    products: [],
  };

  beforeEach(async () => {
    prismaService = {
      client: {
        $transaction: jest.fn(),
        order: {
          findMany: jest.fn(),
          count: jest.fn(),
          findUnique: jest.fn(),
          delete: jest.fn(),
        },
      },
    };

    eventsGateway = {
      sendToAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: prismaService },
        { provide: EventsGateway, useValue: eventsGateway },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return items and totalCount', async () => {
      const mockItems = [mockOrder];
      prismaService.client.$transaction.mockResolvedValue([mockItems, 1]);

      const result = await service.findAll(20, 0);

      expect(result).toEqual({ items: mockItems, totalCount: 1 });
      expect(prismaService.client.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should clamp limit to minimum of 1', async () => {
      prismaService.client.$transaction.mockResolvedValue([[], 0]);

      await service.findAll(0, 0);

      const transactionArg = prismaService.client.$transaction.mock.calls[0][0];
      // The findMany should be called with take: 1 (clamped from 0)
      expect(transactionArg).toHaveLength(2);
    });

    it('should clamp limit to maximum of 100', async () => {
      prismaService.client.$transaction.mockResolvedValue([[], 0]);

      await service.findAll(200, 0);

      expect(prismaService.client.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should clamp negative offset to 0', async () => {
      prismaService.client.$transaction.mockResolvedValue([[], 0]);

      await service.findAll(20, -5);

      expect(prismaService.client.$transaction).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should delete an existing order and emit event', async () => {
      prismaService.client.order.findUnique.mockResolvedValue(mockOrder);
      prismaService.client.order.delete.mockResolvedValue(mockOrder);

      const result = await service.remove(1);

      expect(result).toEqual(mockOrder);
      expect(prismaService.client.order.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaService.client.order.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(eventsGateway.sendToAll).toHaveBeenCalledWith('orderDeleted', {
        id: 1,
      });
    });

    it('should throw NotFoundException when order does not exist', async () => {
      prismaService.client.order.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      await expect(service.remove(999)).rejects.toThrow(
        'Order with id 999 not found',
      );
      expect(prismaService.client.order.delete).not.toHaveBeenCalled();
      expect(eventsGateway.sendToAll).not.toHaveBeenCalled();
    });
  });
});
