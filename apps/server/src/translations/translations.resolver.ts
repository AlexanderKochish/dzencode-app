import { Resolver, Query, Args } from '@nestjs/graphql';
import { TranslationsService } from './translations.service';
import { Translation } from './translation.entity';

@Resolver(() => Translation)
export class TranslationsResolver {
  constructor(private readonly translationsService: TranslationsService) {}

  @Query(() => [Translation], { name: 'translations' })
  findAll(
    @Args('locale') locale: string,
    @Args('namespace', { nullable: true }) namespace?: string,
  ) {
    return this.translationsService.findAll(locale, namespace);
  }
}
