import {
  Resolver,
  Query,
  Args,
  Int,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order, OrdersResponse, OrderTotal } from './entities/order.entity';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Query(() => OrdersResponse, { name: 'orders' })
  async findAll(
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number,
  ) {
    return await this.ordersService.findAll(limit, offset);
  }

  @Mutation(() => Order)
  async removeOrder(@Args('id', { type: () => Int }) id: number) {
    return this.ordersService.remove(id);
  }

  @ResolveField(() => [OrderTotal])
  total(@Parent() order: Order): OrderTotal[] {
    const products = order.products || [];
    const totals: Record<string, number> = {};

    products.forEach((product) => {
      product.price.forEach((p) => {
        if (!totals[p.symbol]) totals[p.symbol] = 0;
        totals[p.symbol] += p.value;
      });
    });

    return Object.entries(totals).map(([symbol, value]) => ({
      symbol,
      value: parseFloat(value.toFixed(2)),
    }));
  }
}
