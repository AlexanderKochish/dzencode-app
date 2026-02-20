import redisConfig from './redis.config';

describe('redisConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return url when REDIS_URL is set', () => {
    process.env.REDIS_URL = 'redis://my-redis:6379';

    const config = redisConfig();

    expect(config).toEqual({ url: 'redis://my-redis:6379' });
  });

  it('should return host/port/password when REDIS_URL is not set', () => {
    delete process.env.REDIS_URL;
    process.env.REDIS_HOST = 'custom-host';
    process.env.REDIS_PORT = '6380';
    process.env.REDIS_PASSWORD = 'secret';

    const config = redisConfig();

    expect(config).toEqual({
      host: 'custom-host',
      port: 6380,
      password: 'secret',
    });
  });

  it('should use default host and port when env vars not set', () => {
    delete process.env.REDIS_URL;
    delete process.env.REDIS_HOST;
    delete process.env.REDIS_PORT;
    delete process.env.REDIS_PASSWORD;

    const config = redisConfig();

    expect(config).toEqual({
      host: 'localhost',
      port: 6379,
      password: undefined,
    });
  });
});
