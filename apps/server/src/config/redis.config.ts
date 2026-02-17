import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => {
  if (process.env.REDIS_URL) {
    return { url: process.env.REDIS_URL };
  }

  return {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  };
});
