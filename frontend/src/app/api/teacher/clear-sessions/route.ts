import { NextResponse } from "next/server";
import { clearActiveSessions, findTeacherByEmail } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { clearAuthCookies } from "@/lib/security";
import { teacherLoginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const payload = teacherLoginSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Enter teacher email, password, staff key, and CAPTCHA." }, { status: 400 });
  }

  const teacher = await findTeacherByEmail(payload.data.email);
  const passwordResult = teacher ? await verifyPassword(payload.data.password, teacher.passwordHash) : { valid: false };
  const staffKeyResult = teacher ? await verifyPassword(payload.data.staffKey, teacher.staffKeyHash) : { valid: false };

  if (!teacher || teacher.status !== "active" || !passwordResult.valid || !staffKeyResult.valid) {
    return NextResponse.json({ error: "Invalid teacher credentials or staff key." }, { status: 401 });
  }

  await clearActiveSessions(teacher.id);

  const response = NextResponse.json({
    ok: true,
    code: "PREVIOUS_SESSIONS_CLEARED",
    reloadRequired: true
  });
  clearAuthCookies(response);
  return response;
}
