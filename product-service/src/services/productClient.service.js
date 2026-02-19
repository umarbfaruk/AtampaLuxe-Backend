import axios from "axios";

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || "http://product-service:3002";

export const reserveProductStock = async (productId, quantity) => {
  const response = await axios.post(
    `${PRODUCT_SERVICE_URL}/internal/reserve-stock`,
    {
      productId,
      quantity,
    }
  );

  return response.data;
};
