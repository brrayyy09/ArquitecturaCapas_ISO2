import { Router } from 'express';

import applyFiltersHandler from './applyFiltersHandler.mjs';
import getFiltersHandler from './getFiltersHandler.mjs';

const router = Router();

router.get('/:id', getFiltersHandler);

router.post('/', applyFiltersHandler);

export default router;
