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

  test('Guardar proceso de las imagenes', async () => {
    const process = {
      filters: ['grayscale', 'blur', 'negative'],
      images: ['paisaje.jpg', 'luna.jpg', 'sol.jpg'],
    };

    // Simula un objeto de proceso como si fuera devuelto por la base de datos
    const newProcess = {
      _id: 'some-mocked-id', // usa _id aquí si necesitas un campo de identificación
      filters: process.filters,
      images: process.images,
    };

    jest.spyOn(ProcessModel.prototype, 'save').mockResolvedValueOnce(newProcess);

    const result = await processRepository.save(process);

    expect(ProcessModel.prototype.save).toHaveBeenCalledTimes(1);
    expect(result).toEqual(newProcess); // ahora esto debería funcionar
  });

  describe('findById', () => {
    test('Error si no se encuentra la imagen', async () => {
      const id = '98';
      jest.spyOn(ProcessModel, 'findById').mockResolvedValueOnce(null);

      await expect(processRepository.findById(id)).rejects.toThrow('Imagen no encontrada');

      expect(ProcessModel.findById).toHaveBeenCalledWith(id);
    });

    test('Retornar el proceso si es encontrado', async () => {
      const id = '50';
      const process = new ProcessModel({ filters: ['negative', 'grayscale', 'blur'] });
      jest.spyOn(ProcessModel, 'findById').mockResolvedValueOnce(process);

      const result = await processRepository.findById(id);

      expect(ProcessModel.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(process);
    });

    test('Error si el ID no es encontrado', async () => {
      const id = '16';
      const error = new Error('Error encontrando la imagen');
      jest.spyOn(ProcessModel, 'findById').mockRejectedValueOnce(error);

      await expect(processRepository.findById(id)).rejects.toThrowError(error);
    });
  });
});
