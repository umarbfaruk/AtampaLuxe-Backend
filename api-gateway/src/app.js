import express from "express";
import httpProxy from "http-proxy";
import { authMiddleware } from "./middleware/auth.js";

const app = express();
const proxy = httpProxy.createProxyServer();

app.use(express.json());

// PROTECTED ROUTES
app.use("/orders", authMiddleware);
app.use("/payments", authMiddleware);
app.use("/shipping", authMiddleware);

// ROUTING
app.all("/orders/*", (req, res) => {
  proxy.web(req, res, { target: "http://order-service:3004" });
});

app.all("/payments/*", (req, res) => {
  proxy.web(req, res, { target: "http://payment-service:3005" });
});

app.all("/shipping/*", (req, res) => {
  proxy.web(req, res, { target: "http://shipping-service:3006" });
});

// PUBLIC
app.all("/products/*", (req, res) => {
  proxy.web(req, res, { target: "http://product-service:3003" });
});

const PORT = 80;
app.listen(PORT, () =>
  console.log(`API Gateway running on port ${PORT}`)
);
