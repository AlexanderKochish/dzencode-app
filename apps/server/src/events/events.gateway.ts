import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
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

  async handleConnection(client: Socket) {
    const count = await this.redisService.incr(this.TAB_KEY);
    this.broadcastCount(count);
    console.log(`Tab connected. Total: ${count}`);
  }

  async handleDisconnect(client: Socket) {
    const count = await this.redisService.decr(this.TAB_KEY);
    this.broadcastCount(count);
    console.log(`Tab disconnected. Total: ${count}`);
  }

  private broadcastCount(count: number) {
    this.server.emit('updateActiveTabs', count);
  }
}
