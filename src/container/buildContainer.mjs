import ProcessRepository from '../repositories/ProcessRepository.mjs';
import MinioService from '../services/MinioService.mjs';
import ProcessService from '../services/ProcessService.mjs';
import ImageFilterService from '../services/ImageFilterService.mjs';

const buildContainer = (req, res, next) => {
  const container = {};

  const processRepository = new ProcessRepository();
  const minioService = new MinioService();
  const imageFilterService = new ImageFilterService();
  const processService = new ProcessService({
    processRepository,
    minioService,
    imageFilterService,
  });

  container.processService = processService;

  req.container = container;

  return next();
};

export default buildContainer;
