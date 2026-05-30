import { NextResponse } from "next/server";
import { findPrincipalByEmail, clearActiveSessions } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { clearAuthCookies } from "@/lib/security";
import { principalLoginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const payload = principalLoginSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Enter email, password, and school key." }, { status: 400 });
  }

  const principal = await findPrincipalByEmail(payload.data.email);

  if (!principal || principal.status !== "active") {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  // Re-verify credentials before clearing sessions — prevents unauthorized session clearing
  const passwordResult = await verifyPassword(payload.data.password, principal.passwordHash);
  const keyResult = await verifyPassword(payload.data.schoolKey, principal.accessKeyHash);

  if (!passwordResult.valid || !keyResult.valid) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  // Clear all active sessions for this principal
  await clearActiveSessions(principal.id);

  const response = NextResponse.json({
    ok: true,
    message: "Previous sessions cleared. You can now log in."
  });

  // Also clear any cookies on this device
  clearAuthCookies(response);

  return response;
}
