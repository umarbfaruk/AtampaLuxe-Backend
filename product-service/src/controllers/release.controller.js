import prisma from "../prismaClient.js";

export const releaseStock = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    await prisma.product.update({
      where: { id: productId },
      data: {
        reservedStock: {
          decrement: quantity,
        },
      },
    });

    res.json({ message: "Stock released" });

  } catch (error) {
    console.error("RELEASE STOCK ERROR:", error);
    res.status(500).json({ error: "Failed to release stock" });
  }
};
