import Boom from "@hapi/boom";
import HttpStatusCodes from "http-status-codes";
import Process from "../../models/Process.mjs";

const getFiltersHandler = async (req, res, next) => {
    try {
        const {id} = req.params;
        const newProcess = Process();

        const document = await newProcess.findOne({ _id: id }).exec();
        return res.send(document);

    } catch (error) {
        const err = Boom.isBoom(error) ? error : Boom.internal(error);
        next(err);
    }
};
export default getFiltersHandler;
