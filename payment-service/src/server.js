import "dotenv/config";
import app from "./app.js";
import prisma from "./prisma.js";

const PORT = process.env.PORT || 3005;

async function startServer() {
  try {
    // Test DB connection before starting
    await prisma.$connect();
    console.log("✅ Database connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Payment Service running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start Payment Service:", error);
    process.exit(1);
  }
}

startServer();