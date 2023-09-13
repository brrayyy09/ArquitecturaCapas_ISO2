import { Router } from "express";

const router = Router();

import applyFiltersHandler from "./applyFiltersHandler.mjs";
import getFiltersHandler from "./getFiltersHandler.mjs";

router.get("/:filter", (req, res, next) => {
    const {filter} = req.params;
    getFiltersHandler(filter,req,res,next);
});

router.post("/", applyFiltersHandler);


export default router;