import "dotenv/config";
import app from "../app.js";

// Ensure PORT works inside Docker + local
const PORT = process.env.PRODUCT_PORT || 3003;

// Graceful startup logging
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Product Service running on port ${PORT}`);
});

// -----------------------------
// Graceful shutdown (IMPORTANT for Docker)
// -----------------------------
process.on("SIGINT", () => {
  console.log("🛑 SIGINT received. Shutting down Product Service...");
  server.close(() => {
    console.log("✔ Product Service stopped");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received. Shutting down Product Service...");
  server.close(() => {
    console.log("✔ Product Service stopped");
    process.exit(0);
  });
});