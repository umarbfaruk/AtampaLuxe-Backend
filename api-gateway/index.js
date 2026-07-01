import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

/* =====================================
   SERVICE URLS
===================================== */

const PRODUCT_SERVICE_URL =
  process.env.PRODUCT_SERVICE_URL || "http://localhost:3003";

const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://localhost:3002";

const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL || "http://localhost:3001";

const ORDER_SERVICE_URL =
  process.env.ORDER_SERVICE_URL || "http://localhost:3004";

const PAYMENT_SERVICE_URL =
  process.env.PAYMENT_SERVICE_URL || "http://localhost:3005";

const SHIPPING_SERVICE_URL =
  process.env.SHIPPING_SERVICE_URL || "http://localhost:3006";

/* =====================================
   AXIOS
===================================== */

const api = axios.create({
  timeout: 10000,
});

/* =====================================
   ROOT
===================================== */

app.get("/", (req, res) => {
  res.json({
    message: "API Gateway Running",
  });
});

/* =====================================
   HEALTH
===================================== */

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "api-gateway",
  });
});

/* =====================================
   AUTH HEALTH
===================================== */

app.get("/api/auth/health", async (req, res) => {
  try {
    const response = await api.get(
      `${AUTH_SERVICE_URL}/health`
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "Auth health check failed:",
      error.message
    );

    res.status(500).json({
      error: "Auth service unavailable",
    });
  }
});

/* =====================================
   AUTH LOGIN
===================================== */

app.post("/api/auth/login", async (req, res) => {
  try {
    const response = await api.post(
      `${AUTH_SERVICE_URL}/auth/login`,
      req.body
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "Auth login error:",
      error.response?.data || error.message
    );

    res.status(
      error.response?.status || 500
    ).json(
      error.response?.data || {
        error: "Auth service unavailable",
      }
    );
  }
});

/* =====================================
   AUTH REGISTER
===================================== */

app.post("/api/auth/register", async (req, res) => {
  try {
    const response = await api.post(
      `${AUTH_SERVICE_URL}/auth/register`,
      req.body
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "Auth register error:",
      error.response?.data || error.message
    );

    res.status(
      error.response?.status || 500
    ).json(
      error.response?.data || {
        error: "Auth service unavailable",
      }
    );
  }
});

/* =====================================
   PRODUCTS
===================================== */

app.get("/products", async (req, res) => {
  try {
    const response = await api.get(
      `${PRODUCT_SERVICE_URL}/products`
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Product service error:",
      error.message
    );

    res.status(500).json({
      error: "Product service unavailable",
    });
  }
});

/* =====================================
   USERS
===================================== */

app.get("/users", async (req, res) => {
  try {
    const response = await api.get(
      `${USER_SERVICE_URL}/users`
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "User service error:",
      error.message
    );

    res.status(500).json({
      error: "User service unavailable",
    });
  }
});

/* =====================================
   ORDERS
===================================== */

app.get("/orders", async (req, res) => {
  try {
    const response = await api.get(
      `${ORDER_SERVICE_URL}/orders`
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Order service error:",
      error.message
    );

    res.status(500).json({
      error: "Order service unavailable",
    });
  }
});

/* =====================================
   PAYMENT HEALTH
===================================== */

app.get("/api/payment/health", async (req, res) => {
  try {
    const response = await api.get(
      `${PAYMENT_SERVICE_URL}/health`
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "Payment health error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      error: "Payment service unavailable",
    });
  }
});

/* =====================================
   CREATE PAYMENT
===================================== */

app.post("/api/payment/create", async (req, res) => {
  try {
    const response = await api.post(
      `${PAYMENT_SERVICE_URL}/api/payment/create`,
      req.body
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "Create payment error:",
      error.response?.data || error.message
    );

    res.status(
      error.response?.status || 500
    ).json(
      error.response?.data || {
        error: "Payment service unavailable",
      }
    );
  }
});

/* =====================================
   VERIFY PAYMENT
===================================== */

app.post("/api/payment/verify", async (req, res) => {
  try {
    const response = await api.post(
      `${PAYMENT_SERVICE_URL}/api/payment/verify`,
      req.body
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "Verify payment error:",
      error.response?.data || error.message
    );

    res.status(
      error.response?.status || 500
    ).json(
      error.response?.data || {
        error: "Payment service unavailable",
      }
    );
  }
});

/* =====================================
   PAYMENT WEBHOOK
===================================== */

app.post("/api/payment/webhook", async (req, res) => {
  try {
    const response = await api.post(
      `${PAYMENT_SERVICE_URL}/api/payment/webhook`,
      req.body
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "Payment webhook error:",
      error.response?.data || error.message
    );

    res.status(
      error.response?.status || 500
    ).json(
      error.response?.data || {
        error: "Payment service unavailable",
      }
    );
  }
});

/* =====================================
   SHIPPING
===================================== */

app.get("/shipping", async (req, res) => {
  try {
    const response = await api.get(
      `${SHIPPING_SERVICE_URL}/shipping`
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Shipping service error:",
      error.message
    );

    res.status(500).json({
      error: "Shipping service unavailable",
    });
  }
});

/* =====================================
   START SERVER
===================================== */

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `🚀 API Gateway running on port ${PORT}`
  );
});