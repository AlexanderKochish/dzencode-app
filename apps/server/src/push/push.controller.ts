import { Controller, Post, Delete, Get, Body } from '@nestjs/common';
import { PushService } from './push.service';
import { PushSubscriptionDto } from './dto/push.dto';

@Controller('push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Get('vapid-public-key')
  getVapidPublicKey() {
    return { key: this.pushService.getPublicKey() };
  }

  @Post('subscribe')
  subscribe(@Body() body: PushSubscriptionDto) {
    return this.pushService.subscribe(body);
  }

  @Delete('unsubscribe')
  unsubscribe(@Body() body: PushSubscriptionDto) {
    return this.pushService.unsubscribe(body.endpoint);
  }
}
