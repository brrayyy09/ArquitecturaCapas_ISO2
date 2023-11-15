import {
  describe, it, expect,
} from '@jest/globals';
import MinioService from '../services/MinioService.mjs';

describe('MinioService', () => {
  const minioService = new MinioService();

  it('should save an image and return a signed URL', async () => {
    const image = {
      originalname: 'image.png',
      buffer: Buffer.from('image data'),
    };

    const url = await minioService.saveImage(image);

    expect(url).toMatch(/^(https?:\/\/)?[a-zA-Z0-9-]+\.[a-zA-Z]+\/[a-zA-Z0-9-]+/);
  });

  it('should throw an error if the image is not provided', async () => {
    await expect(minioService.saveImage(null)).rejects.toThrow('Image is required');
  });

  it('should throw an error if the image originalname is not provided', async () => {
    await expect(minioService.saveImage({ buffer: Buffer.from('image data') })).rejects.toThrow('Image originalname is required');
  });

  it('should throw an error if the image buffer is not provided', async () => {
    await expect(minioService.saveImage({ originalname: 'image.png' })).rejects.toThrow('Image buffer is required');
  });
});
