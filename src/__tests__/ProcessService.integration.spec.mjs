import ProcessService from '../services/ProcessService.mjs';
import{
    jest, describe, it, expect, 
} from '@jest/globals';

import { BLUR_FILTER, GREYSCALE_FILTER, NEGATIVE_FILTER } from '../commons/constans.mjs';


describe('ProcessService', () => {
    const processService = new ProcessService({
      processRepository: null,
      minioService: null,
      imageFilterService: null,
    });
  
    // Pruebas de validación de carga útil
    it('should throw an error if the payload is missing', async () => {
      await expect(processService.applyFilters({})).rejects.toThrow();
    });
  
    it('should throw an error if the payload does not contain a valid filters array', async () => {
      await expect(processService.applyFilters({ filters: ['invalid', 'filter'] })).rejects.toThrow();
    });
  
    it('should throw an error if the payload does not contain a valid files array', async () => {
      await expect(processService.applyFilters({ files: ['invalid', 'file'] })).rejects.toThrow();
    });
  
    
});