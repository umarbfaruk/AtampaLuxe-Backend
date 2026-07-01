import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting enterprise seed...");

  /* ================= SUPERADMIN ================= */

  const superAdminPassword = await bcrypt.hash(
    process.env.SUPERADMIN_PASSWORD || "Admin123!",
    10
  );

  await prisma.user.upsert({
    where: {
      email:
        process.env.SUPERADMIN_EMAIL ||
        "admin@atampaluxe.com",
    },
    update: {},
    create: {
      username:
        process.env.SUPERADMIN_USERNAME ||
        "superadmin",
      email:
        process.env.SUPERADMIN_EMAIL ||
        "admin@atampaluxe.com",
      password: superAdminPassword,
      role: "SUPERADMIN",
    },
  });

  console.log("✅ SUPERADMIN verified");

  /* ================= VENDORS ================= */

  const vendors = [
    {
      username: "TechVendor",
      email: "vendor1@shop.com",
      password: "vendor123",
    },
    {
      username: "FashionHub",
      email: "vendor2@shop.com",
      password: "vendor123",
    },
    {
      username: "GadgetWorld",
      email: "vendor3@shop.com",
      password: "vendor123",
    },
  ];

  for (const vendor of vendors) {
    await prisma.user.upsert({
      where: {
        email: vendor.email,
      },
      update: {},
      create: {
        username: vendor.username,
        email: vendor.email,
        password: await bcrypt.hash(
          vendor.password,
          10
        ),
        role: "VENDOR",
      },
    });

    console.log(
      `✅ Vendor verified: ${vendor.username}`
    );
  }

  /* ================= CUSTOMERS ================= */

  const customers = [
    {
      username: "John Doe",
      email: "user1@shop.com",
      password: "user123",
    },
    {
      username: "Jane Smith",
      email: "user2@shop.com",
      password: "user123",
    },
  ];

  for (const customer of customers) {
    await prisma.user.upsert({
      where: {
        email: customer.email,
      },
      update: {},
      create: {
        username: customer.username,
        email: customer.email,
        password: await bcrypt.hash(
          customer.password,
          10
        ),
        role: "CUSTOMER",
      },
    });

    console.log(
      `✅ Customer verified: ${customer.username}`
    );
  }

  console.log(
    "🚀 SEED COMPLETED SUCCESSFULLY"
  );
}

main()
  .catch((e) => {
    console.error("❌ SEED ERROR:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });   