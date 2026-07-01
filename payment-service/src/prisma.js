import { PrismaClient } from "@prisma/client";

/**
 * ✅ Prevent multiple Prisma instances in dev/hot reload
 */
const globalForPrisma = globalThis;

/**
 * ✅ Create safe Prisma instance
 */
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error", "warn"], // better debugging in Docker
  });

/**
 * ✅ Save in global (prevents connection overload in dev/docker restarts)
 */
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * ✅ Safe connection wrapper (prevents silent startup crashes)
 */
export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Prisma connected successfully");
  } catch (err) {
    console.error("❌ Prisma connection failed:", err.message);
  }
};

/**
 * ✅ Safe disconnect handler (Docker cleanup)
 */
export const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log("🛑 Prisma disconnected cleanly");
  } catch (err) {
    console.error("⚠️ Prisma disconnect error:", err.message);
  }
};

export default prisma;