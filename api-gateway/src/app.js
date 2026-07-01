import "dotenv/config";
import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

/* =========================
   GLOBAL MIDDLEWARE
========================= */
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());

/* =========================
   SERVICES
========================= */

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://auth-service:3002";
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://user-service:3001";
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || "http://product-service:3003";
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || "http://order-service:3004";
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || "http://payment-service:3005";
const SHIPPING_SERVICE_URL = process.env.SHIPPING_SERVICE_URL || "http://shipping-service:3006";

/* =========================
   HEALTH
========================= */

app.get("/", (req, res) => {
  res.json({ message: "API Gateway Running" });
});

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

/* =========================
   AUTH
========================= */

app.use(
  "/api/auth",
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    secure: false,
    pathRewrite: { "^/api/auth": "/auth" },
  })
);

/* =========================
   USERS
========================= */

app.use(
  "/api/users",
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    secure: false,
    pathRewrite: { "^/api/users": "/users" },
  })
);

/* =========================
   PRODUCTS
========================= */

app.use(
  "/api/products",
  createProxyMiddleware({
    target: PRODUCT_SERVICE_URL,
    changeOrigin: true,
    secure: false,
    pathRewrite: { "^/api/products": "/products" },
  })
);

/* =========================
   ORDERS (IMPROVED)
========================= */

app.use(
  "/api/orders",
  createProxyMiddleware({
    target: ORDER_SERVICE_URL,
    changeOrigin: true,
    secure: false,
    pathRewrite: { "^/api/orders": "/orders" },

    onProxyReq(proxyReq, req) {
      console.log("➡️ ORDER REQUEST:", req.method, req.originalUrl);

      // Forward auth header properly
      if (req.headers.authorization) {
        proxyReq.setHeader("Authorization", req.headers.authorization);
        console.log("✅ JWT FORWARDED");
      } else {
        console.log("❌ NO AUTH HEADER AT GATEWAY");
      }

      // IMPORTANT FIX: forward JSON body correctly
      if (req.body && Object.keys(req.body).length) {
        const bodyData = JSON.stringify(req.body);

        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));

        proxyReq.write(bodyData);
      }
    },

    onProxyRes(proxyRes, req) {
      console.log("⬅️ ORDER RESPONSE:", proxyRes.statusCode, req.originalUrl);
    },

    onError(err, req, res) {
      console.log("ORDER PROXY ERROR:", err.message);

      res.status(502).json({
        error: "Gateway order proxy error",
      });
    },
  })
);

/* =========================
   PAYMENT
========================= */

app.use(
  "/api/payment",
  createProxyMiddleware({
    target: PAYMENT_SERVICE_URL,
    changeOrigin: true,
    secure: false,
    pathRewrite: { "^/api/payment": "/payment" },
  })
);

/* =========================
   SHIPPING
========================= */

app.use(
  "/api/shipping",
  createProxyMiddleware({
    target: SHIPPING_SERVICE_URL,
    changeOrigin: true,
    secure: false,
    pathRewrite: { "^/api/shipping": "/shipping" },
  })
);

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log("AUTH:", AUTH_SERVICE_URL);
  console.log("ORDER:", ORDER_SERVICE_URL);
});