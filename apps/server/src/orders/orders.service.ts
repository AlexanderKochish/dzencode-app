import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '@/events/events.gateway';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async findAll(limit: number, offset: number) {
    const [items, totalCount] = await this.prisma.client.$transaction([
      this.prisma.client.order.findMany({
        take: limit,
        skip: offset,
        include: { products: true },
        orderBy: { date: 'desc' },
      }),
      this.prisma.client.order.count(),
    ]);

    return { items, totalCount };
  }

  async remove(id: number) {
    const deletedOrder = await this.prisma.client.order.delete({
      where: { id },
    });
    this.eventsGateway.sendToAll('orderDeleted', { id });
    return deletedOrder;
  }
}
