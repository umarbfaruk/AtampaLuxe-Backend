import express from "express";
import { PrismaClient } from "@prisma/client";
import { param } from "express-validator";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

/*
====================================
AUTH MIDDLEWARE
====================================
*/

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Missing or invalid token",
    });
  }

  next();
}

/*
====================================
ROOT
====================================
*/

app.get("/", (req, res) => {
  res.json({
    service: "shipping-service",
    status: "running",
  });
});

/*
====================================
SERVICE INFO
====================================
*/

app.get("/info", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Shipping Service reached successfully",
  });
});

/*
====================================
CREATE SHIPMENT
POST /shipping/shipments
====================================
*/

app.post(
  "/shipping/shipments",
  authMiddleware,
  async (req, res) => {
    try {
      const { orderId, userId, address } = req.body;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          error: "orderId is required",
        });
      }

      const shipment = await prisma.shippingOrder.create({
        data: {
          orderId,
          customerId: userId || "UNKNOWN",
          address: address || "Pending Address",
          // status intentionally omitted.
          // Prisma will automatically use the default enum value:
          // PENDING
        },
      });

      res.status(201).json({
        success: true,
        data: shipment,
      });
    } catch (err) {
      console.error("CREATE SHIPMENT ERROR:", err);

      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
);

/*
====================================
GET ALL SHIPMENTS
====================================
*/

app.get(
  "/shipping/shipments",
  authMiddleware,
  async (req, res) => {
    try {
      const shipments = await prisma.shippingOrder.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

      res.json({
        success: true,
        data: shipments,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
);

/*
====================================
GET SHIPMENT BY ID
====================================
*/

app.get(
  "/shipping/shipments/:id",
  authMiddleware,
  param("id").isUUID(),
  async (req, res) => {
    try {
      const shipment = await prisma.shippingOrder.findUnique({
        where: {
          id: req.params.id,
        },
      });

      if (!shipment) {
        return res.status(404).json({
          success: false,
          error: "Shipment not found",
        });
      }

      res.json({
        success: true,
        data: shipment,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
);

/*
====================================
UPDATE SHIPMENT
====================================
*/

app.put(
  "/shipping/shipments/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const shipment = await prisma.shippingOrder.update({
        where: {
          id: req.params.id,
        },
        data: req.body,
      });

      res.json({
        success: true,
        data: shipment,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
);

/*
====================================
DELETE SHIPMENT
====================================
*/

app.delete(
  "/shipping/shipments/:id",
  authMiddleware,
  async (req, res) => {
    try {
      await prisma.shippingOrder.delete({
        where: {
          id: req.params.id,
        },
      });

      res.json({
        success: true,
        message: "Shipment deleted successfully",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
);

/*
====================================
404
====================================
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Shipping route not found",
    path: req.originalUrl,
  });
});

/*
====================================
ERROR HANDLER
====================================
*/

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    error: err.message,
  });
});

/*
====================================
GRACEFUL SHUTDOWN
====================================
*/

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default app;