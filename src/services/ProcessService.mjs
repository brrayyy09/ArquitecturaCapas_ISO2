import Joi from 'joi';
import Boom from '@hapi/boom';
import {
  BLUR_FILTER, GREYSCALE_FILTER, NEGATIVE_FILTER, STATUS_TYPES,
} from '../commons/constans.mjs';
import eventBus from '../commons/eventBus.mjs';

class ProcessService {
  processRepository = null;

  minioService = null;

  imageFilterService = null;

  payloadValidation = Joi.object({
    filters: Joi.array().items(Joi.string().valid(
      BLUR_FILTER,
      GREYSCALE_FILTER,
      NEGATIVE_FILTER,
    )).min(1),
    files: Joi.array().required(),
  }).required();

  constructor({ processRepository, minioService, imageFilterService }) {
    this.processRepository = processRepository;
    this.minioService = minioService;
    this.imageFilterService = imageFilterService;
  }

  async applyFilters(payload) {
    try {
      await this.payloadValidation.validateAsync(payload);
    } catch (error) {
      throw Boom.badData(error.message, { error });
    }

    function getRandomStatus() {
      const randomIndex = Math.floor(Math.random() * STATUS_TYPES.length);
      return STATUS_TYPES[randomIndex];
    }
    const { files, filters } = payload;
    const imageWithFilter = await this.imageFilterService.applyFilters(files.buffer, filters);

    const imagesPromises = files.map(async (file) => {
      const imageUrl = await this.minioService.saveImage({
        buffer:
        imageWithFilter,
        originalname: file.originalname,
      });
      eventBus.emit('imageProcessed', { imageUrl, filters });

      return {
        imageUrl,
        filters: filters.map((filter) => ({
          name: filter,
          status: getRandomStatus(STATUS_TYPES),
        })),
      };
    });

    const images = await Promise.all(imagesPromises);
    const process = await this.processRepository.save({ filters, images });

    if (!process) throw Boom.notFound('Not Found');

    return process;
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
