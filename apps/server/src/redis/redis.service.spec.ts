import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';

describe('RedisService', () => {
  let service: RedisService;
  let mockRedisClient: Record<string, jest.Mock>;

  beforeEach(async () => {
    mockRedisClient = {
      incr: jest.fn(),
      decr: jest.fn(),
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        { provide: 'REDIS_CLIENT', useValue: mockRedisClient },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('incr', () => {
    it('should increment a key and return the new value', async () => {
      mockRedisClient.incr.mockResolvedValue(5);

      const result = await service.incr('counter');

      expect(mockRedisClient.incr).toHaveBeenCalledWith('counter');
      expect(result).toBe(5);
    });
  });

  describe('decr', () => {
    it('should decrement a key and return the new value', async () => {
      mockRedisClient.decr.mockResolvedValue(3);

      const result = await service.decr('counter');

      expect(mockRedisClient.decr).toHaveBeenCalledWith('counter');
      expect(result).toBe(3);
    });
  });

  describe('get', () => {
    it('should return the value for an existing key', async () => {
      mockRedisClient.get.mockResolvedValue('hello');

      const result = await service.get('myKey');

      expect(mockRedisClient.get).toHaveBeenCalledWith('myKey');
      expect(result).toBe('hello');
    });

    it('should return null for a non-existing key', async () => {
      mockRedisClient.get.mockResolvedValue(null);

      const result = await service.get('nonExistent');

      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should set a string value', async () => {
      mockRedisClient.set.mockResolvedValue('OK');

      await service.set('key', 'value');

      expect(mockRedisClient.set).toHaveBeenCalledWith('key', 'value');
    });

    it('should convert a number value to string', async () => {
      mockRedisClient.set.mockResolvedValue('OK');

      await service.set('key', 42);

      expect(mockRedisClient.set).toHaveBeenCalledWith('key', '42');
    });
  });
});
