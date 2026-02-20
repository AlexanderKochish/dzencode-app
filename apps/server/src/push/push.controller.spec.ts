import { Test, TestingModule } from '@nestjs/testing';
import { PushController } from './push.controller';
import { PushService } from './push.service';

describe('PushController', () => {
  let controller: PushController;
  let pushService: {
    getPublicKey: jest.Mock;
    subscribe: jest.Mock;
    unsubscribe: jest.Mock;
  };

  beforeEach(async () => {
    pushService = {
      getPublicKey: jest.fn(),
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PushController],
      providers: [{ provide: PushService, useValue: pushService }],
    }).compile();

    controller = module.get<PushController>(PushController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getVapidPublicKey', () => {
    it('should return the VAPID public key', () => {
      pushService.getPublicKey.mockReturnValue('test-key');

      expect(controller.getVapidPublicKey()).toEqual({ key: 'test-key' });
    });
  });

  describe('subscribe', () => {
    it('should call service.subscribe with body', async () => {
      pushService.subscribe.mockResolvedValue({ success: true });

      const body = {
        endpoint: 'https://push.example.com/sub/1',
        keys: { p256dh: 'key1', auth: 'auth1' },
      };

      const result = await controller.subscribe(body);

      expect(result).toEqual({ success: true });
      expect(pushService.subscribe).toHaveBeenCalledWith(body);
    });
  });

  describe('unsubscribe', () => {
    it('should call service.unsubscribe with endpoint', async () => {
      pushService.unsubscribe.mockResolvedValue({ success: true });

      const result = await controller.unsubscribe({
        endpoint: 'https://push.example.com/sub/1',
      });

      expect(result).toEqual({ success: true });
      expect(pushService.unsubscribe).toHaveBeenCalledWith(
        'https://push.example.com/sub/1',
      );
    });
  });
});
