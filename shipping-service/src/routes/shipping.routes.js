import express from "express";
import {
  createShipment,
  updateShipment,
} from "../controllers/shipping.controller.js";

const router = express.Router();

router.post("/shipments", createShipment);
router.put("/shipments/:id", updateShipment);

export default router;