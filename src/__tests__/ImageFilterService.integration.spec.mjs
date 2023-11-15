import {
  jest, describe, it, expect,
} from '@jest/globals';
import ImageFilterService from '../services/ImageFilterService.mjs';

import { BLUR_FILTER } from '../commons/constans.mjs';

describe('ImageFilterService', () => {
  it('should apply blur filter', async () => {
    // Mock the applyFilters() method.
    jest.mock('../services/ImageFilterService.mjs', () => ({
      applyFilters: jest.fn(),
    }));

    // Set up the expectations for the mock.
    jest.mock('../services/ImageFilterService.mjs').mockReturnValue({
      toBuffer: jest.fn().mockReturnValue(Buffer.from('mocked buffer')),
    });

    // Call the applyFilters() method.
    const filteredImageBuffer = await ImageFilterService.applyFilters(Buffer.from('image data'), [BLUR_FILTER]);

    // Assert that the mock was called as expected.
    expect(jest.mock('../services/ImageFilterService.mjs').applyFilters).toBeCalledWith(Buffer.from('image data'), [BLUR_FILTER]);

    // Assert that the return value of the mock is correct.
    expect(filteredImageBuffer).toEqual(Buffer.from('mocked buffer'));
  });
});
