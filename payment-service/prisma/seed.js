import prisma from "../src/prisma.js";

async function main() {
  console.log("🌱 Seeding Payment Service...");

  const seedPayment = {
    orderId: "SEED_ORDER_1",
    amount: 1000,
    status: "PENDING",
    reference: "SEED_REF_1",
    expiresAt: null // optional
  };

  try {
    const existing = await prisma.payment.findUnique({
      where: { reference: seedPayment.reference }
    });

    if (!existing) {
      const payment = await prisma.payment.create({
        data: seedPayment
      });
      console.log("✅ Seeded payment:", payment);
    } else {
      console.log("⚠ Payment already exists, skipping seed.");
    }
  } catch (error) {
    console.error("Seed failed:", error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });