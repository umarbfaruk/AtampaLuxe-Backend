import prisma from "../prismaClient.js";
import axios from "axios";

const PRODUCT_SERVICE_URL =
  process.env.PRODUCT_SERVICE_URL || "http://product-service:3003";

setInterval(async () => {
  const expiredOrders = await prisma.order.findMany({
    where: {
      status: "PENDING",
      createdAt: {
        lt: new Date(Date.now() - 30 * 60 * 1000),
      },
    },
    include: { items: true },
  });

  for (const order of expiredOrders) {
    for (const item of order.items) {
      await axios.post(`${PRODUCT_SERVICE_URL}/internal/release-stock`, {
        productId: item.productId,
        quantity: item.quantity,
      });
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { status: "EXPIRED" },
    });
  }

  if (expiredOrders.length > 0) {
    console.log(`Expired ${expiredOrders.length} orders`);
  }
}, 60000);
