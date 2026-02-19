import prisma from "../prismaClient.js";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const PRODUCT_SERVICE_URL =
  process.env.PRODUCT_SERVICE_URL || "http://product-service:3003";

/**
 * POST /orders
 * Create order + reserve stock
 */
export const createOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "items are required" });
    }

    // Validate quantities
    for (const item of items) {
      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({ error: "Invalid quantity detected" });
      }
    }

    const productIds = items.map((i) => i.productId);

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== items.length) {
      return res.status(400).json({ error: "Invalid product detected" });
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    let totalAmount = 0;

    // 🔥 1️⃣ RESERVE STOCK FIRST
    for (const item of items) {
      await axios.post(`${PRODUCT_SERVICE_URL}/internal/reserve-stock`, {
        productId: item.productId,
        quantity: item.quantity,
      });

      const product = productMap.get(item.productId);
      totalAmount += product.price * item.quantity;
    }

    // 🧠 2️⃣ CREATE ORDER IN TRANSACTION
    const order = await prisma.$transaction(async (tx) => {
      return tx.order.create({
        data: {
          userId,
          orderCode: `ORD-${uuidv4().slice(0, 8).toUpperCase()}`,
          status: "PENDING",
          totalAmount,
          delayCredit: 0,
          items: {
            create: items.map((item) => {
              const product = productMap.get(item.productId);
              return {
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
              };
            }),
          },
          timeline: {
            create: {
              status: "PENDING",
              message: "Order created",
            },
          },
        },
        include: { items: true, timeline: true },
      });
    });

    res.status(201).json(order);

  } catch (error) {
    console.error("CREATE ORDER ERROR:", error?.response?.data || error);
    res.status(400).json({
      error: error?.response?.data?.error || "Failed to create order",
    });
  }
};

/**
 * POST /orders/:id/pay
 * Confirm stock + mark order as PAID
 */
export const payOrder = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status !== "PENDING") {
      return res.status(400).json({ error: "Order cannot be paid" });
    }

    // 🔥 Confirm stock (convert reserved → real deduction)
    for (const item of order.items) {
      await axios.post(`${PRODUCT_SERVICE_URL}/internal/confirm-stock`, {
        productId: item.productId,
        quantity: item.quantity,
      });
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "PAID" },
    });

    await prisma.orderTimeline.create({
      data: {
        orderId: orderId,
        status: "PAID",
        message: "Payment confirmed",
      },
    });

    res.json({ message: "Payment successful" });

  } catch (error) {
    console.error("PAYMENT ERROR:", error?.response?.data || error);
    res.status(400).json({
      error: error?.response?.data?.error || "Payment failed",
    });
  }
};

/**
 * GET /orders
 */
export const getOrders = async (req, res) => {
  try {
    const user = req.user;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const where = {
      ...(user.role !== "ADMIN" && { userId: user.id }),
      ...(search && {
        orderCode: { contains: search, mode: "insensitive" },
      }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { items: true, timeline: true },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      data: orders,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};
