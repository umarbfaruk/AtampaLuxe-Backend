import prisma from "../prismaClient.js";

export const confirmStock = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    await prisma.product.update({
      where: { id: productId },
      data: {
        stock: {
          decrement: quantity,
        },
        reservedStock: {
          decrement: quantity,
        },
      },
    });

    res.json({ message: "Stock confirmed (sale completed)" });

  } catch (error) {
    console.error("CONFIRM STOCK ERROR:", error);
    res.status(500).json({ error: "Failed to confirm stock" });
  }
};
