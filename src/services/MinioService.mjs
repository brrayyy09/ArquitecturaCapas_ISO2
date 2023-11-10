import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { v4 } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import Boom from '@hapi/boom';
import { MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_HOST } from '../commons/env.mjs';
import { BUCKET_NAME } from '../commons/constans.mjs';

class MinioService {
  conn = null;

  constructor() {
    if (!this.conn) {
      this.conn = new S3Client({
        region: 'us-east-1',
        credentials: {
          accessKeyId: MINIO_ACCESS_KEY,
          secretAccessKey: MINIO_SECRET_KEY,
        },
        endpoint: MINIO_HOST,
        forcePathStyle: true,
      });
    }
  }

  async saveImage(image) {
    try {
      if (!image) {
        throw Boom.badRequest('Image is required');
      }
      // eslint-disable-next-line no-console
      console.log(image);
      if (!image.originalname) {
        throw Boom.badRequest('Image originalname is required');
      }
      if (!image.buffer) {
        throw Boom.badRequest('Image buffer is required');
      }

      const { originalname, buffer } = image;

      const originalNameParts = originalname.split('.');

      if (originalNameParts.length !== 2) {
        throw Boom.badRequest('Invalid image name');
      }

      const extension = originalNameParts[1];

      const fileName = `${v4()}.${extension}`;

      await this.conn.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: buffer,
      }));

      const getCommand = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
      });

      const url = await getSignedUrl(this.conn, getCommand, { expiresIn: 60 * 60 * 24 });

      return url;
    } catch (error) {
      throw Boom.isBoom(error) ? error : Boom.internal('Error saving image', error);
    }
  }
}

export default MinioService;
