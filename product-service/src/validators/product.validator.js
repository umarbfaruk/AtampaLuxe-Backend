function validateCreateProduct(data) {
  const { name, price, stock } = data;

  if (!name || typeof name !== "string") {
    return "Product name is required";
  }

  if (price === undefined || isNaN(price) || price < 0) {
    return "Valid price is required";
  }

  if (stock === undefined || isNaN(stock) || stock < 0) {
    return "Valid stock is required";
  }

  return null;
}

module.exports = {
  validateCreateProduct,
};
