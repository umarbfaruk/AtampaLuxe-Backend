import Product from "../models/product.model.js";

export const reserveStock = async (productId, quantity, transaction) => {
  const product = await Product.findByPk(productId, {
    transaction,
    lock: transaction.LOCK.UPDATE,
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const available = product.stock - product.reservedStock;

  if (available < quantity) {
    throw new Error(`Insufficient stock for ${product.name}`);
  }

  product.reservedStock += quantity;

  await product.save({ transaction });

  return product;
};
