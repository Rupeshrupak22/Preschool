import { NextResponse } from "next/server";
import { createPayment, isMysqlConfigured } from "@/lib/db";
import { createPaymentOrder } from "@/lib/payments";
import { id, store } from "@/lib/store";
import { paymentOrderSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const payload = paymentOrderSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Valid plan, amount, and email required." }, { status: 400 });
  }

  const order = await createPaymentOrder(payload.data.amount, payload.data.plan);
  const payment = {
    id: id("payment"),
    userEmail: payload.data.userEmail,
    plan: payload.data.plan,
    amount: payload.data.amount,
    razorpayOrderId: order.id,
    status: "created",
    createdAt: new Date().toISOString()
  };

  if (isMysqlConfigured()) {
    await createPayment(payment);
  } else {
    store.payments.push(payment);
  }

  return NextResponse.json({ order, payment, key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "dev_key" });
}
