import request from 'supertest';
import express from 'express';
import HttpStatusCodes from 'http-status-codes';

import {
  describe,
  expect, beforeEach, it, jest,
} from '@jest/globals';
import getFiltersHandler from '../handlers/filters/getFiltersHandler.mjs';
import container from '../container/buildContainer.mjs'; // Asumiendo que tienes un contenedor para la inyección de dependencias

// Mock del servicio que será inyectado en el contenedor
const mockProcessService = {
  getProcessById: jest.fn(),
};

// Reemplazar el servicio real con el mock en el contenedor
container.processService = mockProcessService;

const app = express();
app.get('/filters/:id', getFiltersHandler);

describe('Integration tests for getFiltersHandler', () => {
  beforeEach(() => {
    // Restablece los mocks antes de cada prueba
    mockProcessService.getProcessById.mockReset();
  });

  it('should return 200 and the process when found', async () => {
    const processId = '123';
    const expectedProcess = { id: processId, name: 'Test Process' };

    // Configura el mock para resolver con el proceso esperado
    mockProcessService.getProcessById.mockResolvedValue(expectedProcess);

    await request(app)
      .get(`/filters/${processId}`)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toEqual(expectedProcess);
      });
  });

  it('should return 500 when there is an internal server error', async () => {
    const processId = '123';
    mockProcessService.getProcessById.mockRejectedValue(new Error('Internal error'));

    await request(app)
      .get(`/filters/${processId}`)
      .expect(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  });

  it('should return 404 when the process is not found', async () => {
    const processId = 'not-found';
    mockProcessService.getProcessById.mockRejectedValue( null);

    await request(app)
      .get(`/filters/${processId}`)
      .expect(HttpStatusCodes.NOT_FOUND);
  });

});
