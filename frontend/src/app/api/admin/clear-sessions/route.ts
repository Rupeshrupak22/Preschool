import { NextResponse } from "next/server";
import { findUserByEmail, clearActiveSessions } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { clearAuthCookies } from "@/lib/security";

export async function POST(request: Request) {
  let body: { email?: string; password?: string; accessKey?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { email, password, accessKey } = body;

  if (!email || !password || !accessKey) {
    return NextResponse.json({ error: "Email, password, and access key are required." }, { status: 400 });
  }

  const user = await findUserByEmail(email.trim().toLowerCase());

  // Must be an admin account
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  // Re-verify password before clearing sessions — prevents unauthorized clearing
  const { valid } = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  // Clear all active sessions for this admin
  await clearActiveSessions(user.id);

  const response = NextResponse.json({
    ok: true,
    message: "Previous sessions cleared. You can now log in."
  });

  // Also clear any cookies on this device
  clearAuthCookies(response);

  return response;
}
