import { Router } from "express";

const router = Router();

import applyFiltersHandler from "./applyFiltersHandler.mjs";
import getFiltersHandler from "./getFiltersHandler.mjs";

router.get("/:id", getFiltersHandler);

router.post("/", applyFiltersHandler);


export default router;