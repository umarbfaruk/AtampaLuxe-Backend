import express from "express";
import { reserveStock } from "../controllers/reserve.controller.js";
import { confirmStock } from "../controllers/internal.controller.js";
import { releaseStock } from "../controllers/release.controller.js";

const router = express.Router();

router.post("/reserve-stock", reserveStock);
router.post("/confirm-stock", confirmStock);
router.post("/release-stock", releaseStock);

export default router;
