import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '../redis/redis.service';
import { getCorsOrigins } from '../shared/get-cors-origins';

@WebSocketGateway({
  cors: {
    origin: getCorsOrigins(),
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
    const sockets = await this.server.fetchSockets();
    const count = sockets.length;
    await this.redisService.set(this.TAB_KEY, count);

    client.broadcast.emit('updateActiveTabs', count);
    client.emit('updateActiveTabs', count);
  }

  async handleDisconnect() {
    const sockets = await this.server.fetchSockets();
    const count = sockets.length;
    await this.redisService.set(this.TAB_KEY, count);
    this.server.emit('updateActiveTabs', count);
  }

  @SubscribeMessage('getActiveTabs')
  async handleGetActiveTabs(client: Socket) {
    const sockets = await this.server.fetchSockets();
    client.emit('updateActiveTabs', sockets.length);
  }

  sendToAll(event: string, data: unknown) {
    this.server.emit(event, data);
  }
}
