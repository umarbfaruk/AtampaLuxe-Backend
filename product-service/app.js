import express from "express";
import productRoutes from "./src/routes/product.routes.js";
import internalRoutes from "./src/routes/internal.routes.js";

const app = express();

/* =========================
   BODY PARSER
========================= */

app.use(express.json());

/* =========================
   REQUEST LOGGER (DEBUG)
========================= */

app.use((req, res, next) => {
  console.log("\n==========================================");
  console.log("📥 PRODUCT SERVICE REQUEST");
  console.log("Time:", new Date().toISOString());
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("Authorization:", req.headers.authorization || "NONE");
  console.log("Content-Type:", req.headers["content-type"] || "NONE");
  console.log("==========================================");

  next();
});

/* =========================
   HEALTH CHECK
========================= */

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "product-service",
  });
});

/* =========================
   PUBLIC ROOT
========================= */

app.get("/", (req, res) => {
  res.json({
    message: "Product Service is running",
  });
});

/* =========================
   PRODUCT ROUTES

   Authentication is handled
   inside product.routes.js

========================= */

app.use("/products", productRoutes);

/* =========================
   INTERNAL ROUTES
========================= */

app.use("/internal", internalRoutes);

/* =========================
   404 HANDLER
========================= */

app.use((req, res) => {
  console.log("❌ PRODUCT 404");
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);

  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

/* =========================
   ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error("❌ PRODUCT SERVICE ERROR");
  console.error(err);

  res.status(500).json({
    error: err.message,
  });
});

export default app;