import {
  Injectable,
  Logger,
  OnModuleInit,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as webPush from 'web-push';
import { PushPayloadDto, PushSubscriptionDto } from './dto/push.dto';

@Injectable()
export class PushService implements OnModuleInit {
  private readonly logger = new Logger(PushService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  onModuleInit() {
    const publicKey = this.config.get<string>('vapid.publicKey');
    const privateKey = this.config.get<string>('vapid.privateKey');
    const subject = this.config.get<string>('vapid.subject');

    if (!publicKey || !privateKey) {
      this.logger.warn(
        'VAPID keys not configured — push notifications disabled. ' +
          'Run: npx web-push generate-vapid-keys',
      );
      return;
    }

    webPush.setVapidDetails(subject!, publicKey, privateKey);
    this.logger.log('VAPID configured ✓');
  }

  getPublicKey(): string {
    return this.config.get<string>('vapid.publicKey') ?? '';
  }

  async subscribe(dto: PushSubscriptionDto) {
    if (!dto.endpoint || !dto.keys?.p256dh || !dto.keys?.auth) {
      throw new BadRequestException('Invalid push subscription payload');
    }

    await this.prisma.client.pushSubscription.upsert({
      where: { endpoint: dto.endpoint },
      update: { p256dh: dto.keys.p256dh, auth: dto.keys.auth },
      create: {
        endpoint: dto.endpoint,
        p256dh: dto.keys.p256dh,
        auth: dto.keys.auth,
      },
    });

    return { success: true };
  }

  async unsubscribe(endpoint: string) {
    await this.prisma.client.pushSubscription
      .delete({ where: { endpoint } })
      .catch(() => {
        /* already gone — ok */
      });

    return { success: true };
  }

  async broadcast(payload: PushPayloadDto) {
    const publicKey = this.config.get<string>('vapid.publicKey');
    if (!publicKey) return;

    const subscriptions = await this.prisma.client.pushSubscription.findMany();

    const body = JSON.stringify(payload);
    const staleIds: number[] = [];

    await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webPush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
            },
            body,
          );
        } catch (err: unknown) {
          const statusCode = (err as { statusCode?: number }).statusCode;

          if (statusCode === 404 || statusCode === 410) {
            staleIds.push(sub.id);
          } else {
            this.logger.error(
              `Push failed for ${sub.endpoint}: ${String(err)}`,
            );
          }
        }
      }),
    );

    if (staleIds.length > 0) {
      await this.prisma.client.pushSubscription.deleteMany({
        where: { id: { in: staleIds } },
      });
      this.logger.log(`Cleaned ${staleIds.length} stale subscriptions`);
    }
  }
}
