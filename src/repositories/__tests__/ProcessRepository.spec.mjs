import {
  describe, beforeEach, afterEach, test, jest, expect,
} from '@jest/globals';

import ProcessRepository from '../ProcessRepository.mjs';
import ProcessModel from '../../models/Process.mjs';

describe('ProcessRepository', () => {
  let processRepository;

  beforeEach(() => {
    processRepository = new ProcessRepository();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('save', () => {
    test('Guardar proceso de las imagenes', async () => {
      const process = {
        filters: ['grayscale', 'blur', 'negative'],
        images: ['paisaje.jpg', 'luna.jpg', 'sol.jpg'],
      };

      const newProcess = new ProcessModel({
        id: '9876',
        filters: process.filters,
        images: process.images,
      });
      jest.spyOn(ProcessModel.prototype, 'save').mockResolvedValueOnce(newProcess);

      const result = await processRepository.save(process);

      expect(ProcessModel.prototype.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(newProcess);
    });
  });

  describe('findId', () => {
    test('Error si no se encuentra la imagen', async () => {
      const id = '98';
      jest.spyOn(ProcessModel, 'findById').mockResolvedValueOnce(null);

      const result = await processRepository.findId(id);

      expect(ProcessModel.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual({ message: 'Imagen no encontrada' });
    });

    test('Retornar los filtros si es contrada', async () => {
      const id = '50';
      const filters = ['negative', 'grayscale', 'blur'];
      const process = new ProcessModel({ filters });
      jest.spyOn(ProcessModel, 'findById').mockResolvedValueOnce(process);

      const result = await processRepository.findId(id);

      expect(ProcessModel.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual({
        message: `Imagen encontrada, Los filtros aplicados para la imagen con id ${id} son: ${filters}`,
      });
    });

    test('Error si el ID no es encontrado', async () => {
      const id = '16';
      const error = new Error('Error encontrando la imagen');
      jest.spyOn(ProcessModel, 'findById').mockRejectedValueOnce(error);

      await expect(processRepository.findId(id)).rejects.toThrowError(error);
    });
  });
});
