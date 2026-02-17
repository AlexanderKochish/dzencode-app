import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import redisConfig from '../config/redis.config';
import { RedisService } from './redis.service';

export interface RedisConfig {
  url?: string;
  host?: string;
  port?: number;
  password?: string;
}

export interface AppConfig {
  redis: RedisConfig;
}

@Module({
  imports: [ConfigModule.forFeature(redisConfig)],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const redisConf = configService.get<RedisConfig>('redis');
        const url = redisConf?.url;
        const host = redisConf?.host || 'localhost';
        const port = redisConf?.port || 6379;

        const client = createClient({
          url: url ?? `redis://${host}:${port}`,
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
