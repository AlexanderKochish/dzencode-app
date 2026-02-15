import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '@/events/events.gateway';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private readonly eventsGateway: EventsGateway,
  ) {}
  async findAll(limit: number = 20, offset: number = 0, type?: string) {
    const where = type ? { type } : {};
    const [items, totalCount] = await this.prisma.client.$transaction([
      this.prisma.client.product.findMany({
        where,
        take: limit,
        skip: offset,
        include: {
          order: true,
        },
        orderBy: { date: 'desc' },
      }),
      this.prisma.client.product.count({ where }),
    ]);

    return {
      items,
      totalCount,
    };
  }

  async getUniqueTypes(): Promise<string[]> {
    const products = await this.prisma.client.product.findMany({
      distinct: ['type'],
      select: { type: true },
    });

    return products.map((p) => p.type);
  }

  async remove(id: number) {
    const deletedProduct = await this.prisma.client.product.delete({
      where: { id: Number(id) },
    });

    this.eventsGateway.sendToAll('productDeleted', { id });

    return deletedProduct;
  }
}
