import {
  describe, test, expect, jest,
} from '@jest/globals';
import ProcessRepository from '../../repositories/ProcessRepository.mjs';
import MinioService from '../MinioService.mjs';
import ProcessService from '../ProcessService.mjs';

describe('ProcessService test', () => {
  const processRepository = new ProcessRepository();
  const minioService = new MinioService();
  const processService = new ProcessService({ processRepository, minioService });

  test('Test applyFilters function with valid payload', async () => {
    const payload = {
      filters: ['negative'],
      files: [{ originalname: 'image.png', buffer: Buffer.from('') }],
    };

    const expectedProcess = {
      id: '1234',
      filters: payload.filters,
      files: payload.files,
    };

    processRepository.save = jest.fn().mockResolvedValue(expectedProcess);

    // Mock the minioService.saveImage method as well, similar to your previous test
    minioService.saveImage = jest.fn().mockResolvedValue('image1.png');

    const result = await processService.applyFilters(payload);

    // Verify that the processRepository.save and minioService.saveImage
    // methods were called as expected
    expect(processRepository.save).toHaveBeenCalledWith({ filters: payload.filters });
    expect(minioService.saveImage).toHaveBeenCalledWith(payload.files[0]);

    // Now you can assert the result as needed
    expect(result).toEqual(expectedProcess);
  });

  test('Test applyFilters function with invalid payload', async () => {
    const invalidPayload = {
      filters: ['invalid_filter'], // This is an invalid filter
      files: [], // No files provided, which is also invalid
    };

    // Expecting the validation to throw an error
    await expect(processService.applyFilters(invalidPayload)).rejects.toThrow();
  });

  test('Test getFilters function', async () => {
    const processId = '1234';
    const expectedProcess = {
      id: processId,
      filters: ['negative'],
      files: [{ originalname: 'image.png', buffer: Buffer.from('') }],
    };

    // Mock the processRepository.findId method to return the expected process
    processRepository.findId = jest.fn().mockResolvedValue(expectedProcess);

    const result = await processService.getFilters(processId);

    // Verify that the processRepository.findId method was called with the correct argument
    expect(processRepository.findId).toHaveBeenCalledWith(processId);

    // Now you can assert the result as needed
    expect(result).toEqual(expectedProcess);
  });
});
