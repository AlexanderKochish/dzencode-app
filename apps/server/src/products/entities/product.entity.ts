import { Order } from '@/orders/entities/order.entity';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
class Guarantee {
  @Field()
  start!: string;

  @Field()
  end!: string;
}

@ObjectType()
class Price {
  @Field(() => Float)
  value!: number;

  @Field()
  symbol!: string;

  @Field(() => Int)
  isDefault!: number;
}

@ObjectType()
export class Product {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  serialNumber!: number;

  @Field(() => Int)
  isNew!: number;

  @Field()
  photo!: string;

  @Field()
  title!: string;

  @Field()
  type!: string;

  @Field()
  specification!: string;

  @Field(() => Guarantee)
  guarantee!: Guarantee;

  @Field(() => [Price])
  price!: Price[];

  @Field(() => Order)
  order!: Order;

  @Field(() => Int)
  orderId!: number;

  @Field()
  date!: string;
}
