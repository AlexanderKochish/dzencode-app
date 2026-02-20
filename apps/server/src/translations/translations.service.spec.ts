import { Test, TestingModule } from '@nestjs/testing';
import { TranslationsService } from './translations.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TranslationsService', () => {
  let service: TranslationsService;
  let prismaService: { client: Record<string, any> };

  const mockTranslation = {
    key: 'hello',
    value: 'Привет',
    namespace: 'common',
    locale: 'ru',
  };

  beforeEach(async () => {
    prismaService = {
      client: {
        translation: {
          findMany: jest.fn(),
          findUnique: jest.fn(),
        },
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TranslationsService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    service = module.get<TranslationsService>(TranslationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return translations for a locale', async () => {
      prismaService.client.translation.findMany.mockResolvedValue([
        mockTranslation,
      ]);

      const result = await service.findAll('ru');

      expect(result).toEqual([mockTranslation]);
      expect(prismaService.client.translation.findMany).toHaveBeenCalledWith({
        where: { locale: 'ru' },
        select: { key: true, value: true, namespace: true, locale: true },
        orderBy: [{ namespace: 'asc' }, { key: 'asc' }],
      });
    });

    it('should filter by namespace when provided', async () => {
      prismaService.client.translation.findMany.mockResolvedValue([
        mockTranslation,
      ]);

      const result = await service.findAll('ru', 'common');

      expect(result).toEqual([mockTranslation]);
      expect(prismaService.client.translation.findMany).toHaveBeenCalledWith({
        where: { locale: 'ru', namespace: 'common' },
        select: { key: true, value: true, namespace: true, locale: true },
        orderBy: [{ namespace: 'asc' }, { key: 'asc' }],
      });
    });

    it('should return empty array when no translations found', async () => {
      prismaService.client.translation.findMany.mockResolvedValue([]);

      const result = await service.findAll('fr');

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a single translation by composite key', async () => {
      prismaService.client.translation.findUnique.mockResolvedValue(
        mockTranslation,
      );

      const result = await service.findOne('ru', 'common', 'hello');

      expect(result).toEqual(mockTranslation);
      expect(prismaService.client.translation.findUnique).toHaveBeenCalledWith({
        where: {
          locale_namespace_key: {
            locale: 'ru',
            namespace: 'common',
            key: 'hello',
          },
        },
        select: { key: true, value: true, namespace: true, locale: true },
      });
    });

    it('should return null when translation not found', async () => {
      prismaService.client.translation.findUnique.mockResolvedValue(null);

      const result = await service.findOne('ru', 'common', 'nonexistent');

      expect(result).toBeNull();
    });
  });
});
