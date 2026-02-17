import { Module } from '@nestjs/common';
import { TranslationsService } from './translations.service';
import { TranslationsResolver } from './translations.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TranslationsService, TranslationsResolver],
  exports: [TranslationsService],
})
export class TranslationsModule {}
