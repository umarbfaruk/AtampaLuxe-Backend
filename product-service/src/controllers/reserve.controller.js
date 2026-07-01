import prisma from "../prismaClient.js";

export const reserveStock = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: "Missing fields" });
    }

    await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      const available = product.stock - product.reservedStock;

      if (available < quantity) {
        throw new Error("Insufficient stock");
      }

      await tx.product.update({
        where: { id: productId },
        data: {
          reservedStock: {
            increment: quantity,
          },
        },
      });
    });

    res.json({ message: "Stock reserved successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};