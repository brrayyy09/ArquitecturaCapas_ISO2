import { Schema, model } from "mongoose"; /*Schema: El objeto Schema se utiliza para definir la estructura de los documentos en una colección MongoDB. Define los campos, sus tipos de datos y otras opciones de validación. 

model: El objeto model se utiliza para crear modelos de datos basados en un esquema (Schema). Los modelos representan una colección en la base de datos y proporcionan métodos para interactuar con ella.*/

import { TYPE_OF_FILTERS } from "../commons/constans.mjs";

const ProcessSchema = new Schema(
    {
        files: {
            type: Buffer,
            required: true

        },
        filters: {
            type: [
                {
                    type: String,
                    enum: TYPE_OF_FILTERS,
                    required: true
                }

            ],
        },
    },
    {
        timestamps: true, /*al configurar timestamps: true, se agregarán automáticamente campos de fecha de creación (createdAt) y fecha de actualización (updatedAt) a cada documento.*/
    }
);

const ProcessModel = model("process", ProcessSchema);

export default ProcessModel;