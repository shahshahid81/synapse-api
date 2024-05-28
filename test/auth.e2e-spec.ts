import * as request from 'supertest';
import { Test } from '@nestjs/testing';

import { INestApplication } from '@nestjs/common';

describe('Cats', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({}).compile();

    app = moduleRef.createNestApplication();
    request;
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });
});

/**
 * Arrange Act Assert
 *
 * Add support to connect to test database
 * Check all the cases for the routes
 */
