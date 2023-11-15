import { S3Client } from '@aws-sdk/client-s3';
import Boom from '@hapi/boom';
import {
  describe, test, expect, jest,
} from '@jest/globals';
import MinioService from '../MinioService.mjs';

describe('MinioService test', () => {
  const minioService = new MinioService();

  test('Test constructor initializes S3Client correctly', () => {
    const service = new MinioService();
    expect(service.conn).toBeInstanceOf(S3Client);
  });

  test('Test saveImage function with no image provided', async () => {
    await expect(minioService.saveImage(undefined)).rejects.toThrow(Boom.badRequest('Image is required'));
  });

  test('Test saveImage function with image but no buffer', async () => {
    const imageWithoutBuffer = {
      originalname: 'image.png',
    };
    await expect(minioService.saveImage(imageWithoutBuffer)).rejects.toThrow(Boom.badRequest('Image buffer is required'));
  });

  test('Test saveImage function with missing image properties', async () => {
    const invalidImage = {}; // Missing properties

    // Expecting the function to throw a Boom error
    await expect(minioService.saveImage(invalidImage)).rejects.toThrow();
  });

  test('Test saveImage function with invalid image name', async () => {
    const invalidImage = {
      originalname: 'invalid.image.name.txt',
      buffer: Buffer.from('fake-image-data'),
    };
    const resultPromise = minioService.saveImage(invalidImage);
    await expect(resultPromise).rejects.toThrow('Invalid image name');
  });

  test('Test saveImage function with unexpected error', async () => {
    const image = {
      originalname: 'image.png',
      buffer: Buffer.from('fake-image-data'),
    };

    // Simular un error que no es un Boom error
    const nonBoomError = new Error('Unexpected error');

    jest.spyOn(minioService, 'saveImage').mockRejectedValueOnce(nonBoomError);

    try {
      await minioService.saveImage(image);
    } catch (error) {
      console.log('Caught error:', error); // Agrega este log para verificar el error capturado
      expect(Boom.isBoom(error)).toBe(false);
      expect(error).toEqual(Boom.internal('Error saving image', nonBoomError));
    }
  });
});
