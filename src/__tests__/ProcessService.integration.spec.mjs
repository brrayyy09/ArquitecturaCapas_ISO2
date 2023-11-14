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



    it('should apply a blur filter to an image', async () => {

        const imageBuffer = Buffer.from('image data');
        const filters = [BLUR_FILTER];
    
        const imageWithFilter = await processService.imageFilterService.applyFilters(imageBuffer, filters);
    
 
        expect(imageWithFilter).not.toBe(imageBuffer);
  
      });
    
      it('should save an image to Minio', async () => {
        const imageBuffer = Buffer.from('image data');
        const fileName = 'image.png';
    
        const imageUrl = await processService.minioService.saveImage({
          buffer: imageBuffer,
          originalname: fileName,
        });
    
        expect(imageUrl).not.toBeNull();
      });
  
      it('should save a process to the database', async () => {
        const filters = [BLUR_FILTER];
        const images = [{ imageUrl: 'https://example.com/image.png', filters: [] }];
    
        const process = await processService.processRepository.save({ filters, images });
    
    
        expect(process).not.toBeNull();
      });
    
      
      it('should get a process by its ID', async () => {
        const processId = 1;
    
        const process = await processService.getProcessById(processId);
    
       
        expect(process).not.toBeNull();
      });
  
    
});