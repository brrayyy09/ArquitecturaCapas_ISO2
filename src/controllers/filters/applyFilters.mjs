import Joi from 'joi'; // validar un esquema de tipo json
import Boom from '@hapi/boom';
import Process from '../../models/Process.mjs';//

const PayloadValidation = Joi.object({
  filters: Joi.array().items(Joi.string().valid('negative', 'greyscale', 'blur')).min(1),
  files: Joi.array()
});

const applyFilters = async (files, filters) => {
  // Process tiene un campo "files", una matriz para almacenar los datos binarios de las imagenes
  const filesData = [];
  // eslint-disable-next-line
  for (const file of files) {
    // Obtener los datos binarios de la imagen
    const fileData = file.buffer;

    // Almacenar los datos binarios en el campo "files" del documento
    filesData.push(fileData);
  }

  try {
    // 1. Validar el body de los filters que se enviaron
    await PayloadValidation.validateAsync(filters, filesData);
  } catch (error) {
    // 2. Manejar errores de validación
    throw Boom.badData(error.message, { error });
  }
  // 3. Crear un nuevo documento de proceso
  const newProcess = new Process();
  // Asignar las rutas al campo "files"
  newProcess.files = filesData;
  newProcess.filters = filters.filters;

  // 4. Guardar el nuevo proceso en la base de datos
  await newProcess.save();

  // 5. Devolver el nuevo proceso
  return newProcess;
};

export default applyFilters;
