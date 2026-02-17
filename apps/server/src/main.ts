import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { Server, ServerOptions } from 'socket.io';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getCorsOrigins } from './shared/get-cors-origins';

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

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

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

bootstrap().catch((err) => {
  console.error('Критическая ошибка при запуске приложения:', err);
  process.exit(1);
});
