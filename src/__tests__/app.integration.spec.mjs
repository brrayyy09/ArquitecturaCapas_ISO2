import supertest from 'supertest';
import {
  describe,
  expect,
  beforeEach,
  afterEach,
  test,
} from '@jest/globals';
import app from '../app.mjs';
import { closeConnection, startConnection } from '../mongo/index.mjs';

beforeEach(async () => {
  await startConnection();
});

afterEach(async () => {
  await closeConnection();
});

describe('Test app Express server', () => {
  test('GET / should return "ok"', async () => {
    const response = await supertest(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('ok no ');
  });

  test('POST /images should return 200 status', async () => {
    const response = await supertest(app).post('/images')
      .set('Content-Type', 'multipart/form-data')
      .field('filters[]', 'grayscale')
      .field('filters[]', 'blur')
      .attach('images[]', './assets/imagen1.png');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('filters');
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
  });

  test('POST /images should return 422 status', async () => {
    const response = await supertest(app).post('/images')
      .set('Content-Type', 'multipart/form-data')
      .field('filters[]', 'grayscale');

    expect(response.status).toBe(422);
    expect(response.body.message).toBe('images is required');
  });
});
