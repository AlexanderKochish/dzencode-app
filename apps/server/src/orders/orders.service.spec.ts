import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../events/events.gateway';
import { PushService } from '../push/push.service';

interface MockPrismaClient {
  $transaction: jest.Mock;
  order: {
    findMany: jest.Mock;
    count: jest.Mock;
    findUnique: jest.Mock;
    delete: jest.Mock;
  };
}

describe('OrdersService', () => {
  let service: OrdersService;
  let mockClient: MockPrismaClient;
  let eventsGateway: { sendToAll: jest.Mock };
  let pushService: { broadcast: jest.Mock };

  const mockOrder = {
    id: 1,
    title: 'Test Order',
    date: new Date('2024-01-01'),
    description: 'Test',
    products: [],
  };

  beforeEach(async () => {
    mockClient = {
      $transaction: jest.fn(),
      order: {
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
        OrdersService,
        { provide: PrismaService, useValue: { client: mockClient } },
        { provide: EventsGateway, useValue: eventsGateway },
        { provide: PushService, useValue: pushService },
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
      mockClient.$transaction.mockResolvedValue([mockItems, 1]);

      const result = await service.findAll(20, 0);

      expect(result).toEqual({ items: mockItems, totalCount: 1 });
      expect(mockClient.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should clamp limit to minimum of 1', async () => {
      mockClient.$transaction.mockResolvedValue([[], 0]);

      await service.findAll(0, 0);

      const transactionArg = mockClient.$transaction.mock.calls[0] as unknown[];
      expect(transactionArg).toHaveLength(1);
    });

    it('should clamp limit to maximum of 100', async () => {
      mockClient.$transaction.mockResolvedValue([[], 0]);

      await service.findAll(200, 0);

      expect(mockClient.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should clamp negative offset to 0', async () => {
      mockClient.$transaction.mockResolvedValue([[], 0]);

      await service.findAll(20, -5);

      expect(mockClient.$transaction).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should delete an existing order, emit event, and send push', async () => {
      mockClient.order.findUnique.mockResolvedValue(mockOrder);
      mockClient.order.delete.mockResolvedValue(mockOrder);

      const result = await service.remove(1);

      expect(result).toEqual(mockOrder);
      expect(mockClient.order.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockClient.order.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(eventsGateway.sendToAll).toHaveBeenCalledWith('orderDeleted', {
        id: 1,
      });
      expect(pushService.broadcast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Заказ удалён',
          tag: 'order-deleted-1',
        }),
      );
    });

    it('should throw NotFoundException when order does not exist', async () => {
      mockClient.order.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      await expect(service.remove(999)).rejects.toThrow(
        'Order with id 999 not found',
      );
      expect(mockClient.order.delete).not.toHaveBeenCalled();
      expect(eventsGateway.sendToAll).not.toHaveBeenCalled();
      expect(pushService.broadcast).not.toHaveBeenCalled();
    });
  });
});
