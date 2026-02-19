import express from "express";
import { updateOrderStatus, getOrders } from "../../controllers/admin/order.admin.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminOnly } from "../../middlewares/admin.middleware.js";

const router = express.Router();

// GET /admin/orders — list all orders
router.get("/orders", authMiddleware, adminOnly, getOrders);

// PATCH /admin/orders/:id/status — update order status
router.patch("/orders/:id/status", authMiddleware, adminOnly, updateOrderStatus);

export default router;
