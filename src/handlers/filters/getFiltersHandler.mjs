import Boom from '@hapi/boom';
import HttpStatusCodes from 'http-status-codes';
import getFilters from '../../controllers/filters/getFIlters.mjs';

const getFiltersHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    // eslint-disable-next-line
    console.log(id);
    const response = await getFilters(id);
    return res.status(HttpStatusCodes.OK).json(response);
  } catch (error) {
    const err = Boom.isBoom(error) ? error : Boom.internal(error);
    next(err);
  }
  return next();
};

export default getFiltersHandler;
