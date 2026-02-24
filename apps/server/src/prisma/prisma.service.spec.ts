import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

jest.mock('@dzencode/db', () => ({
  prisma: {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  },
  PrismaClient: jest.fn(),
}));

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have a client property', () => {
    expect(service.client).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should call $connect on the client', async () => {
      const connectSpy = jest
        .spyOn(service.client, '$connect')
        .mockResolvedValue();
      await service.onModuleInit();

      expect(jest.mocked(connectSpy)).toHaveBeenCalledTimes(1);
    });
  });

  describe('onModuleDestroy', () => {
    it('should call $disconnect on the client', async () => {
      const disconnectSpy = jest
        .spyOn(service.client, '$disconnect')
        .mockResolvedValue();
      await service.onModuleDestroy();

      expect(jest.mocked(disconnectSpy)).toHaveBeenCalledTimes(1);
    });
  });
});
