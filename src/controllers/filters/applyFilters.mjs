import Process from "../../models/Process.mjs";//
import Joi from "joi"; //validar un esquema de tipo json
import Boom from "@hapi/boom";
import { BLUR_FILTER, GREYSCALE_FILTER, NEGATIVE_FILTER } from "../../commons/constans.mjs";

/*const PayloadValidation = Joi.object({
    // Cambia el tipo de validación a array y utiliza items() para definir la validación de los elementos del arreglo
    filters: Joi.array().items(
        Joi.string().valid("negative", "greyscale", "blur")
    ).min(1) // Puedes establecer un mínimo de elementos en el arreglo
});*/
const applyFilters = async (archivos, body) => {
    try {
        // 1. Validar el body de los filters que se enviaron
        //await PayloadValidation.validateAsync(body.filters);
    } catch (error) {
        // 2. Manejar errores de validación
        throw Boom.badData(error.message, { error });
    }
    // El modelo Process tiene un campo "files" que es una matriz para almacenar los datos binarios de los archivos
    const filesData = [];

    for (const archivo of archivos) {
        // Obtener los datos binarios del archivo
        const fileData = archivo.buffer;

        // Almacenar los datos binarios en el campo "archivos" del documento
        filesData.push(fileData);
    }

    // 3. Crear un nuevo documento de proceso
    const newProcess = new Process;/* Se asigna el valor de payload.filters al campo filters del nuevo documento newProcess. Esto indica que los datos validados se están asignando al documento que se guardará en la base de datos. */
    // Asignar las rutas al campo "archivos"
    newProcess.files = filesData;


    // 4. Guardar el nuevo proceso en la base de datos
    await newProcess.save();

    // 5. Devolver el nuevo proceso
    return newProcess;
};


export default applyFilters;
