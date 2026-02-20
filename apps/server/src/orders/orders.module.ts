import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import { EventsModule } from '@/events/events.module';
import { PushModule } from '@/push/push.module';

@Module({
  imports: [EventsModule, PushModule],
  providers: [OrdersResolver, OrdersService],
})
export class OrdersModule {}
