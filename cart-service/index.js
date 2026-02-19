const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let cart = [];

/**
 * ADD TO CART
 */
app.post("/cart", (req, res) => {
  const product = req.body;

  if (!product || !product.id) {
    return res.status(400).json({ message: "Invalid product" });
  }

  cart.push(product);
  res.json({ message: "Added to cart", cart });
});

/**
 * GET CART
 */
app.get("/cart", (req, res) => {
  res.json(cart);
});

/**
 * CLEAR CART
 */
app.delete("/cart", (req, res) => {
  cart = [];
  res.json({ message: "Cart cleared" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🛒 Cart service running on port ${PORT}`);
});
