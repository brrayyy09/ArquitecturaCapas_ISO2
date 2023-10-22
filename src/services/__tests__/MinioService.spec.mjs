import { S3Client } from '@aws-sdk/client-s3';
import Boom from '@hapi/boom';
import {
  jest, describe, test, expect,
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

  test('Test saveImage function with valid image', async () => {
    const image = {
      originalname: 'image.png',
      buffer: Buffer.from('fake-image-data'),
    };

    // Mock the S3Client and PutObjectCommand to avoid actual API calls
    minioService.conn.send = jest.fn().mockResolvedValue();
    await minioService.saveImage(image);
  });

  test('Test saveImage function with missing image properties', async () => {
    const invalidImage = {}; // Missing properties

    // Expecting the function to throw a Boom error
    await expect(minioService.saveImage(invalidImage)).rejects.toThrow();
  });

  test('Test saveImage function with invalid image name', async () => {
    const image = {
      originalname: 'invalid.image.name.png',
      buffer: Buffer.from('fake-image-data'),
    };
    await expect(minioService.saveImage(image)).rejects.toThrow(Boom.badRequest('Invalid image name'));
  });

  test('Test saveImage function with unexpected error', async () => {
    const image = {
      originalname: 'image.png',
      buffer: Buffer.from('fake-image-data'),
    };
    minioService.conn.send = jest.fn().mockRejectedValue(new Error('Unexpected error'));
    await expect(minioService.saveImage(image)).rejects.toThrow(Boom.internal('Error saving image: Unexpected error'));
  });
});
