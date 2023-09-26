import Joi from 'joi'; // validar un esquema de tipo json
import Boom from '@hapi/boom';
import { BLUR_FILTER, GREYSCALE_FILTER, NEGATIVE_FILTER } from '../src/commons/constans.mjs';

class ProcessService {
  processRepository = null;

  payloadValidation = Joi.object({
    filters: Joi.array().items(Joi.string().valid(
      BLUR_FILTER,
      GREYSCALE_FILTER,
      NEGATIVE_FILTER,
    )).min(1),
    files: Joi.array(),
  });

  constructor({ processRepository }) {
    this.processRepository = processRepository;
  }

  async applyFilters(payload) {
    try {
      // 1. Validar el body de los filters que se enviaron
      await this.payloadValidation.validateAsync(payload);
    } catch (error) {
      // 2. Manejar errores de validación
      throw Boom.badData(error.message, { error });
    }

    const process = await this.processRepository.save(payload);
    return process;
  }
}

export default ProcessService;
