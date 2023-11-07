import Boom from '@hapi/boom';
import ProcessModel from '../models/Process.mjs';

class ProcessRepository {
  // eslint-disable-next-line class-methods-use-this
  async save(process) {
    const newProcess = new ProcessModel({
      filters: process.filters,
      images: process.images,
    });

    await newProcess.save();
    return newProcess;
  }

  // eslint-disable-next-line class-methods-use-this
  async findById(id) {
    try {
      const process = await ProcessModel.findById(id);
      if (!process) {
        throw Boom.notFound('Imagen no encontrada'); // Lanza un error si no se encuentra
      }
      return process; // Devuelve el objeto completo
    } catch (error) {
      throw Boom.badData(error.message, { error });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async updateImageUrls(processId, imageUrls) {
    try {
      // Encuentra el proceso por ID y actualiza las URLs de las imágenes
      const process = await ProcessModel.findById(processId);
      if (!process) {
        throw Boom.notFound('Proceso no encontrado');
      }

      // Suponiendo que `images` es un array y `imageUrls` es un mapa de { originalUrl: signedUrl }
      process.images = process.images.map((image) => {
        if (imageUrls[image.imageUrl]) {
          return {
            ...image,
            imageUrl: imageUrls[image.imageUrl], // Actualiza la URL de la imagen
          };
        }
        return image;
      });

      await process.save(); // Guarda los cambios en la base de datos
      return process; // Devuelve el proceso actualizado
    } catch (error) {
      throw Boom.badImplementation('Error al actualizar las URLs de las imágenes', { error });
    }
  }
}

export default ProcessRepository;
