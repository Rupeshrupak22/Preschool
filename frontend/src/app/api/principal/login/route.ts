import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import {
  createActiveSession,
  findActiveSession,
  findPrincipalByEmail,
  recordPrincipalLoginEvent,
  updatePasswordHash,
  updateAccessKeyHash
} from "@/lib/db";
import { verifyPassword, hashPassword } from "@/lib/password";
import { clearAuthCookies, signToken } from "@/lib/security";
import { principalLoginSchema } from "@/lib/validators";

function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip");
}

export async function POST(request: Request) {
  const payload = principalLoginSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Enter email, password, school key, and CAPTCHA." }, { status: 400 });
  }

  const principal = await findPrincipalByEmail(payload.data.email);
  const passwordResult = principal ? await verifyPassword(payload.data.password, principal.passwordHash) : { valid: false, needsRehash: false };
  // School key: try exact match first, then uppercase fallback for legacy records
  let keyResult = principal ? await verifyPassword(payload.data.schoolKey, principal.accessKeyHash) : { valid: false, needsRehash: false };
  if (!keyResult.valid && principal) {
    keyResult = await verifyPassword(payload.data.schoolKey.toUpperCase(), principal.accessKeyHash);
  }

  if (!principal || principal.status !== "active" || !passwordResult.valid || !keyResult.valid) {
    await recordPrincipalLoginEvent({
      principal,
      email: payload.data.email,
      ipAddress: clientIp(request),
      userAgent: request.headers.get("user-agent"),
      status: "failed"
    });
    return NextResponse.json({ error: "Invalid principal credentials or school key." }, { status: 401 });
  }

  const existingSession = await findActiveSession(principal.id);
  if (existingSession) {
    return NextResponse.json(
      {
        error: "This principal account is already active on another device. Clear previous sessions, refresh, and login again.",
        code: "ACTIVE_SESSION_EXISTS",
        action: "CLEAR_PREVIOUS_SESSIONS_AND_RELOGIN"
      },
      { status: 409 }
    );
  }

  // Transparently upgrade bcrypt hashes to Argon2id
  if (passwordResult.needsRehash) {
    const newHash = await hashPassword(payload.data.password);
    await updatePasswordHash("principals", principal.email, newHash);
  }
  if (keyResult.needsRehash) {
    // Rehash using the value that actually matched
    const matchedKey = (await verifyPassword(payload.data.schoolKey, principal.accessKeyHash)).valid
      ? payload.data.schoolKey
      : payload.data.schoolKey.toUpperCase();
    const newHash = await hashPassword(matchedKey);
    await updateAccessKeyHash("principals", principal.email, newHash);
  }

  const sid = randomBytes(32).toString("hex");
  const token = signToken({
    id: principal.id,
    email: principal.email,
    role: "principal",
    name: principal.principalName,
    schoolId: principal.schoolId,
    schoolName: principal.schoolName,
    sid
  });

  await createActiveSession({
    userId: principal.id,
    sid,
    email: principal.email,
    role: "principal",
    ttlSeconds: 15 * 60
  });

  await recordPrincipalLoginEvent({
    principal,
    email: principal.email,
    ipAddress: clientIp(request),
    userAgent: request.headers.get("user-agent"),
    status: "success"
  });

  const response = NextResponse.json({
    ok: true,
    principal: {
      id: principal.id,
      name: principal.principalName,
      email: principal.email,
      schoolId: principal.schoolId,
      schoolName: principal.schoolName
    }
  });

  clearAuthCookies(response, "adyapan_principal_token");
  response.cookies.set("adyapan_principal_token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 15 * 60
  });

  return response;
}
