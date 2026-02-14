import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '@/events/events.gateway';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private readonly eventsGateway: EventsGateway,
  ) {}
  async findAll(type?: string) {
    return await this.prisma.client.product.findMany({
      where: {
        ...(type && { type }),
      },

      include: {
        order: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async remove(id: number) {
    const deletedProduct = await this.prisma.client.product.delete({
      where: { id },
    });

    this.eventsGateway.sendToAll('productDeleted', { id });

    return deletedProduct;
  }
}
