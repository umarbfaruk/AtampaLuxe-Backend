// src/controllers/product.controller.js
const productService = require('../services/product.service');

const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await productService.getProducts();
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await productService.deleteProduct(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const reduceStock = async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await productService.reduceStock(req.params.id, quantity);
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  reduceStock,
};
