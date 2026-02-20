import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { RedisModule } from './redis/redis.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { TranslationsModule } from './translations/translations.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { EventsModule } from './events/events.module';
import { PushModule } from './push/push.module';
import { ConfigModule } from '@nestjs/config';
import redisConfig from './config/redis.config';
import vapidConfig from './config/vapid.config';

@Module({
  controllers: [HealthController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [redisConfig, vapidConfig],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      path: '/graphql',
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
    }),
    RedisModule,
    OrdersModule,
    ProductsModule,
    TranslationsModule,
    PrismaModule,
    EventsModule,
    PushModule,
  ],
})
export class AppModule {}
