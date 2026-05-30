import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { createActiveSession, findActiveSession, findUserByEmail, isMysqlConfigured, recordLoginEvent, updatePasswordHash } from "@/lib/db";
import { verifyPassword, hashPassword } from "@/lib/password";
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
      {
        error: `You are already logged in as ${active.role} (${active.email}). Please logout first before signing into another account.`,
        code: "ACTIVE_SESSION_EXISTS",
        action: "CLEAR_PREVIOUS_SESSIONS_AND_RELOGIN"
      },
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

  const { valid, needsRehash } = await verifyPassword(payload.data.password, user.passwordHash);

  if (!valid) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const existingSession = await findActiveSession(user.id);
  if (existingSession) {
    return NextResponse.json(
      {
        error: `This ${user.role} account is already active on another device. Clear previous sessions, refresh, and login again.`,
        code: "ACTIVE_SESSION_EXISTS",
        action: "CLEAR_PREVIOUS_SESSIONS_AND_RELOGIN"
      },
      { status: 409 }
    );
  }

  // Transparently upgrade bcrypt hash to Argon2id
  if (needsRehash) {
    const newHash = await hashPassword(payload.data.password);
    await updatePasswordHash("users", user.email, newHash);
  }

  const sid = randomBytes(32).toString("hex");
  const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name, sid });

  await createActiveSession({
    userId: user.id,
    sid,
    email: user.email,
    role: user.role,
    ttlSeconds: 15 * 60
  });

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
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 15 * 60
  });
  return response;
}
