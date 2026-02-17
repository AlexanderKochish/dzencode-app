import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import { EventsModule } from '@/events/events.module';

@Module({
  imports: [EventsModule],
  providers: [OrdersResolver, OrdersService],
})
export class OrdersModule {}
