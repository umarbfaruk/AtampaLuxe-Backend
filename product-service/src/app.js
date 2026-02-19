import express from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3003;

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Product Service is running" });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ service: "Product Service", status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Product Service running on port ${PORT}`);
});
