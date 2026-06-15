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

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const { valid } = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  await clearActiveSessions(user.id);

  const response = NextResponse.json({
    ok: true,
    message: "Previous sessions cleared. You can now log in."
  });

  clearAuthCookies(response);
  return response;
}
