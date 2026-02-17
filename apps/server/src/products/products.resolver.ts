import { Resolver, Query, Args, Mutation, Int } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product, ProductsResponse } from './entities/product.entity';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query(() => ProductsResponse, { name: 'products' })
  async findAll(
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number,
    @Args('type', { nullable: true }) type?: string,
    @Args('spec', { nullable: true }) spec?: string,
  ) {
    return await this.productsService.findAll(limit, offset, type, spec);
  }

  @Mutation(() => Product)
  async removeProduct(@Args('id', { type: () => Int }) id: number) {
    return this.productsService.remove(id);
  }

  @Query(() => [String])
  async productTypes() {
    return this.productsService.getUniqueTypes();
  }

  @Query(() => [String])
  async productSpecs() {
    return this.productsService.getUniqueSpecs();
  }
}
