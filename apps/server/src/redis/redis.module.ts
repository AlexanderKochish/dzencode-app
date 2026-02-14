import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import redisConfig from '../config/redis.config';
import { RedisService } from './redis.service';

export interface RedisConfig {
  host: string;
  port: number;
}

export interface AppConfig {
  redis: RedisConfig;
}

@Module({
  imports: [ConfigModule.forFeature(redisConfig)],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService<AppConfig>) => {
        const host = configService.get('redis.host', { infer: true });
        const port = configService.get('redis.port', { infer: true });

        const client = createClient({
          url: `redis://${host}:${port}`,
        });

        await client.connect();
        return client;
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
