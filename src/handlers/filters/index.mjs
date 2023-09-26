import { Router } from 'express';
import multer from 'multer';

import applyFiltersHandler from './applyFiltersHandler.mjs';
import getFiltersHandler from './getFiltersHandler.mjs';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 50 },
}); // limite de 50mb

const router = Router();

router.get('/:id', getFiltersHandler);

router.post('/', upload.array('files[]'), applyFiltersHandler);

export default router;
