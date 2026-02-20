import { Test, TestingModule } from '@nestjs/testing';
import { TranslationsResolver } from './translations.resolver';
import { TranslationsService } from './translations.service';

describe('TranslationsResolver', () => {
  let resolver: TranslationsResolver;
  let translationsService: { findAll: jest.Mock };

  const mockTranslation = {
    key: 'hello',
    value: 'Привет',
    namespace: 'common',
    locale: 'ru',
  };

  beforeEach(async () => {
    translationsService = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TranslationsResolver,
        { provide: TranslationsService, useValue: translationsService },
      ],
    }).compile();

    resolver = module.get<TranslationsResolver>(TranslationsResolver);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAll', () => {
    it('should return translations for a locale', () => {
      translationsService.findAll.mockResolvedValue([mockTranslation]);

      const result = resolver.findAll('ru');

      expect(translationsService.findAll).toHaveBeenCalledWith(
        'ru',
        undefined,
      );
    });

    it('should pass namespace filter', () => {
      translationsService.findAll.mockResolvedValue([mockTranslation]);

      resolver.findAll('ru', 'common');

      expect(translationsService.findAll).toHaveBeenCalledWith('ru', 'common');
    });
  });
});
