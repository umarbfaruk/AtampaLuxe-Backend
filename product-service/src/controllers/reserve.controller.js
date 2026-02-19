import prisma from "../prismaClient.js";

export const reserveStock = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const available = product.stock - product.reservedStock;

    if (available < quantity) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    await prisma.product.update({
      where: { id: productId },
      data: {
        reservedStock: {
          increment: quantity,
        },
      },
    });

    res.json({ message: "Stock reserved" });

  } catch (error) {
    console.error("RESERVE STOCK ERROR:", error);
    res.status(500).json({ error: "Failed to reserve stock" });
  }
};
