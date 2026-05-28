import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { findUserByEmail, isMysqlConfigured, recordLoginEvent } from "@/lib/db";
import { activeCookieSessions, clearAuthCookies, signToken } from "@/lib/security";
import { publicUser } from "@/lib/store";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const payload = loginSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Enter a valid email, password, and CAPTCHA." }, { status: 400 });
  }

  // Enforce single-session: block login if another role is already active
  const sessions = await activeCookieSessions();
  if (sessions.length > 0) {
    const active = sessions[0].session;
    return NextResponse.json(
      { error: `You are already logged in as ${active.role} (${active.email}). Please logout first before signing into another account.` },
      { status: 409 }
    );
  }

  // Only users registered in the database can login — no self-registration
  if (!isMysqlConfigured()) {
    return NextResponse.json({ error: "Database is not configured. Contact admin." }, { status: 503 });
  }

  const user = await findUserByEmail(payload.data.email);

  if (!user) {
    return NextResponse.json({ error: "This email is not registered. Only verified accounts can login." }, { status: 401 });
  }

  const valid = await bcrypt.compare(payload.data.password, user.passwordHash);

  if (!valid) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });

  await recordLoginEvent({
    user,
    ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip"),
    userAgent: request.headers.get("user-agent"),
    source: payload.data.source
  });

  const response = NextResponse.json({ user: publicUser(user), token, mode: "mysql" });
  clearAuthCookies(response, "adyapan_token");
  response.cookies.set("adyapan_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
  return response;
}
