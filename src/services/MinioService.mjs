import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 } from 'uuid';
import Boom from '@hapi/boom';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_HOST } from '../commons/env.mjs';
import { BUCKET_NAME } from '../commons/constans.mjs';
import eventBus from '../commons/eventBus.mjs';
import processRepository from '../repositories/ProcessRepository.mjs';

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

      // Suscribirse al evento imageProcessed
      eventBus.on('imageProcessed', async ({ processId, imageKey }) => {
        try {
          // Asumiendo que imageKey es la clave del objeto en el bucket
          const signedUrl = await this.generateSignedUrl(imageKey);

          // Actualizar la base de datos con la URL firmada
          await processRepository.updateImageUrls(processId, { [imageKey]: signedUrl });
        } catch (error) {
          console.error('Error al manejar el evento imageProcessed', error);
        }
      });
    }
  }

  async saveImage(image) {
    try {
      if (!image) {
        throw Boom.badRequest('Image is required');
      }
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
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: buffer,
      });

      await this.conn.send(command);
      // Aquí deberías emitir el evento con la información necesaria
      // Por ejemplo:
      eventBus.emit('imageProcessed', { processId: 'id_del_proceso', imageKey: fileName });

      // Si necesitas la URL firmada inmediatamente, puedes llamar a generateSignedUrl aquí
      const url = await this.generateSignedUrl(fileName);
      return url;
    } catch (error) {
      throw Boom.isBoom(error) ? error : Boom.internal('Error saving image', error);
    }
  }

  // Método para generar una URL firmada
  async generateSignedUrl(objectKey) {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
    });

    // Generar la URL firmada
    return getSignedUrl(this.conn, command, { expiresIn: 60 * 60 * 24 }); // 1 día en segundos
  }
}

export default MinioService;
