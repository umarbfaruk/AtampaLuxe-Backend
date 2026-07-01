import axios from "axios";

export const httpClient = axios.create({
  timeout: 5000,
});

/* simple retry wrapper */
export const requestWithRetry = async (fn, retries = 3) => {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;

    console.log(`🔁 Retry request... remaining: ${retries}`);
    await new Promise((r) => setTimeout(r, 500));

    return requestWithRetry(fn, retries - 1);
  }
};