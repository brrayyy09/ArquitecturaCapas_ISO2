import mongoose from 'mongoose';
import Process from '../../models/Process.mjs' // Ajusta la ubicación de tu modelo
import { StatusCodes } from 'http-status-codes';

// Define una ruta para obtener una imagen por su id
const getFiltersHandler = ( async (req, res, next) => {
    try {
        const {id} = req.params;
        console.log(id);
        const process = await Process.findById(id);

        if (!process || !process.files || process.files.length === 0) {
            return res.sendStatus(400).json({ message: 'Imagen no encontrada' });
        }

        // Devuelve los datos binarios como respuesta
        res.send(`imagen encontrada`); // Supongo que solo hay una imagen en "archivos"
    } catch (error) {
        console.error(error);
        res.sendStatus(500).json({ message: 'Error al obtener la imagen' });
    }
    next();
});

export default getFiltersHandler;
