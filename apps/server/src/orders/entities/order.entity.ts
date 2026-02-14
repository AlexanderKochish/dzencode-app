import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Product } from '../../products/entities/product.entity';

@ObjectType()
export class OrderTotal {
  @Field(() => Float)
  value!: number;

  @Field()
  symbol!: string;
}

@ObjectType()
export class Order {
  @Field(() => Int)
  id!: number;

  @Field()
  title!: string;

  @Field()
  date!: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [Product], { defaultValue: [] })
  products!: Product[];

  @Field(() => [OrderTotal], { description: 'Сумма прихода в разных валютах' })
  total!: OrderTotal[];
}
