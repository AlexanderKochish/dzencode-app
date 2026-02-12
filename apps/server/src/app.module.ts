import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis/redis.module';
import { EventsGateway } from './events/events.gateway';

@Module({
  imports: [RedisModule],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
