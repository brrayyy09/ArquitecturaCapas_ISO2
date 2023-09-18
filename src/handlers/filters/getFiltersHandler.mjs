import mongoose from 'mongoose';
import Process from '../../models/Process.mjs';
import { StatusCodes } from 'http-status-codes';

const getFiltersHandler = (async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(id);
        const process = await Process.findById(id);

        if (!process || !process.files || process.files.length === 0) {
            return res.sendStatus(400).json({ message: 'Imagen no encontrada' });
        }

        const filters = process.filters; // Accede al campo filters del objeto process
        return res.send(`Imagen encontrada, Los filtros aplicados para esta imagen son: ${filters}`);

    } catch (error) {
        console.error(error);
        res.sendStatus(500).json({ message: 'Error al obtener la imagen' });
    }
    next();
});

export default getFiltersHandler;
