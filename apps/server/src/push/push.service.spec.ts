import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { PushService } from './push.service';
import { PrismaService } from '../prisma/prisma.service';
import * as webPush from 'web-push';

jest.mock('web-push', () => ({
  setVapidDetails: jest.fn(),
  sendNotification: jest.fn(),
}));

interface MockPrismaClient {
  pushSubscription: {
    upsert: jest.Mock;
    delete: jest.Mock;
    findMany: jest.Mock;
    deleteMany: jest.Mock;
  };
}

describe('PushService', () => {
  let service: PushService;
  let mockClient: MockPrismaClient;
  let configService: { get: jest.Mock };

  beforeEach(async () => {
    mockClient = {
      pushSubscription: {
        upsert: jest.fn(),
        delete: jest.fn(),
        findMany: jest.fn(),
        deleteMany: jest.fn(),
      },
    };

    configService = {
      get: jest.fn((key: string) => {
        const map: Record<string, string> = {
          'vapid.publicKey': 'test-public-key',
          'vapid.privateKey': 'test-private-key',
          'vapid.subject': 'mailto:test@test.com',
        };
        return map[key];
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PushService,
        { provide: PrismaService, useValue: { client: mockClient } },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<PushService>(PushService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should configure VAPID when keys are present', () => {
      service.onModuleInit();

      expect(webPush.setVapidDetails).toHaveBeenCalledWith(
        'mailto:test@test.com',
        'test-public-key',
        'test-private-key',
      );
    });

    it('should skip VAPID setup when keys are missing', () => {
      configService.get.mockReturnValue('');
      service.onModuleInit();

      expect(webPush.setVapidDetails).not.toHaveBeenCalled();
    });
  });

  describe('getPublicKey', () => {
    it('should return the VAPID public key', () => {
      expect(service.getPublicKey()).toBe('test-public-key');
    });
  });

  describe('subscribe', () => {
    it('should upsert a valid subscription', async () => {
      mockClient.pushSubscription.upsert.mockResolvedValue({});

      const result = await service.subscribe({
        endpoint: 'https://push.example.com/sub/123',
        keys: { p256dh: 'key-p256dh', auth: 'key-auth' },
      });

      expect(result).toEqual({ success: true });
      expect(mockClient.pushSubscription.upsert).toHaveBeenCalledWith({
        where: { endpoint: 'https://push.example.com/sub/123' },
        update: { p256dh: 'key-p256dh', auth: 'key-auth' },
        create: {
          endpoint: 'https://push.example.com/sub/123',
          p256dh: 'key-p256dh',
          auth: 'key-auth',
        },
      });
    });

    it('should throw BadRequestException for invalid payload', async () => {
      await expect(
        service.subscribe({ endpoint: '', keys: { p256dh: '', auth: '' } }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('unsubscribe', () => {
    it('should delete subscription by endpoint', async () => {
      mockClient.pushSubscription.delete.mockResolvedValue({});

      const result = await service.unsubscribe(
        'https://push.example.com/sub/123',
      );

      expect(result).toEqual({ success: true });
      expect(mockClient.pushSubscription.delete).toHaveBeenCalledWith({
        where: { endpoint: 'https://push.example.com/sub/123' },
      });
    });

    it('should not throw when subscription does not exist', async () => {
      mockClient.pushSubscription.delete.mockRejectedValue(
        new Error('Not found'),
      );

      await expect(service.unsubscribe('nonexistent')).resolves.toEqual({
        success: true,
      });
    });
  });

  describe('broadcast', () => {
    it('should send push to all subscriptions', async () => {
      mockClient.pushSubscription.findMany.mockResolvedValue([
        { id: 1, endpoint: 'https://ep1', p256dh: 'k1', auth: 'a1' },
        { id: 2, endpoint: 'https://ep2', p256dh: 'k2', auth: 'a2' },
      ]);
      (webPush.sendNotification as jest.Mock).mockResolvedValue({});

      await service.broadcast({ title: 'Test', body: 'Hello' });

      expect(webPush.sendNotification).toHaveBeenCalledTimes(2);
    });

    it('should cleanup stale subscriptions (410 Gone)', async () => {
      mockClient.pushSubscription.findMany.mockResolvedValue([
        { id: 1, endpoint: 'https://ep1', p256dh: 'k1', auth: 'a1' },
      ]);
      (webPush.sendNotification as jest.Mock).mockRejectedValue({
        statusCode: 410,
      });
      mockClient.pushSubscription.deleteMany.mockResolvedValue({});

      await service.broadcast({ title: 'Test', body: 'Hello' });

      expect(mockClient.pushSubscription.deleteMany).toHaveBeenCalledWith({
        where: { id: { in: [1] } },
      });
    });

    it('should skip broadcast when VAPID not configured', async () => {
      configService.get.mockReturnValue('');

      await service.broadcast({ title: 'Test', body: 'Hello' });

      expect(mockClient.pushSubscription.findMany).not.toHaveBeenCalled();
    });
  });
});
