// src/services/product.service.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createProduct = async ({ name, price, stock, sku }) => {
  return prisma.product.create({
    data: { name, price, stock, sku },
  });
};

const getProducts = async () => {
  return prisma.product.findMany();
};

const getProductById = async (id) => {
  return prisma.product.findUnique({
    where: { id: Number(id) },
  });
};

const updateProduct = async (id, data) => {
  return prisma.product.update({
    where: { id: Number(id) },
    data,
  });
};

const deleteProduct = async (id) => {
  return prisma.product.delete({
    where: { id: Number(id) },
  });
};

const reduceStock = async (id, quantity) => {
  return prisma.product.update({
    where: { id: Number(id) },
    data: {
      stock: {
        decrement: quantity,
      },
    },
  });
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  reduceStock,
};
