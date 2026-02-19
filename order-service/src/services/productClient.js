export const confirmStock = async (productId, quantity) => {
  try {
    await api.post("/internal/confirm-stock", {
      productId,
      quantity,
    });
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error);
    }
    throw new Error("Product service unavailable");
  }
};
