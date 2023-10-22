import Joi from 'joi';
import Boom from '@hapi/boom';
import {
  BLUR_FILTER, GREYSCALE_FILTER, NEGATIVE_FILTER, STATUS_TYPES,
} from '../commons/constans.mjs';

class ProcessService {
  processRepository = null;

  minioService = null;

  payloadValidation = Joi.object({
    filters: Joi.array().items(Joi.string().valid(
      BLUR_FILTER,
      GREYSCALE_FILTER,
      NEGATIVE_FILTER,
    )).min(1),
    files: Joi.array().required(),
  }).required();

  constructor({ processRepository, minioService }) {
    this.processRepository = processRepository;
    this.minioService = minioService;
  }

  async applyFilters(payload) {
    try {
      // 1. Validar el body de los filters que se enviaron
      await this.payloadValidation.validateAsync(payload);
    } catch (error) {
      // 2. Manejar errores de validación
      throw Boom.badData(error.message, { error });
    }

    function getRandomStatus() {
      const randomIndex = Math.floor(Math.random() * STATUS_TYPES.length);
      return STATUS_TYPES[randomIndex];
    }

    const { files, filters } = payload;

    // Procesa cada archivo y aplica los filtros
    const imagesPromises = files.map(async (file) => {
      // Lógica para guardar la imagen y aplicar filtros

      const imageUrl = await this.minioService.saveImage(file);

      return {
        imageUrl, // la URL de la imagen
        filters: filters.map((filter) => ({
          name: filter,
          status: getRandomStatus(STATUS_TYPES),
        })),
      };
    });
    const images = await Promise.all(imagesPromises);

    // Aquí, 'process' debería ser el objeto que se guarda en la base de datos
    const process = await this.processRepository.save({ filters, images });

    if (!process) throw Boom.notFound('Not Found');

    return process; // Esto devuelve el objeto 'process' con las 'images' incluidas
  }

  async getProcessById(id) {
    try {
      const process = await this.processRepository.findById(id);
      if (!process) {
        throw Boom.notFound('Not Found');
      }
      return process;
    } catch (error) {
      throw Boom.internal(error.message, { error });
    }
  }
}

export default ProcessService;
