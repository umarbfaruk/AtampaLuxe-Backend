import express from "express";
import { createOrder, getOrders, payOrder } from "../controllers/order.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create a new order
router.post("/", authMiddleware, createOrder);

// Pay for an order by ID
router.post("/:id/pay", authMiddleware, payOrder);

// Get all orders
router.get("/", authMiddleware, getOrders);

export default router;
