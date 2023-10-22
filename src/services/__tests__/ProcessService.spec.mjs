import {
  describe, test, expect, jest,
} from '@jest/globals';
import Boom from '@hapi/boom';
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
      id: '4567',
      filters: payload.filters,
      files: payload.files,
    };

    processRepository.save = jest.fn().mockResolvedValue(expectedProcess);

    minioService.saveImage = jest.fn().mockResolvedValue('image1.png');

    const result = await processService.applyFilters(payload);
    expect(processRepository.save).toHaveBeenCalledWith({
      filters: payload.filters,
      images: [
        {
          filters: payload.filters.map((filter) => ({
            name: filter,
            status: expect.any(String),
          })),
          imageUrl: 'image1.png',
        },
      ],
    });
    expect(minioService.saveImage).toHaveBeenCalledWith(payload.files[0]);
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

  test('Test applyFilters function with unexpected error when saving process', async () => {
    const payload = {
      filters: ['negative'],
      files: [{ originalname: 'image.png', buffer: Buffer.from('') }],
    };

    // Mock the processRepository.save method to throw an unexpected error
    processRepository.save = jest.fn().mockRejectedValue(new Error('Unexpected error'));

    // Expecting the function to throw an error
    await expect(processService.applyFilters(payload)).rejects.toThrow();
  });

  test('Test applyFilters function with no filters', async () => {
    const payload = {
      files: [{ originalname: 'image.png', buffer: Buffer.from('') }],
      filters: ['negative', 'blur', 'grayscale'],
    };
    const mockError = new Error('Unprocessable Entity');
    jest.spyOn(Boom, 'badData').mockReturnValue(mockError);
    await expect(processService.applyFilters(payload)).rejects.toThrow(mockError);
  });

  test('Test applyFilters function with invalid filters', async () => {
    const payload = {
      filters: ['invalid_filter'],
      files: [{ originalname: 'image.png', buffer: Buffer.from('') }],
    };
    const mockError = new Error('Unprocessable Entity');
    jest.spyOn(Boom, 'badData').mockReturnValue(mockError);
    await expect(processService.applyFilters(payload)).rejects.toThrow(mockError);
  });

  test('Test applyFilters function with no files', async () => {
    const payload = {
      filters: ['negative'],
    };

    const mockError = new Error('Not Found');
    jest.spyOn(Boom, 'badData').mockReturnValue(mockError);

    await expect(processService.applyFilters(payload)).rejects.toThrow(mockError);
  });

  test('Test applyFilters function with save process error', async () => {
    const payload = {
      filters: ['negative'],
      files: [{ originalname: 'image.png', buffer: Buffer.from('') }],
    };
    processRepository.save = jest.fn().mockResolvedValue(null);
    await expect(processService.applyFilters(payload)).rejects.toThrow(Boom.notFound());
  });

  test('Test getFilters function with process not found', async () => {
    const processId = '4567';
    processRepository.findId = jest.fn().mockResolvedValue(null);
    await expect(processService.getProcessById(processId)).rejects.toThrow(Boom.notFound());
  });

  test('Test getProcessById with valid id', async () => {
    // Mock the processRepository.findById method to return a process with the given id
    const expectedProcess = { id: '4567', name: 'Test Process' };
    processRepository.findById = jest.fn().mockResolvedValue(expectedProcess);

    // Call the getProcessById method with the id
    const result = await processService.getProcessById('4567');

    // Verify that the processRepository.findById method was called with the correct argument
    expect(processRepository.findById).toHaveBeenCalledWith('4567');

    expect(result).toEqual(expectedProcess);
  });

  test('Test getProcessById with invalid id', async () => {
    // Mock the processRepository.findById method to return null (process not found)
    processRepository.findById = jest.fn().mockResolvedValue(null);

    // Expecting the function to throw a Boom.notFound error
    await expect(processService.getProcessById('invalid_id')).rejects.toThrow(Boom.notFound());
  });

  test('Test getProcessById with unexpected error', async () => {
    // Mock the processRepository.findById method to throw an unexpected error
    processRepository.findById = jest.fn().mockRejectedValue(new Error('Internal Server Error'));

    // Expecting the function to throw an internal server error
    await expect(processService.getProcessById('4567')).rejects.toThrow(Boom.internal());
  });
});
