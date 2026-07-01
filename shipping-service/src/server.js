import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 3006;

/*
====================================
HEALTH CHECK
====================================
*/

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "shipping-service",
    timestamp: new Date().toISOString(),
  });
});

/*
====================================
START SERVER
====================================
*/

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Shipping Service running on port ${PORT}`);
});