import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { HealthController } from '@/health/health.controller';
import { Server } from 'http';

describe('HealthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health should return 200 with status ok', async () => {
    await request(app.getHttpServer() as Server)
      .get('/health')
      .expect(200)
      .expect({ status: 'ok' });
  });
});
