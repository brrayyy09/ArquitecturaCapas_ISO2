import Boom from '@hapi/boom';
import Process from '../../models/Process.mjs';

const getFilters = async (id) => {
  try {
    const process = await Process.findById(id);

    if (!process || !process.files || process.files.length === 0) {
      return { message: 'Imagen no encontrada' };
    }
    const { filters } = process; // Accede al campo filters del objeto process
    return { message: `Imagen encontrada, Los filtros aplicados para esta imagen son: ${filters}` };
  } catch (error) {
    throw Boom.badData(error.message, { error });
  }
};

export default getFilters;
