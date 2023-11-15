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
    const responseBody = JSON.parse(response.text);
    expect(responseBody).toEqual({ status: 'ok', pid: expect.any(Number) });
  });

  test('POST /images should return 422 status', async () => {
    const response = await supertest(app)
      .post('/images')
      .set('Content-Type', 'multipart/form-data')
      .field('filters[]', 'grayscale');
    expect(response.status).toBe(422);
    expect(response.body.message).toBe('"filters[0]" must be one of [blur, greyscale, negative]');
  });
});
