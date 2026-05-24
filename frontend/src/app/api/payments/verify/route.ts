import { NextResponse } from "next/server";
import { isMysqlConfigured, markPaymentPaid } from "@/lib/db";
import { sendEmail } from "@/lib/mail";
import { verifyRazorpaySignature } from "@/lib/payments";
import { store } from "@/lib/store";
import { paymentVerifySchema } from "@/lib/validators";

export async function POST(request: Request) {
  const payload = paymentVerifySchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Payment verification details are incomplete." }, { status: 400 });
  }

  const verified = verifyRazorpaySignature(payload.data);

  if (!verified) {
    return NextResponse.json({ error: "Payment signature verification failed." }, { status: 400 });
  }

  const receiptUrl = `/payment/success?plan=${encodeURIComponent(payload.data.plan)}&payment=${encodeURIComponent(payload.data.paymentId)}`;

  if (isMysqlConfigured()) {
    await markPaymentPaid({ ...payload.data, receiptUrl });
  } else {
    const payment = store.payments.find((item) => item.razorpayOrderId === payload.data.orderId);
    if (payment) {
      payment.status = "paid";
      payment.razorpayPaymentId = payload.data.paymentId;
      payment.receiptUrl = receiptUrl;
    }
    const user = store.users.find((item) => item.email === payload.data.userEmail);
    if (user) {
      const courses = Array.isArray(user.unlockedCourses) ? user.unlockedCourses : [];
      user.unlockedCourses = [...new Set([...courses, payload.data.plan])];
    }
  }

  await sendEmail({
    to: payload.data.userEmail,
    subject: "ADYAPAN payment confirmed",
    html: `<p>Your ${payload.data.plan} enrollment is active. Receipt: ${receiptUrl}</p>`
  });

  return NextResponse.json({ ok: true, receiptUrl });
}
