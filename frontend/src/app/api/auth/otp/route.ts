import { NextResponse } from "next/server";
import { createOtp, isMysqlConfigured } from "@/lib/db";
import { sendEmail } from "@/lib/mail";
import { id, store } from "@/lib/store";

// ─── In-memory OTP Rate Limiter ──────────────────────────────────────
// Limits: 3 OTP requests per email per 15 minutes
//         10 OTP requests per IP per 15 minutes
const otpRateMap = new Map(); // key → { count, resetAt }

function checkRateLimit(key: string, maxAttempts: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = otpRateMap.get(key);

  if (!entry || now > entry.resetAt) {
    otpRateMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxAttempts) {
    return false;
  }

  entry.count += 1;
  return true;
}

// Cleanup stale entries every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of otpRateMap.entries()) {
    if (now > entry.resetAt) otpRateMap.delete(key);
  }
}, 15 * 60 * 1000);

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email || !String(email).includes("@")) {
    return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  }

  // Rate limit by email (3 per 15 minutes)
  if (!checkRateLimit(`email:${email.toLowerCase().trim()}`, 3, 15 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many OTP requests for this email. Try again in 15 minutes." },
      { status: 429 }
    );
  }

  // Rate limit by IP (10 per 15 minutes)
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
  if (!checkRateLimit(`ip:${ip}`, 10, 15 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many OTP requests from this device. Try again later." },
      { status: 429 }
    );
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
