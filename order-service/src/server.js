import http from "http";
import app from "./app.js";
import { PrismaClient } from "@prisma/client";
import { initSocket } from "./socket.js";

const prisma = new PrismaClient();

const PORT = process.env.ORDER_PORT || 3004;

async function waitForDatabase() {
  while (true) {
    try {
      await prisma.$connect();
      console.log("✅ Order Service: Database connected!");
      break;
    } catch (error) {
      console.error(
        "⏳ Order Service: Waiting for database...",
        error.message
      );

      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
}

async function startServer() {
  try {
    await waitForDatabase();

    const server = http.createServer(app);

    // Initialize Socket.IO
    initSocket(server);

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Order Service running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("❌ Failed to start Order Service:", error);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  console.log("🛑 Shutting down Order Service...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("🛑 Shutting down Order Service...");
  await prisma.$disconnect();
  process.exit(0);
});

startServer();