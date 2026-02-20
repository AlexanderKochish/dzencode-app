import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PushService } from './push.service';
import { PushController } from './push.controller';
import vapidConfig from '../config/vapid.config';

@Module({
  imports: [ConfigModule.forFeature(vapidConfig)],
  controllers: [PushController],
  providers: [PushService],
  exports: [PushService],
})
export class PushModule {}
