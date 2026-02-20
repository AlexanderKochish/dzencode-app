import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { EventsModule } from '@/events/events.module';
import { PushModule } from '@/push/push.module';

@Module({
  imports: [EventsModule, PushModule],
  providers: [ProductsResolver, ProductsService],
})
export class ProductsModule {}
