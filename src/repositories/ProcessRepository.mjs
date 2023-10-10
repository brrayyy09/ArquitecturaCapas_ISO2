import Boom from '@hapi/boom';
import ProcessModel from '../models/Process.mjs';

class ProcessRepository {
  // eslint-disable-next-line class-methods-use-this
  async save(process) {
    const newProcess = new ProcessModel();
    newProcess.filters = process.filters;
    await newProcess.save();
    return newProcess;
  }

  // eslint-disable-next-line class-methods-use-this
  async findId(id) {
    try {
      const process = await ProcessModel.findById(id);
      if (!process) {
        return { message: 'Imagen no encontrada' };
      }
      const { filters } = process; // Accede al campo filters del objeto process
      return { message: `Imagen encontrada, Los filtros aplicados para la imagen con id ${id} son: ${filters}` };
    } catch (error) {
      throw Boom.badData(error.message, { error });
    }
  }
}

export default ProcessRepository;
