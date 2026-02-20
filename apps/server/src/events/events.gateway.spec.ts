import { Test, TestingModule } from '@nestjs/testing';
import { EventsGateway } from './events.gateway';
import { RedisService } from '../redis/redis.service';
import { Socket, Server } from 'socket.io';

describe('EventsGateway', () => {
  let gateway: EventsGateway;
  let redisService: { set: jest.Mock; get: jest.Mock };
  let mockServer: {
    emit: jest.Mock;
    fetchSockets: jest.Mock;
  };

  beforeEach(async () => {
    redisService = {
      set: jest.fn(),
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsGateway,
        { provide: RedisService, useValue: redisService },
      ],
    }).compile();

    gateway = module.get<EventsGateway>(EventsGateway);

    mockServer = {
      emit: jest.fn(),
      fetchSockets: jest.fn().mockResolvedValue([{}, {}, {}]),
    };
    gateway.server = mockServer as unknown as Server;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should update active tabs count in Redis and emit to all clients', async () => {
      const broadcastEmit = jest.fn();
      const clientEmit = jest.fn();
      const mockClient = {
        broadcast: { emit: broadcastEmit },
        emit: clientEmit,
      } as unknown as Socket;

      await gateway.handleConnection(mockClient);

      expect(mockServer.fetchSockets).toHaveBeenCalledTimes(1);
      expect(redisService.set).toHaveBeenCalledWith('stats:active_tabs', 3);
      expect(broadcastEmit).toHaveBeenCalledWith('updateActiveTabs', 3);
      expect(clientEmit).toHaveBeenCalledWith('updateActiveTabs', 3);
    });
  });

  describe('handleDisconnect', () => {
    it('should update active tabs count and broadcast to all', async () => {
      mockServer.fetchSockets.mockResolvedValue([{}, {}]);

      await gateway.handleDisconnect();

      expect(mockServer.fetchSockets).toHaveBeenCalledTimes(1);
      expect(redisService.set).toHaveBeenCalledWith('stats:active_tabs', 2);
      expect(mockServer.emit).toHaveBeenCalledWith('updateActiveTabs', 2);
    });
  });

  describe('handleGetActiveTabs', () => {
    it('should emit current active tabs count to the requesting client', async () => {
      const clientEmit = jest.fn();
      const mockClient = { emit: clientEmit } as unknown as Socket;

      mockServer.fetchSockets.mockResolvedValue([{}, {}, {}, {}]);

      await gateway.handleGetActiveTabs(mockClient);

      expect(mockServer.fetchSockets).toHaveBeenCalledTimes(1);
      expect(clientEmit).toHaveBeenCalledWith('updateActiveTabs', 4);
    });
  });

  describe('sendToAll', () => {
    it('should emit event with data to all connected clients', () => {
      const data = { id: 1, action: 'test' };

      gateway.sendToAll('testEvent', data);

      expect(mockServer.emit).toHaveBeenCalledWith('testEvent', data);
    });
  });
});
