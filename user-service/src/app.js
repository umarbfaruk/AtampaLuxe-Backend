import express from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Root route for testing JWT forwarding
app.get("/", (req, res) => {
  res.json({
    message: "User Service reached successfully",
    user: {
      id: req.headers["x-user-id"] || "unknown",
      email: req.headers["x-user-email"] || "unknown",
    },
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ service: "User Service", status: "ok" });
});

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
