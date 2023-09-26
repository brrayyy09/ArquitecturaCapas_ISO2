import Boom from '@hapi/boom';
import HttpStatusCodes from 'http-status-codes';

const applyFiltersHandler = async (req, res, next) => {
  try {
    // con esto accedemos a los archivos subidos
    const { body } = req;
    const response = await req.container.processService.applyFilters({ ...body, files: req.files });
    return res.status(HttpStatusCodes.OK).json(response);
  } catch (error) {
    const err = Boom.isBoom(error) ? error : Boom.internal(error);
    return next(err);
  }
};
export default applyFiltersHandler;
