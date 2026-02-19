import cron from "node-cron";
import prisma from "../prismaClient.js";
import { releaseStock } from "../services/productClient.js";

cron.schedule("*/1 * * * *", async () => {

  const expiredOrders = await prisma.order.findMany({
    where: {
      status: "PENDING",
      reservationExpiresAt: {
        lt: new Date(),
      },
    },
    include: { items: true },
  });

  for (const order of expiredOrders) {

    for (const item of order.items) {
      await releaseStock(item.productId, item.quantity);
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { status: "CANCELLED" },
    });
  }

});
