import {
  describe, test, expect, jest,
} from '@jest/globals';
import MinioService from '../MinioService.mjs';

describe('MinioService test', () => {
  const minioService = new MinioService();

  test('Test saveImage function with valid image', async () => {
    const image = {
      originalname: 'image.png',
      buffer: Buffer.from('fake-image-data'),
    };

    // Mock the S3Client and PutObjectCommand to avoid actual API calls
    minioService.conn.send = jest.fn().mockResolvedValue();

    // Ensure that the minioService.saveImage method is called
    await minioService.saveImage(image);

    // Verify that S3Client's send method was called with the expected arguments
    expect(minioService.conn.send).toHaveBeenCalledWith({
      Bucket: 'images',
      Key: expect.stringMatching(/[a-f0-9-]+\.png/), // Verifica el formato del nombre del archivo
      Body: expect.any(Buffer),
    });
  });

  test('Test saveImage function with missing image properties', async () => {
    const invalidImage = {}; // Missing properties

    // Expecting the function to throw a Boom error
    await expect(minioService.saveImage(invalidImage)).rejects.toThrow();
  });

  // Add more test cases as needed to cover other error scenarios
});
