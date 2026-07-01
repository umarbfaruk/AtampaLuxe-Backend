import express from "express";
import * as controller from "../controllers/product.controller.js";
import upload from "../middleware/upload.js";
import {
  authMiddleware,
  requireRole,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/* ============================================
   PUBLIC ROUTES
   No authentication required
============================================ */

router.get("/", controller.getProducts);

router.get("/:id", controller.getProductById);

/* ============================================
   ADMIN / VENDOR ONLY
============================================ */

router.post(
  "/",
  authMiddleware,
  requireRole("ADMIN", "VENDOR"),
  upload.single("image"),
  controller.createProduct
);

router.put(
  "/:id",
  authMiddleware,
  requireRole("ADMIN", "VENDOR"),
  controller.updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole("ADMIN", "VENDOR"),
  controller.deleteProduct
);

export default router;