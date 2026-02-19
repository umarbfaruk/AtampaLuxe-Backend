import prisma from "../../prismaClient.js";

const VALID_TRANSITIONS = {
  PENDING: ["PAID", "CANCELLED"],
  PAID: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
};

/**
 * GET /admin/orders
 */
export const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true, timeline: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

/**
 * PATCH /admin/orders/:id/status
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { timeline: true },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const allowedNext = VALID_TRANSITIONS[order.status] || [];
    if (!allowedNext.includes(status)) {
      return res.status(400).json({
        error: `Cannot change status from ${order.status} to ${status}`,
      });
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        timeline: {
          create: {
            status,
            message: `Order marked as ${status}`,
          },
        },
      },
      include: { items: true, timeline: true },
    });

    res.json(updated);
  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
};
