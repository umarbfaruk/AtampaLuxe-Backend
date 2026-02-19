import prisma from '../prisma.js';

/**
 * Create a new product
 */
export const createProduct = async ({ name, price, stock }) => {
  return prisma.product.create({
    data: {
      name,
      price,
      stock,
    },
  });
};

/**
 * Get all products
 */
export const getProducts = async () => {
  return prisma.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
};

/**
 * Reduce product stock safely
 * - Prevents negative stock
 * - Uses transaction for data integrity
 */
export const reduceStock = async (id, quantity) => {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stock < quantity) {
      throw new Error('Insufficient stock');
    }

    return tx.product.update({
      where: { id },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });
  });
};
