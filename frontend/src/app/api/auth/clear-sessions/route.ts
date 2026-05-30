import { NextResponse } from "next/server";
import { findUserByEmail, clearActiveSessions } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { clearAuthCookies } from "@/lib/security";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const payload = loginSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
  }

  const user = await findUserByEmail(payload.data.email);

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  // Re-verify credentials before clearing sessions — prevents unauthorized session clearing
  const { valid } = await verifyPassword(payload.data.password, user.passwordHash);

  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  // Clear all active sessions for this user
  await clearActiveSessions(user.id);

  const response = NextResponse.json({
    ok: true,
    message: "Previous sessions cleared. You can now log in."
  });

  // Also clear any cookies on this device
  clearAuthCookies(response);

  return response;
}
