import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Translation {
  @Field()
  key!: string;

  @Field()
  value!: string;

  @Field()
  namespace!: string;

  @Field()
  locale!: string;
}
