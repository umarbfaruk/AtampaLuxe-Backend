import axios from "axios";

export async function retryOrderUpdate(orderId, retries = 3) {
  let attempt = 0;

  while (attempt < retries) {
    try {
      await axios.post(
        `${process.env.ORDER_SERVICE_URL}/api/order/update-status`,
        {
          orderId,
          status: "PAID"
        }
      );

      console.log("✅ Order updated successfully");
      return true;

    } catch (error) {
      attempt++;
      console.log(`Retry attempt ${attempt} failed`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.error("❌ Order update permanently failed");
  return false;
}