import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const generateOrderCode = () =>
  `PO-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

export const createOrder = async (userId, items) => {
  const totalAmount = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  return prisma.order.create({
    data: {
      userId,
      orderCode: generateOrderCode(),
      totalAmount,

      items: {
        create: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      },

      timeline: {
        create: {
          status: "PENDING",
          message: "Order submitted",
        },
      },
    },
    include: {
      items: true,
      timeline: true,
    },
  });
};
