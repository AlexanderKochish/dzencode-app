import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '@/events/events.gateway';
import { PushService } from '@/push/push.service';

const MAX_LIMIT = 100;

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private readonly eventsGateway: EventsGateway,
    private readonly pushService: PushService,
  ) {}

  async findAll(
    limit: number = 20,
    offset: number = 0,
    type?: string,
    spec?: string,
  ) {
    const safeLimit = Math.min(Math.max(limit, 1), MAX_LIMIT);
    const safeOffset = Math.max(offset, 0);

    const where: Record<string, unknown> = {};
    if (type) where.type = type;
    if (spec) where.specification = spec;

    const [items, totalCount] = await this.prisma.client.$transaction([
      this.prisma.client.product.findMany({
        where,
        take: safeLimit,
        skip: safeOffset,
        include: { order: true },
        orderBy: { date: 'desc' },
      }),
      this.prisma.client.product.count({ where }),
    ]);

    return { items, totalCount };
  }

  async getUniqueTypes(): Promise<string[]> {
    const rows = await this.prisma.client.product.findMany({
      distinct: ['type'],
      select: { type: true },
      orderBy: { type: 'asc' },
    });
    return rows.map((p) => p.type);
  }

  async getUniqueSpecs(): Promise<string[]> {
    const rows = await this.prisma.client.product.findMany({
      distinct: ['specification'],
      select: { specification: true },
      orderBy: { specification: 'asc' },
    });
    return rows.map((p) => p.specification);
  }

  async remove(id: number) {
    const product = await this.prisma.client.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    const deleted = await this.prisma.client.product.delete({
      where: { id },
    });

    this.eventsGateway.sendToAll('productDeleted', { id });

    this.pushService
      .broadcast({
        title: 'Продукт удалён',
        body: `Продукт "${product.title}" (#${id}) был удалён`,
        tag: `product-deleted-${id}`,
        url: '/products',
      })
      .catch(() => {});

    return deleted;
  }
}
