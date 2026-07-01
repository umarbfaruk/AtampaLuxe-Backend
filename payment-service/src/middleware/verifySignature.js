import crypto from "crypto";

export function verifyWebhookSignature(secretKey) {
  return (req, res, next) => {
    if (process.env.OPAY_SANDBOX === "true") {
      console.log("⚠️ Skipping signature verification (Sandbox Mode)");
      return next();
    }

    const signature = req.headers["x-opay-signature"];
    if (!signature) {
      return res.status(401).json({ error: "Missing signature" });
    }

    const payload = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac("sha512", secretKey)
      .update(payload)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(401).json({ error: "Invalid webhook signature" });
    }

    next();
  };
}