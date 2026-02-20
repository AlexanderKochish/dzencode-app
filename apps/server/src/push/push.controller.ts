import { Controller, Post, Delete, Get, Body } from '@nestjs/common';
import { PushService } from './push.service';

class SubscribeBody {
  endpoint!: string;
  keys!: { p256dh: string; auth: string };
}

class UnsubscribeBody {
  endpoint!: string;
}

@Controller('push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Get('vapid-public-key')
  getVapidPublicKey() {
    return { key: this.pushService.getPublicKey() };
  }

  @Post('subscribe')
  subscribe(@Body() body: SubscribeBody) {
    return this.pushService.subscribe(body);
  }

  @Delete('unsubscribe')
  unsubscribe(@Body() body: UnsubscribeBody) {
    return this.pushService.unsubscribe(body.endpoint);
  }
}
