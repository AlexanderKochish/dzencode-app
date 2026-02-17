import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { TranslationsModule } from './translations/translations.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { EventsModule } from './events/events.module';
import { ConfigModule } from '@nestjs/config';
import redisConfig from './config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [redisConfig],
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
  ],
})
export class AppModule {}
