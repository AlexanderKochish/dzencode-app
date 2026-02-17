import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TranslationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(locale: string, namespace?: string) {
    return this.prisma.client.translation.findMany({
      where: {
        locale,
        ...(namespace ? { namespace } : {}),
      },
      select: { key: true, value: true, namespace: true, locale: true },
      orderBy: [{ namespace: 'asc' }, { key: 'asc' }],
    });
  }

  async findOne(locale: string, namespace: string, key: string) {
    return this.prisma.client.translation.findUnique({
      where: { locale_namespace_key: { locale, namespace, key } },
      select: { key: true, value: true, namespace: true, locale: true },
    });
  }
}
