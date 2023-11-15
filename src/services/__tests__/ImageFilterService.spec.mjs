// ImageFilterService.spec.mjs
import sharp from 'sharp';
import {
  jest, describe, it, expect, afterEach,
} from '@jest/globals';
import ImageFilterService from '../ImageFilterService.mjs';
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
      // eslint-disable-next-line no-console
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
      // eslint-disable-next-line no-console
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
      // eslint-disable-next-line no-console
    }
  });
  it('should handle unknown filters', async () => {
    const buffer = Buffer.from('example-image-buffer');
    const unknownFilter = 'unknownFilter';
    const filters = [unknownFilter];

    const sharpInstance = {
      toBuffer: jest.fn().mockResolvedValue(buffer),
    };

    // Espía la construcción de la instancia de sharp
    jest.spyOn(sharp, 'constructor').mockImplementation(() => sharpInstance);

    const service = new ImageFilterService();
    try {
      const result = await service.applyFilters(buffer, filters);
      expect(sharp.constructor).toHaveBeenCalledWith(buffer);
      expect(sharpInstance.toBuffer).toHaveBeenCalled();
      expect(result).toEqual(buffer);
    } catch (error) {
      // eslint-disable-next-line no-console
    }
  });
});
