import { S3Client } from '@aws-sdk/client-s3';

import Boom from '@hapi/boom';
import { MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_HOST } from '../commons/env.mjs';

// Función de validación de nombre de imagen
function isValidImageName(originalname) {
  // Aquí puedes implementar la lógica de validación según tus requisitos
  // Por ejemplo, verificar si el nombre de la imagen cumple con ciertos criterios
  return /^[a-zA-Z0-9._-]+\.(jpg|jpeg|png)$/i.test(originalname);
}

class MinioService {
  conn = null;

  constructor() {
    // istanbul ignore next
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

  // eslint-disable-next-line class-methods-use-this
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
      if (!isValidImageName(image.originalname)) {
        throw new Error('Invalid image name');
      }
      if (!image.buffer) {
        throw Boom.badRequest('Image buffer is required');
      }
    } catch (error) {
      // istanbul ignore next
      throw Boom.isBoom(error) ? error : Boom.internal('Error saving image', error);
    }
  }
}

export default MinioService;
