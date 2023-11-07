// ImageFilterService.mjs
import sharp from 'sharp';
import { BLUR_FILTER, GREYSCALE_FILTER, NEGATIVE_FILTER } from '../commons/constans.mjs';

class ImageFilterService {
  // eslint-disable-next-line class-methods-use-this
  async applyFilters(buffer, filters) {
    let imageBuffer = sharp(buffer);

    filters.forEach((filter) => {
      if (filter === BLUR_FILTER) {
        imageBuffer = imageBuffer.blur(10);
      } else if (filter === GREYSCALE_FILTER) {
        imageBuffer = imageBuffer.greyscale();
      } else if (filter === NEGATIVE_FILTER) {
        imageBuffer = imageBuffer.negate({ alpha: false });
      }
    });

    return imageBuffer.toBuffer();
  }
}

export default ImageFilterService;
