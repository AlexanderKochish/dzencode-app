import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { EventsModule } from '@/events/events.module';

@Module({
  imports: [EventsModule],
  providers: [ProductsResolver, ProductsService],
})
export class ProductsModule {}
