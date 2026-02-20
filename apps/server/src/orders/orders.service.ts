import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '@/events/events.gateway';
import { PushService } from '@/push/push.service';

const MAX_LIMIT = 100;

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private readonly eventsGateway: EventsGateway,
    private readonly pushService: PushService,
  ) {}

  async findAll(limit: number, offset: number) {
    const safeLimit = Math.min(Math.max(limit, 1), MAX_LIMIT);
    const safeOffset = Math.max(offset, 0);

    const [items, totalCount] = await this.prisma.client.$transaction([
      this.prisma.client.order.findMany({
        take: safeLimit,
        skip: safeOffset,
        include: { products: true },
        orderBy: { date: 'desc' },
      }),
      this.prisma.client.order.count(),
    ]);

    return { items, totalCount };
  }

  async remove(id: number) {
    const order = await this.prisma.client.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    const deletedOrder = await this.prisma.client.order.delete({
      where: { id },
    });

    this.eventsGateway.sendToAll('orderDeleted', { id });

    this.pushService
      .broadcast({
        title: 'Заказ удалён',
        body: `Заказ "${order.title}" (#${id}) был удалён`,
        tag: `order-deleted-${id}`,
        url: '/orders',
      })
      .catch(() => {});

    return deletedOrder;
  }
}
