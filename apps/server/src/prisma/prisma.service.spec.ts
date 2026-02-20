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
      await service.onModuleInit();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(jest.mocked(service.client.$connect)).toHaveBeenCalledTimes(1);
    });
  });

  describe('onModuleDestroy', () => {
    it('should call $disconnect on the client', async () => {
      await service.onModuleDestroy();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(jest.mocked(service.client.$disconnect)).toHaveBeenCalledTimes(1);
    });
  });
});
