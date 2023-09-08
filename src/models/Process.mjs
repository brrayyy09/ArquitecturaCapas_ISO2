import { Schema, model } from "mongoose"; /*Schema: El objeto Schema se utiliza para definir la estructura de los documentos en una colección MongoDB. Define los campos, sus tipos de datos y otras opciones de validación. 

model: El objeto model se utiliza para crear modelos de datos basados en un esquema (Schema). Los modelos representan una colección en la base de datos y proporcionan métodos para interactuar con ella.*/

import { TYPE_OF_FILTERS } from "../commons/constans.mjs";

const ProcessSchema = new Schema(
    {
        filters: {
            type: [
                {
                    type: String,
                    enum: TYPE_OF_FILTERS, /* Las opciones válidas para este campo están limitadas por enum: TYPE_OF_FILTERS, lo que significa que solo se permiten valores que estén en el array TYPE_OF_FILTERS*/
                    required: true,//significa que es obligatorio
                },
            ],
        },
    },
    {
        timestamps: true, /*al configurar timestamps: true, se agregarán automáticamente campos de fecha de creación (createdAt) y fecha de actualización (updatedAt) a cada documento.*/
    }
);

const ProcessModel = model("process", ProcessSchema);

export default ProcessModel;