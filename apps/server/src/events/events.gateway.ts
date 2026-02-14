import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { RedisService } from '../redis/redis.service';

@WebSocketGateway({
  cors: {
    origin: process.env.BASE_URL ?? 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket'],
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;
  private readonly TAB_KEY = 'stats:active_tabs';

  constructor(private readonly redisService: RedisService) {}

  async handleConnection() {
    const sockets = await this.server.fetchSockets();
    const count = sockets.length;

    await this.redisService.set(this.TAB_KEY, count);

    this.broadcastCount(count);
  }

  async handleDisconnect() {
    const sockets = await this.server.fetchSockets();
    const count = sockets.length;

    await this.redisService.set(this.TAB_KEY, count);

    this.broadcastCount(count);
  }

  private broadcastCount(count: number) {
    this.server.emit('updateActiveTabs', count);
  }

  sendToAll(event: string, data: any) {
    this.server.emit(event, data);
  }
}
