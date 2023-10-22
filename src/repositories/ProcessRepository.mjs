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
}

export default ProcessRepository;
