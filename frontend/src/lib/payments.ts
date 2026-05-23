import crypto from "crypto";
import Razorpay from "razorpay";
import { id } from "./store";

export function razorpayClient() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    return null;
  }

  return new Razorpay({ key_id, key_secret });
}

export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}) {
  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (!secret) {
    return signature === "dev_signature";
  }

  const generated = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return generated === signature;
}

export async function createPaymentOrder(amount: number, plan: string) {
  const client = razorpayClient();
  const receipt = id("receipt");

  if (!client) {
    return {
      id: id("order"),
      amount: amount * 100,
      currency: "INR",
      receipt,
      mode: "dev"
    };
  }

  return client.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt,
    notes: { plan }
  });
}
