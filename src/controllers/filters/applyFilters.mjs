import Process from "../../models/Process.mjs";//
import Joi from "joi"; //validar un esquema de tipo json
import Boom from "@hapi/boom";
import { BLUR_FILTER, GREYSCALE_FILTER, NEGATIVE_FILTER } from "../../commons/constans.mjs";

const PayloadValidation = Joi.object({
    filters: Joi.array().min(1).items(Joi.string().valid(
        NEGATIVE_FILTER, GREYSCALE_FILTER, BLUR_FILTER
    ))
})
const applyFilters = async (payload) => {
    try {
        // 1. Validar el payload
        await PayloadValidation.validateAsync(payload);
    } catch (error) {
        // 2. Manejar errores de validación
        throw Boom.badData(error.message, { error });
    }
    // 3. Crear un nuevo documento de proceso
    const newProcess = new Process;
    newProcess.filters = payload.filters;/* Se asigna el valor de payload.filters al campo filters del nuevo documento newProcess. Esto indica que los datos validados se están asignando al documento que se guardará en la base de datos. */
    newProcess.guid = payload.guid;

    // 4. Guardar el nuevo proceso en la base de datos
    await newProcess.save();

    // 5. Devolver el nuevo proceso
    return newProcess;
};


export default applyFilters;
