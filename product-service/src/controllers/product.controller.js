import prisma from "../prismaClient.js";

/* =========================
   CREATE PRODUCT
========================= */

export const createProduct = async (req, res) => {
  console.log("\n=================================================");
  console.log("🚀 CREATE PRODUCT CONTROLLER");
  console.log("=================================================");

  console.log("Request Body:");
  console.log(req.body);

  console.log("\nUploaded File:");
  console.log(req.file);

  console.log("\nAuthenticated User:");
  console.log(req.user);

  console.log("=================================================\n");

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
      imageUrl,
      tags,
      weight,
      video,
    } = req.body;

    /* -------------------------
       Validation
    -------------------------- */

    if (!name || !price || !stock) {
      console.log("❌ Validation failed");

      return res.status(400).json({
        message: "Name, price and stock are required.",
      });
    }

    /* -------------------------
       Determine image
    -------------------------- */

    const image = req.file
      ? `/uploads/${req.file.filename}`
      : imageUrl || null;

    console.log("Image to save:");
    console.log(image);

    /* -------------------------
       Build Prisma data
    -------------------------- */

    const productData = {
      vendorId: req.user.id,

      name,

      description: description || null,

      category: category || null,

      subcategory: subcategory || null,

      brand: brand || null,

      sku: sku || null,

      price: Number(price),

      stock: Number(stock),

      image,

      video: video || null,

      tags: tags
        ? typeof tags === "string"
          ? JSON.parse(tags)
          : tags
        : null,

      weight: weight
        ? Number(weight)
        : null,
    };

    console.log("\n====================================");
    console.log("DATA SENT TO PRISMA");
    console.log("====================================");
    console.dir(productData, { depth: null });
    console.log("====================================\n");

    /* -------------------------
       Create Product
    -------------------------- */

    const product = await prisma.product.create({
      data: productData,
    });

    console.log("\n====================================");
    console.log("✅ PRODUCT CREATED SUCCESSFULLY");
    console.log("====================================");
    console.dir(product, { depth: null });
    console.log("====================================\n");

    return res.status(201).json(product);
  } catch (err) {
    console.log("\n====================================");
    console.log("❌ CREATE PRODUCT ERROR");
    console.log("====================================");

    console.error(err);

    console.log("====================================\n");

    return res.status(500).json({
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
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(products);
  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err);

    return res.status(500).json({
      message: "Failed to fetch products",
      details: err.message,
    });
  }
};

/* =========================
   GET PRODUCT BY ID
========================= */

export const getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.json(product);
  } catch (err) {
    console.error("GET PRODUCT ERROR:", err);

    return res.status(500).json({
      message: "Failed to fetch product",
      details: err.message,
    });
  }
};

/* =========================
   UPDATE PRODUCT
========================= */

export const updateProduct = async (req, res) => {
  try {
    const updated = await prisma.product.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    return res.json(updated);
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);

    return res.status(500).json({
      message: "Failed to update product",
      details: err.message,
    });
  }
};

/* =========================
   DELETE PRODUCT
========================= */

export const deleteProduct = async (req, res) => {
  try {
    await prisma.product.delete({
      where: {
        id: req.params.id,
      },
    });

    return res.json({
      message: "Product deleted",
    });
  } catch (err) {
    console.error("DELETE PRODUCT ERROR:", err);

    return res.status(500).json({
      message: "Failed to delete product",
      details: err.message,
    });
  }
};