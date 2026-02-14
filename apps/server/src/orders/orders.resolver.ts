import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order, OrderTotal } from './entities/order.entity';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Query(() => [Order], { name: 'orders' })
  findAll() {
    return this.ordersService.findAll();
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
