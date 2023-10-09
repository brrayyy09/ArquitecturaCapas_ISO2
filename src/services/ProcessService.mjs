import Joi from 'joi'; // validar un esquema de tipo json
import Boom from '@hapi/boom';
import { BLUR_FILTER, GREYSCALE_FILTER, NEGATIVE_FILTER } from '../commons/constans.mjs';

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

    const { files, filters } = payload;

    const process = await this.processRepository.save({ filters });

    const imagesPromises = files.map((image) => this.minioService.saveImage(image));

    const imagesNames = await Promise.all(imagesPromises);
    console.log(imagesNames);
    return process;
  }

  // eslint-disable-next-line class-methods-use-this
  getFilters(id) {
    try {
      console.log('Estoy llegando a getFilters', id);
    } catch (error) {
      throw Boom.badData(error.message, { error });
    }
  }
}

export default ProcessService;
