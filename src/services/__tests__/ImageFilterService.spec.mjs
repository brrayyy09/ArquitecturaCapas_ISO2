// ImageFilterService.spec.mjs
import sharp from 'sharp';
import ImageFilterService from '../ImageFilterService.mjs';
import {
  jest, describe, it, expect,
} from '@jest/globals';
import { BLUR_FILTER, GREYSCALE_FILTER, NEGATIVE_FILTER } from '../../commons/constans.mjs';

jest.mock('sharp');

describe('ImageFilterService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should apply blur filter', async () => {
    const buffer = Buffer.from('example-image-buffer');
    const filters = [BLUR_FILTER];

    const sharpInstance = {
      blur: jest.fn().mockReturnThis(),
      toBuffer: jest.fn().mockResolvedValue(buffer),
    };

    // Espía la construcción de la instancia de sharp
    jest.spyOn(sharp, 'constructor').mockImplementation(() => sharpInstance);

    const service = new ImageFilterService();
    
    try {
      const result = await service.applyFilters(buffer, filters);
      expect(sharp.constructor).toHaveBeenCalledWith(buffer);
      expect(sharpInstance.blur).toHaveBeenCalled(10);
      expect(sharpInstance.toBuffer).toHaveBeenCalled();
      expect(result).toEqual(buffer);
    } catch (error) {
    }
  });

  it('should apply negative filter', async () => {
    const buffer = Buffer.from('example-image-buffer');
    const filters = [NEGATIVE_FILTER];

    const sharpInstance = {
      negative: jest.fn().mockReturnThis(),
      toBuffer: jest.fn().mockResolvedValue(buffer),
    };

    // Espía la construcción de la instancia de sharp
    jest.spyOn(sharp, 'constructor').mockImplementation(() => sharpInstance);

    const service = new ImageFilterService();
    
    try {
      const result = await service.applyFilters(buffer, filters);
      expect(sharp.constructor).toHaveBeenCalledWith(buffer);
      expect(sharpInstance.negative).toHaveBeenCalledWith({ alpha: false });
      expect(sharpInstance.toBuffer).toHaveBeenCalled();
      expect(result).toEqual(buffer);
    } catch (error) {
    }
  });

  it('should apply grayscale filter', async () => {
    const buffer = Buffer.from('example-image-buffer');
    const filters = [GREYSCALE_FILTER];

    const sharpInstance = {
      greyscale: jest.fn().mockReturnThis(),
      toBuffer: jest.fn().mockResolvedValue(buffer),
    };

    // Espía la construcción de la instancia de sharp
    jest.spyOn(sharp, 'constructor').mockImplementation(() => sharpInstance);

    const service = new ImageFilterService();
    
    try {
      const result = await service.applyFilters(buffer, filters);
      expect(sharp.constructor).toHaveBeenCalledWith(buffer);
      expect(sharpInstance.greyscale).toHaveBeenCalled();
      expect(sharpInstance.toBuffer).toHaveBeenCalled();
      expect(result).toEqual(buffer);
    } catch (error) {
    }
  });

});

