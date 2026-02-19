import express from "express";
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Shipping Service reached successfully",
    user: {
      id: req.headers["x-user-id"] || "unknown",
      email: req.headers["x-user-email"] || "unknown"
    }
  });
});

export default app;
