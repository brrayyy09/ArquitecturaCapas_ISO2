import Process from "../../models/Process.mjs";//
import Joi from "joi"; //validar un esquema de tipo json
import Boom from "@hapi/boom";
import { BLUR_FILTER, GREYSCALE_FILTER, NEGATIVE_FILTER } from "../../commons/constans.mjs";

const PayloadValidation = Joi.object({
    filters: Joi.array().items(Joi.string().valid("negative", "greyscale", "blur")).min(1)
});

const applyFilters = async (files, filters, filtersBD) => {
    try {
        // 1. Validar el body de los filters que se enviaron
        await PayloadValidation.validateAsync(filters);
    } catch (error) {
        // 2. Manejar errores de validación
        throw Boom.badData(error.message, { error });
    }
    // El modelo Process tiene un campo "files" que es una matriz para almacenar los datos binarios de los archivos
    const filesData = [];

    for (const file of files) {
        // Obtener los datos binarios del archivo
        const fileData = file.buffer;

        // Almacenar los datos binarios en el campo "archivos" del documento
        filesData.push(fileData);
    }

    // 3. Crear un nuevo documento de proceso
    const newProcess = new Process;
    // Asignar las rutas al campo "archivos"
    newProcess.files = filesData;
    newProcess.filters = filtersBD;


    // 4. Guardar el nuevo proceso en la base de datos
    await newProcess.save();

    // 5. Devolver el nuevo proceso
    return newProcess;
};


export default applyFilters;
