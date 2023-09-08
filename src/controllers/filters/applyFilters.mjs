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
        await PayloadValidation.validateAsync(payload);
    } catch (error) {
        throw Boom.badData(error.message, { error });
        next(err);
    }
    const newProcess = new Process;
    newProcess.filters = payload.filters;

    await newProcess.save();

    return newProcess;
};

export default applyFilters;
