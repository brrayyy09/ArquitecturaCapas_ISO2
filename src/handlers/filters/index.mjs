import { Router } from "express";

const router = Router();

import applyFiltersHandler from "./applyFiltersHandler.mjs";

router.get("/", (req, res) => {
    res.send("images Get");
});

router.post("/", applyFiltersHandler);


export default router;