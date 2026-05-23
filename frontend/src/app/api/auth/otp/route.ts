import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mail";
import { id, store } from "@/lib/store";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email || !String(email).includes("@")) {
    return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  store.otps.push({ id: id("otp"), email, code, expiresAt: Date.now() + 10 * 60 * 1000 });

  await sendEmail({
    to: email,
    subject: "Your ADYAPAN OTP",
    html: `<p>Your verification code is <strong>${code}</strong>. It expires in 10 minutes.</p>`
  });

  return NextResponse.json({ ok: true, devOtp: process.env.NODE_ENV === "production" ? undefined : code });
}


