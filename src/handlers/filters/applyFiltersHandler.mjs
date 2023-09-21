import Boom from '@hapi/boom';
import HttpStatusCodes from 'http-status-codes';
import multer from 'multer';
import applyFilters from '../../controllers/filters/applyFilters.mjs';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 50 },
}); // limite de 50mb

const applyFiltersHandler = async (req, res, next) => {
  try {
    // upload.array para manejar los archivos subidos
    upload.array('files[]')(req, res, async (err) => {
      if (err) {
        // Maneja el error de subida de archivos si es necesario
        return next(Boom.badRequest('Error al subir archivos ', { error: err }));
      }
      // con esto accedemos a los archivos subidos
      const archivos = req.files;
      const { body } = req;
      const bodyParsed = JSON.parse(`{"filters": ${body.filters}}`);
      const bodyParsed2 = JSON.parse(body.filters);
      console.log(`hola gente ${JSON.stringify(bodyParsed)}`);
      const response = await applyFilters(archivos, bodyParsed, bodyParsed2);
      return res.status(HttpStatusCodes.OK).json(response);
    });
  } catch (error) {
    const err = Boom.isBoom(error) ? error : Boom.internal(error);
    next(err);
  }
};
export default applyFiltersHandler;
