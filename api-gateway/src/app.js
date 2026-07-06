import "dotenv/config";
import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

/* =========================
   GLOBAL MIDDLEWARE
========================= */

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

/* =========================
   SERVICES
========================= */

const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://auth-service:3002";

const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL || "http://user-service:3001";

const PRODUCT_SERVICE_URL =
  process.env.PRODUCT_SERVICE_URL || "http://product-service:3003";

const ORDER_SERVICE_URL =
  process.env.ORDER_SERVICE_URL || "http://order-service:3004";

const PAYMENT_SERVICE_URL =
  process.env.PAYMENT_SERVICE_URL || "http://payment-service:3005";

const SHIPPING_SERVICE_URL =
  process.env.SHIPPING_SERVICE_URL || "http://shipping-service:3006";

/* =========================
   HEALTH
========================= */

app.get("/", (req, res) => {
  res.json({
    message: "API Gateway Running",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
  });
});

/* ============================================================
   HELPER
============================================================ */

function writeBody(proxyReq, req) {
  if (!req.body || !Object.keys(req.body).length) return;

  const bodyData = JSON.stringify(req.body);

  proxyReq.setHeader("Content-Type", "application/json");
  proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));

  proxyReq.write(bodyData);
}

/* =========================
   AUTH
========================= */

app.use(
  "/api/auth",
  createProxyMiddleware({
    target: `${AUTH_SERVICE_URL}/auth`,
    changeOrigin: true,
    secure: false,

    pathRewrite: {
      "^/api/auth": "",
    },

    on: {
      proxyReq(proxyReq, req) {
        console.log("➡ AUTH REQUEST:", req.method, req.originalUrl);
        console.log("Forwarding to:", `${AUTH_SERVICE_URL}/auth`);

        writeBody(proxyReq, req);
      },

      proxyRes(proxyRes, req) {
        console.log(
          "⬅ AUTH RESPONSE:",
          proxyRes.statusCode,
          req.originalUrl
        );
      },

      error(err, req, res) {
        console.error("AUTH PROXY ERROR:", err);

        res.status(502).json({
          error: "Gateway auth proxy error",
        });
      },
    },
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

    pathRewrite: {
      "^/api/users": "/users",
    },

    on: {
      proxyReq(proxyReq, req) {
        writeBody(proxyReq, req);
      },
    },
  })
);

/* =========================
   PRODUCTS (FIXED - FORCE PATH)
========================= */

app.use(
  "/api/products",
  createProxyMiddleware({
    target: PRODUCT_SERVICE_URL,
    changeOrigin: true,
    secure: false,

    on: {
      proxyReq(proxyReq, req) {
        console.log("➡ PRODUCT REQUEST:", req.method, req.originalUrl);

        // 🔥 FORCE CORRECT PATH MANUALLY
        proxyReq.path = "/products";

        console.log("Forwarding to:", PRODUCT_SERVICE_URL);
        console.log("Forced Proxy Path:", proxyReq.path);

        writeBody(proxyReq, req);
      },

      proxyRes(proxyRes, req) {
        console.log(
          "⬅ PRODUCT RESPONSE:",
          proxyRes.statusCode,
          req.originalUrl
        );
      },

      error(err, req, res) {
        console.error("PRODUCT PROXY ERROR:", err);

        res.status(502).json({
          error: "Gateway product proxy error",
        });
      },
    },
  })
);
/* =========================
   ORDERS
========================= */

app.use(
  "/api/orders",
  createProxyMiddleware({
    target: ORDER_SERVICE_URL,
    changeOrigin: true,
    secure: false,

    pathRewrite: {
      "^/api/orders": "/orders",
    },

    on: {
      proxyReq(proxyReq, req) {
        console.log("➡ ORDER REQUEST:", req.method, req.originalUrl);

        if (req.headers.authorization) {
          proxyReq.setHeader(
            "Authorization",
            req.headers.authorization
          );

          console.log("✅ JWT FORWARDED");
        } else {
          console.log("❌ NO AUTH HEADER");
        }

        writeBody(proxyReq, req);
      },

      proxyRes(proxyRes, req) {
        console.log(
          "⬅ ORDER RESPONSE:",
          proxyRes.statusCode,
          req.originalUrl
        );
      },

      error(err, req, res) {
        console.error("ORDER PROXY ERROR:", err);

        res.status(502).json({
          error: "Gateway order proxy error",
        });
      },
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

    pathRewrite: {
      "^/api/payment": "/payment",
    },

    on: {
      proxyReq(proxyReq, req) {
        writeBody(proxyReq, req);
      },
    },
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

    pathRewrite: {
      "^/api/shipping": "/shipping",
    },

    on: {
      proxyReq(proxyReq, req) {
        writeBody(proxyReq, req);
      },
    },
  })
);

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log("AUTH:", AUTH_SERVICE_URL);
  console.log("USER:", USER_SERVICE_URL);
  console.log("PRODUCT:", PRODUCT_SERVICE_URL);
  console.log("ORDER:", ORDER_SERVICE_URL);
});