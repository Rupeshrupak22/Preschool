import { NextResponse } from "next/server";
import { createOtp, isMysqlConfigured } from "@/lib/db";
import { sendEmail } from "@/lib/mail";
import { id, store } from "@/lib/store";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email || !String(email).includes("@")) {
    return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  if (isMysqlConfigured()) {
    await createOtp({ email, code, expiresAt });
  } else {
    store.otps.push({ id: id("otp"), email, code, expiresAt: expiresAt.getTime() });
  }

  await sendEmail({
    to: email,
    subject: "Your ADYAPAN OTP",
    html: `<p>Your verification code is <strong>${code}</strong>. It expires in 10 minutes.</p>`
  });

  return NextResponse.json({ ok: true, devOtp: process.env.NODE_ENV === "production" ? undefined : code });
}
