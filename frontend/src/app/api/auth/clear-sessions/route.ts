import { NextResponse } from "next/server";
import { clearActiveSessions, findUserByEmail } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { clearAuthCookies } from "@/lib/security";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const payload = loginSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Enter a valid email, password, and CAPTCHA." }, { status: 400 });
  }

  const user = await findUserByEmail(payload.data.email);
  const passwordResult = user ? await verifyPassword(payload.data.password, user.passwordHash) : { valid: false };

  if (!user || !passwordResult.valid) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  await clearActiveSessions(user.id);

  const response = NextResponse.json({
    ok: true,
    code: "PREVIOUS_SESSIONS_CLEARED",
    reloadRequired: true
  });
  clearAuthCookies(response);
  return response;
}
