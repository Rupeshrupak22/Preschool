import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { findPrincipalByEmail, recordPrincipalLoginEvent } from "@/lib/db";
import { activeCookieSessions, clearAuthCookies, signToken } from "@/lib/security";
import { principalLoginSchema } from "@/lib/validators";

function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip");
}

export async function POST(request: Request) {
  const payload = principalLoginSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Enter email, password, school key, and CAPTCHA." }, { status: 400 });
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

  const principal = await findPrincipalByEmail(payload.data.email);
  const passwordValid = principal ? await bcrypt.compare(payload.data.password, principal.passwordHash) : false;
  const keyValid = principal ? await bcrypt.compare(payload.data.schoolKey, principal.accessKeyHash) : false;

  if (!principal || principal.status !== "active" || !passwordValid || !keyValid) {
    await recordPrincipalLoginEvent({
      principal,
      email: payload.data.email,
      ipAddress: clientIp(request),
      userAgent: request.headers.get("user-agent"),
      status: "failed"
    });
    return NextResponse.json({ error: "Invalid principal credentials or school key." }, { status: 401 });
  }

  const token = signToken({
    id: principal.id,
    email: principal.email,
    role: "principal",
    name: principal.principalName,
    schoolId: principal.schoolId,
    schoolName: principal.schoolName
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
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}
