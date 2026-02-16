import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { Server, ServerOptions } from 'socket.io';
import { INestApplication } from '@nestjs/common';

type RedisAdapterConstructor = ReturnType<typeof createAdapter>;

class RedisIoAdapter extends IoAdapter {
  private adapterConstructor!: RedisAdapterConstructor;

  async connectToRedis(): Promise<void> {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    const pubClient = createClient({ url: redisUrl });
    const subClient = pubClient.duplicate();

    try {
      await Promise.all([pubClient.connect(), subClient.connect()]);
      this.adapterConstructor = createAdapter(pubClient, subClient);
    } catch (error) {
      console.error('Redis Adapter connection failed:', error);
      throw error;
    }
  }

  override createIOServer(port: number, options?: ServerOptions): Server {
    const server = super.createIOServer(port, options) as Server;
    server.adapter(this.adapterConstructor);
    return server;
  }
}

function getCorsOrigins(): string | string[] | RegExp {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    return /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
  }

  const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000';
  return baseUrl.split(',').map((u) => u.trim());
}

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);

  const corsOrigins = getCorsOrigins();

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  const port = process.env.PORT ?? 3001;
  const host = process.env.NODE_ENV === 'production' ? '::' : '0.0.0.0';
  await app.listen(port, host);
}

bootstrap();
