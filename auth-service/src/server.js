import "dotenv/config";
import app from "./app.js";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PORT =
  process.env.PORT ||
  process.env.AUTH_PORT ||
  3002;

/* =========================
   SAFE SUPERADMIN SEED
========================= */

async function seedSuperAdmin() {
  try {
    const {
      SUPERADMIN_USERNAME,
      SUPERADMIN_EMAIL,
      SUPERADMIN_PASSWORD,
    } = process.env;

    if (!SUPERADMIN_EMAIL || !SUPERADMIN_PASSWORD) {
      console.log("⚠️ Missing superadmin credentials");
      return;
    }

    // ✅ SAFE CHECK (email OR username)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: SUPERADMIN_EMAIL },
          { username: SUPERADMIN_USERNAME || "admin" },
        ],
      },
    });

    if (existingUser) {
      console.log("ℹ️ Superadmin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      SUPERADMIN_PASSWORD,
      10
    );

    await prisma.user.create({
      data: {
        username: SUPERADMIN_USERNAME || "admin",
        email: SUPERADMIN_EMAIL,
        password: hashedPassword,
        role: "SUPERADMIN",
        phone: null,
      },
    });

    console.log("✅ Superadmin created successfully");
  } catch (error) {
    console.error("❌ Error seeding superadmin:", error);
  }
}

/* =========================
   START SERVER
========================= */

async function startServer() {
  try {
    await prisma.$connect();

    console.log("✅ Connected to PostgreSQL");

    await seedSuperAdmin();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Auth Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();