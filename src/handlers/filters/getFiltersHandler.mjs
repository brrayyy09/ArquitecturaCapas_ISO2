import Boom from "@hapi/boom";
import HttpStatusCodes from "http-status-codes";
import Process from "../../models/Process.mjs";

const getFiltersHandler = async (filter, req, res, next) => {
    try {
        const documents = await Process.find({ filters: { $in: [filter] } }).exec();
        return res.send(documents).json();

    } catch (error) {
        const err = Boom.isBoom(error) ? error : Boom.internal(error);
        return next(err);
    }
};
export default getFiltersHandler;
