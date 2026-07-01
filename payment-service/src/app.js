import express from "express";
import dotenv from "dotenv";
import paymentRoutes from "./routes/payment.js";
import { startPaymentExpirationJob } from "./jobs/paymentExpirationJob.js";
import prisma from "./prisma.js";

dotenv.config();

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());

/* =========================
   HEALTH CHECK (ROOT LEVEL)
========================= */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "Payment service running",
    mode: process.env.OPAY_SANDBOX === "true" ? "SANDBOX" : "LIVE",
  });
});

/* =========================
   ROOT
========================= */
app.get("/", (req, res) => {
  res.json({
    message: "Payment Service reached successfully",
    user: {
      id: req.headers["x-user-id"] || "unknown",
      email: req.headers["x-user-email"] || "unknown",
    },
  });
});

/* =========================
   PAYMENT ROUTES
   IMPORTANT:
   Gateway already prefixes /api/payment
   so service MUST expose:
   /create /verify /webhook
========================= */
app.use("/", paymentRoutes);

/* =========================
   START BACKGROUND JOBS
========================= */
startPaymentExpirationJob();

/* =========================
   GRACEFUL SHUTDOWN
========================= */
const shutdown = async () => {
  try {
    console.log("🛑 Shutting down payment service...");
    await prisma.$disconnect();
    console.log("✅ Prisma disconnected");
    process.exit(0);
  } catch (error) {
    console.error("Shutdown error:", error);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export default app;