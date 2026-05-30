import { NextResponse } from "next/server";
import { clearActiveSessions, findPrincipalByEmail } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { clearAuthCookies } from "@/lib/security";
import { principalLoginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const payload = principalLoginSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Enter email, password, school key, and CAPTCHA." }, { status: 400 });
  }

  const principal = await findPrincipalByEmail(payload.data.email);
  const passwordResult = principal ? await verifyPassword(payload.data.password, principal.passwordHash) : { valid: false };
  const keyResult = principal ? await verifyPassword(payload.data.schoolKey, principal.accessKeyHash) : { valid: false };

  if (!principal || principal.status !== "active" || !passwordResult.valid || !keyResult.valid) {
    return NextResponse.json({ error: "Invalid principal credentials or school key." }, { status: 401 });
  }

  await clearActiveSessions(principal.id);

  const response = NextResponse.json({
    ok: true,
    code: "PREVIOUS_SESSIONS_CLEARED",
    reloadRequired: true
  });
  clearAuthCookies(response);
  return response;
}
