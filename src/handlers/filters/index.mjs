import { Router } from "express";

const router = Router();

import applyFiltersHandler from "./applyFiltersHandler.mjs";
import getFiltersHandler from "./getFiltersHandler.mjs";

router.get("/:_id", getFiltersHandler);

router.post("/", applyFiltersHandler);


export default router;