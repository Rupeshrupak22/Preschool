import { NextResponse } from "next/server";
import { findTeacherByEmail, clearActiveSessions } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { clearAuthCookies } from "@/lib/security";
import { teacherLoginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const payload = teacherLoginSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Enter email, password, and staff key." }, { status: 400 });
  }

  const teacher = await findTeacherByEmail(payload.data.email);

  if (!teacher || teacher.status !== "active") {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  // Re-verify credentials before clearing sessions — prevents unauthorized session clearing
  const passwordResult = await verifyPassword(payload.data.password, teacher.passwordHash);
  const staffKeyResult = await verifyPassword(payload.data.staffKey, teacher.staffKeyHash);

  if (!passwordResult.valid || !staffKeyResult.valid) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  // Clear all active sessions for this teacher
  await clearActiveSessions(teacher.id);

  const response = NextResponse.json({
    ok: true,
    message: "Previous sessions cleared. You can now log in."
  });

  // Also clear any cookies on this device
  clearAuthCookies(response);

  return response;
}
