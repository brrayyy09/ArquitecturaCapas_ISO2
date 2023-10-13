import { Schema, model } from 'mongoose'; // Schema: El objeto Schema se utiliza para definir la estructura
// de los documentos en una colección MongoDB.
// eslint-disable-next-line
//Los modelos representan una colección en la base de datos y proporcionan métodos para interactuar con ella.

import { TYPE_OF_FILTERS } from '../commons/constans.mjs';

const filterSchema = new Schema(
  {
    name: String,
    status: String,
    imageUrl: String,
    message: String, // Opcional, por si existe mensaje error
  },
);

const imageSchema = new Schema(
  {
    imageUrl: String,
    filters: [filterSchema],
  },
);

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
    images: [imageSchema],
  },
  { timestamps: true },
);

ProcessSchema.statics.findById = function (id) {
  return this.findOne({ _id: id });
};

const ProcessModel = model('process', ProcessSchema);

export default ProcessModel;
