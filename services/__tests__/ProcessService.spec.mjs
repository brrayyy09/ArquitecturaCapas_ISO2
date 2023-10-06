import {
  describe, test, expect, jest,
} from '@jest/globals';
import ProcessRepository from '../../src/repositories/ProcessRepository.mjs';
import MinioService from '../MinioService.mjs';
import ProcessService from '../ProcessService.mjs';

describe('ProcessService test', () => {
  const processRepository = new ProcessRepository();
  const minioService = new MinioService();
  minioService.saveImage = jest.fn()
    .mockImplementationOnce(() => Promise.resolve('image1.png'));
  const processService = new ProcessService({ processRepository, minioService });

  test('Test applyFilters function with invalid payload', () => {
    expect(processService.applyFilters()).rejects.toThrow();
    expect(processService.applyFilters({})).rejects.toThrow();
  });

  test('Test applyFilters function with valid payload', () => {
    const payload = {
      filters: ['negative'],
      files: [{ originalname: 'iamge.png', buffer: Buffer.from('') }],
    };

    const expectedProcess = {
      id: '1234', filters: payload.filters, files: payload.files,
    };

    processRepository.save = jest.fn().mockImplementationOnce(() => {
      console.log('se esta llamando esta funcion mock');
      return expectedProcess;
    });
    expect(processService.applyFilters()).rejects.toThrow();
    expect(processService.applyFilters({})).rejects.toThrow();
  });
});
