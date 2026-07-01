import prisma from "../prismaClient.js";

/* =========================
   CREATE PRODUCT
========================= */

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      subcategory,
      brand,
      sku,
      price,
      stock,
      tags,
      weight,
      video,
    } = req.body;

    const product = await prisma.product.create({
      data: {
        vendorId: req.user.id,

        name,
        description,
        category,
        subcategory,

        brand,
        sku,

        price: Number(price),

        stock: Number(stock),

        image: req.file
          ? `/uploads/${req.file.filename}`
          : null,

        video,

        tags: tags
          ? JSON.parse(tags)
          : null,

        weight: weight
          ? Number(weight)
          : null,
      },
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(
      "CREATE PRODUCT ERROR:",
      err
    );

    res.status(500).json({
      message: "Failed to create product",
      details: err.message,
    });
  }
};

/* =========================
   GET ALL PRODUCTS
========================= */

export const getProducts = async (req, res) => {
  try {
    const products =
      await prisma.product.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    res.json(products);
  } catch (err) {
    console.error(
      "GET PRODUCTS ERROR:",
      err
    );

    res.status(500).json({
      message: "Failed to fetch products",
      details: err.message,
    });
  }
};

/* =========================
   GET PRODUCT BY ID
========================= */

export const getProductById = async (
  req,
  res
) => {
  try {
    console.log(
      "GET PRODUCT ID:",
      req.params.id
    );

    const product =
      await prisma.product.findUnique({
        where: {
          id: req.params.id,
        },
      });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (err) {
    console.error(
      "GET PRODUCT ERROR:",
      err
    );

    res.status(500).json({
      message: "Failed to fetch product",
      details: err.message,
    });
  }
};

/* =========================
   UPDATE PRODUCT
========================= */

export const updateProduct = async (
  req,
  res
) => {
  try {
    const updated =
      await prisma.product.update({
        where: {
          id: req.params.id,
        },
        data: req.body,
      });

    res.json(updated);
  } catch (err) {
    console.error(
      "UPDATE PRODUCT ERROR:",
      err
    );

    res.status(500).json({
      message: "Failed to update product",
      details: err.message,
    });
  }
};

/* =========================
   DELETE PRODUCT
========================= */

export const deleteProduct = async (
  req,
  res
) => {
  try {
    await prisma.product.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({
      message: "Product deleted",
    });
  } catch (err) {
    console.error(
      "DELETE PRODUCT ERROR:",
      err
    );

    res.status(500).json({
      message: "Failed to delete product",
      details: err.message,
    });
  }
};