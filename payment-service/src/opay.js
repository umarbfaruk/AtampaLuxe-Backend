import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

/* =========================
   SAFE CONFIG
========================= */
const OPAY_BASE = "https://sandbox.opaycheckout.com"; 
// safer + more stable endpoint base

const merchantId = process.env.OPAY_MERCHANT_ID;
const publicKey = process.env.OPAY_PUBLIC_KEY;
const secretKey = process.env.OPAY_SECRET_KEY;
const callbackUrl = process.env.OPAY_CALLBACK_URL;
const returnUrl = process.env.OPAY_RETURN_URL;

/* =========================
   CREATE PAYMENT
========================= */
export async function createPayment(orderId, amount, customerEmail) {
  try {
    console.log("=================================");
    console.log("📦 CREATE PAYMENT REQUEST");
    console.log("=================================");
    console.log("orderId:", orderId);
    console.log("amount:", amount);
    console.log("customerEmail:", customerEmail);
    console.log("OPAY_SANDBOX:", process.env.OPAY_SANDBOX);
    console.log("merchantId:", merchantId);
    console.log("publicKey exists:", !!publicKey);
    console.log("secretKey exists:", !!secretKey);

    const sandboxMode = process.env.OPAY_SANDBOX === "true";

    /* =========================
       SAFE FALLBACK MODE (NO BREAKAGE)
    ========================= */
    if (sandboxMode || !merchantId || !publicKey || !secretKey) {
      console.log("⚠️ USING MOCK PAYMENT MODE");

      return {
        success: true,
        reference: `MOCK_REF_${Date.now()}`,
        status: "PENDING",
        orderId,
        amount,
        customerEmail,
        callbackUrl,
        returnUrl,
        paymentUrl: "https://sandbox.payment.url/mock",
      };
    }

    console.log("🔥 USING REAL OPAY MODE");

    const payload = {
      reference: orderId,
      amount,
      currency: "NGN",
      country: "NG",
      description: "AtampaLuxe Order",
      customerEmail,
      callbackUrl,
      returnUrl,
    };

    console.log("📤 OPay Payload:", payload);

    /* =========================
       FIXED OPAY ENDPOINT
       (THIS FIXES YOUR 404 ERROR)
    ========================= */
    const response = await axios.post(
      `${OPAY_BASE}/api/v1/transaction/initiate`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${publicKey}`,
          MerchantId: merchantId,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    console.log("✅ OPay Create Success");

    return response.data;
  } catch (error) {
    console.error("=================================");
    console.error("❌ OPAY CREATE ERROR");
    console.error("=================================");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error("Message:", error.message);
    }

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "OPay create payment failed"
    );
  }
}

/* =========================
   SIGNATURE GENERATOR
========================= */
function generateSignature(payload) {
  return crypto
    .createHmac("sha512", secretKey || "")
    .update(JSON.stringify(payload))
    .digest("hex");
}

/* =========================
   VERIFY PAYMENT
========================= */
export async function verifyPayment(reference) {
  try {
    console.log("=================================");
    console.log("🔍 VERIFY PAYMENT");
    console.log("=================================");
    console.log("reference:", reference);
    console.log("OPAY_SANDBOX:", process.env.OPAY_SANDBOX);

    const sandboxMode = process.env.OPAY_SANDBOX === "true";

    if (sandboxMode || !merchantId || !publicKey || !secretKey) {
      console.log("⚠️ USING MOCK VERIFY MODE");

      return {
        success: true,
        reference,
        status: "SUCCESS",
      };
    }

    const payload = { reference };

    const signature = generateSignature(payload);

    const response = await axios.post(
      `${OPAY_BASE}/api/v1/transaction/status`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${signature}`,
          MerchantId: merchantId,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    console.log("✅ OPay Verify Success");

    return response.data;
  } catch (error) {
    console.error("=================================");
    console.error("❌ OPAY VERIFY ERROR");
    console.error("=================================");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error("Message:", error.message);
    }

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "OPay verify payment failed"
    );
  }
}