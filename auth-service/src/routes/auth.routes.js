import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Auth route working" });
});

// other auth routes here...

export default router;
