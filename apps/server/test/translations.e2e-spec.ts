import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TranslationsResolver } from '@/translations/translations.resolver';
import { TranslationsService } from '@/translations/translations.service';
import { Server } from 'http';

interface GraphQLBody {
  data: {
    translations: Array<{
      key: string;
      value: string;
      namespace: string;
      locale: string;
    }>;
  };
}

describe('Translations GraphQL (e2e)', () => {
  let app: INestApplication;
  let translationsService: { findAll: jest.Mock };

  const mockTranslations = [
    { key: 'hello', value: 'Привет', namespace: 'common', locale: 'ru' },
    { key: 'bye', value: 'Пока', namespace: 'common', locale: 'ru' },
  ];

  beforeAll(async () => {
    translationsService = {
      findAll: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: true,
          path: '/graphql',
        }),
      ],
      providers: [
        TranslationsResolver,
        { provide: TranslationsService, useValue: translationsService },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Query: translations', () => {
    it('should return translations for a locale', async () => {
      translationsService.findAll.mockResolvedValue(mockTranslations);

      const query = `
        query {
          translations(locale: "ru") {
            key
            value
            namespace
            locale
          }
        }
      `;

      const response = await request(app.getHttpServer() as Server)
        .post('/graphql')
        .send({ query })
        .expect(200);

      const body = response.body as GraphQLBody;
      expect(body.data.translations).toHaveLength(2);
      expect(body.data.translations[0].key).toBe('hello');
      expect(body.data.translations[0].locale).toBe('ru');
      expect(translationsService.findAll).toHaveBeenCalledWith('ru', undefined);
    });

    it('should filter by namespace', async () => {
      translationsService.findAll.mockResolvedValue([mockTranslations[0]]);

      const query = `
        query {
          translations(locale: "ru", namespace: "common") {
            key
            value
          }
        }
      `;

      const response = await request(app.getHttpServer() as Server)
        .post('/graphql')
        .send({ query })
        .expect(200);

      expect(translationsService.findAll).toHaveBeenCalledWith('ru', 'common');
      const body = response.body as GraphQLBody;
      expect(body.data.translations).toHaveLength(1);
    });

    it('should return empty array when no translations found', async () => {
      translationsService.findAll.mockResolvedValue([]);

      const query = `
        query {
          translations(locale: "fr") {
            key
            value
          }
        }
      `;

      const response = await request(app.getHttpServer() as Server)
        .post('/graphql')
        .send({ query })
        .expect(200);

      const body = response.body as GraphQLBody;
      expect(body.data.translations).toEqual([]);
    });
  });
});
