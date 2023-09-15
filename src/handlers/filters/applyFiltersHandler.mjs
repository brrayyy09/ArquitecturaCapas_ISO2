import applyFilters from "../../controllers/filters/applyFilters.mjs";
import Boom from "@hapi/boom";
import HttpStatusCodes from "http-status-codes";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage:storage ,
limits: { fileSize: 1024 * 1024 * 50 }}); //limite de 50mb

const applyFiltersHandler = async (req, res, next) => {
    try {
         //upload.array para manejar los archivos subidos
        upload.array('files')(req, res, async (err) => {
            if (err){
                // Maneja el error de subida de archivos si es necesario
                return next(Boom.badRequest('Error al subir archivos ', {error: err}));
            }
            //con esto accedemos a los archivos subidos
            const archivos = req.files;
            const body = req.body;
            const response = await applyFilters(archivos, body);
            return res.status(HttpStatusCodes.OK).json(response);
        });
    } catch (error) { 
        const err = Boom.isBoom(error) ? error: Boom.internal(error);
        next(err);
    }
};
export default applyFiltersHandler;
