import { Schema, model } from 'mongoose'; // Schema: El objeto Schema se utiliza para definir la estructura
// de los documentos en una colección MongoDB.
// eslint-disable-next-line
//Los modelos representan una colección en la base de datos y proporcionan métodos para interactuar con ella.

import { TYPE_OF_FILTERS } from '../commons/constans.mjs';

const ProcessSchema = new Schema(
  {
    filters: {
      type: [
        {
          type: String,
          enum: TYPE_OF_FILTERS,
          required: true,
        },
      ],
    },
  },
  {
    timestamps: true,
    // al configurar timestamps: true, se agregarán automáticamente campos de fecha de
    // creación (createdAt) y fecha de actualización (updatedAt) a cada documento.
  },
);

ProcessSchema.statics.findById = function (id) {
  return this.findOne({ _id: id });
};

const ProcessModel = model('process', ProcessSchema);

export default ProcessModel;
