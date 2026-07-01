import prisma from "../prisma.js";

export function startPaymentExpirationJob() {
  setInterval(async () => {
    try {
      const now = new Date();
      const expiredPayments = await prisma.payment.updateMany({
        where: {
          status: "PENDING",
          expiresAt: { lte: now }
        },
        data: { status: "FAILED" }
      });

      if (expiredPayments.count > 0) {
        console.log(`⚠️ Expired ${expiredPayments.count} pending payments`);
      }
    } catch (err) {
      console.error("Payment expiration job error:", err);
    }
  }, 5 * 60 * 1000); // every 5 minutes
}