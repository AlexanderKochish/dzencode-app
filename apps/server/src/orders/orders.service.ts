import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '@/events/events.gateway';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async findAll() {
    return this.prisma.client.order.findMany({
      include: {
        products: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async remove(id: number) {
    const deletedOrder = await this.prisma.client.order.delete({
      where: { id },
    });
    this.eventsGateway.sendToAll('order_deleted', { id });
    return deletedOrder;
  }
}
