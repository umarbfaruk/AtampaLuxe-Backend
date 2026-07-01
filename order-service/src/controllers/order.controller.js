import prisma from "../prismaClient.js";
import { emitOrderUpdate } from "../socket.js";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

/* =====================================================
   SERVICE URLS
===================================================== */

const PRODUCT_SERVICE_URL =
  process.env.PRODUCT_SERVICE_URL ||
  "http://product-service:3003";

const PAYMENT_SERVICE_URL =
  process.env.PAYMENT_SERVICE_URL ||
  "http://payment-service:3005";

const SHIPPING_SERVICE_URL =
  process.env.SHIPPING_SERVICE_URL ||
  "http://shipping-service:3006";

/* =====================================================
   CREATE ORDER
===================================================== */

export const createOrder = async (req, res) => {
  console.log("\n========================================");
  console.log("🚀 CREATE ORDER REQUEST STARTED");
  console.log("========================================");

  try {
    const userId = req.user.id;
    const { items, email, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Items are required",
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    /* ================================================
       PRODUCT LOOKUP
    ================================================= */

    for (const item of items) {
      try {
        console.log("--------------------------------");
        console.log("STEP 1");
        console.log("Looking up product...");

        const productUrl =
          `${PRODUCT_SERVICE_URL}/products/${item.productId}`;

        console.log("REQUEST URL:");
        console.log(productUrl);

        const response = await axios.get(productUrl, {
          headers: {
            Authorization: req.headers.authorization,
          },
          timeout: 10000,
        });

        console.log("STEP 2");
        console.log(response.data);

        const product = response.data;

        if (!product) {
          return res.status(404).json({
            success: false,
            error: "Product not found",
          });
        }

        const price =
          product.discountPrice ?? product.price;

        totalAmount +=
          Number(price) * Number(item.quantity);

        orderItems.push({
          productId: product.id,
          name: product.name,
          quantity: item.quantity,
          price,
        });

      } catch (err) {
        console.log("❌ PRODUCT LOOKUP FAILED");

        console.log("MESSAGE:");
        console.log(err.message);

        if (err.response) {
          console.log("STATUS:");
          console.log(err.response.status);

          console.log("DATA:");
          console.log(err.response.data);
        }

        return res.status(err.response?.status || 500).json({
          success: false,
          error: "Unable to retrieve product",
          details: err.response?.data || err.message,
        });
      }
    }

    /* ================================================
       CREATE ORDER
    ================================================= */

    const order = await prisma.order.create({
      data: {
        userId,

        orderCode:
          "ORD-" + uuidv4().substring(0, 8).toUpperCase(),

        totalAmount,

        items: {
          create: orderItems,
        },

        timeline: {
          create: {
            status: "PENDING",
            message: "Order created",
          },
        },
      },

      include: {
        items: true,
        timeline: true,
      },
    });

    emitOrderUpdate(order);

    /* ================================================
       PAYMENT
    ================================================= */

    try {
      await axios.post(
        `${PAYMENT_SERVICE_URL}/create`,
        {
          orderId: order.id,
          amount: totalAmount,
          email:
            email ||
            req.user.email ||
            "customer@example.com",
        },
        {
          headers: {
            Authorization: req.headers.authorization,
          },
        }
      );

      console.log("✅ Payment service completed.");

    } catch (err) {
      console.log("❌ Payment service unavailable.");
      console.log(err.message);
    }

    /* ================================================
       SHIPPING
    ================================================= */

    console.log("=================================");
    console.log("STEP 3");
    console.log("CALLING SHIPPING SERVICE...");
    console.log(
      "URL:",
      `${SHIPPING_SERVICE_URL}/shipping/shipments`
    );

    try {

      const shippingResponse = await axios.post(
        `${SHIPPING_SERVICE_URL}/shipping/shipments`,
        {
          orderId: order.id,
          userId,
          address,
        },
        {
          headers: {
            Authorization: req.headers.authorization,
          },
          timeout: 10000,
        }
      );

      console.log("STEP 4");
      console.log("Shipping response:");
      console.log(shippingResponse.data);

    } catch (err) {

      console.log("❌ SHIPPING FAILED");
      console.log("MESSAGE:", err.message);

      if (err.response) {
        console.log("STATUS:", err.response.status);
        console.log("DATA:", err.response.data);
      }

    }

    return res.status(201).json({
      success: true,
      data: order,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/* =====================================================
   GET ORDERS
===================================================== */

export const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        timeline: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/* =====================================================
   PAY ORDER
===================================================== */

export const payOrder = async (req, res) => {
  try {
    const order = await prisma.order.update({
      where: {
        id: req.params.id,
      },
      data: {
        status: "PAID",
        timeline: {
          create: {
            status: "PAID",
            message: "Payment successful",
          },
        },
      },
      include: {
        timeline: true,
      },
    });

    emitOrderUpdate(order);

    res.json({
      success: true,
      data: order,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/* =====================================================
   CANCEL ORDER
===================================================== */

export const cancelOrder = async (req, res) => {
  try {
    const order = await prisma.order.update({
      where: {
        id: req.params.id,
      },
      data: {
        status: "CANCELLED",
      },
    });

    emitOrderUpdate(order);

    res.json({
      success: true,
      data: order,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/* =====================================================
   UPDATE STATUS
===================================================== */

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await prisma.order.update({
      where: {
        id: req.params.id,
      },
      data: {
        status: req.body.status,
      },
    });

    emitOrderUpdate(order);

    res.json({
      success: true,
      data: order,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/* =====================================================
   ANALYTICS
===================================================== */

export const getVendorAnalytics = async (req, res) => {
  try {
    const totalOrders = await prisma.order.count();

    const revenue = await prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
    });

    res.json({
      success: true,
      totalOrders,
      totalRevenue: revenue._sum.totalAmount || 0,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};