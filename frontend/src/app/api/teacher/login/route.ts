import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { findTeacherByEmail, recordTeacherLoginEvent } from "@/lib/db";
import { activeCookieSessions, clearAuthCookies, signToken } from "@/lib/security";
import { teacherLoginSchema } from "@/lib/validators";

function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip");
}

export async function POST(request: Request) {
  const payload = teacherLoginSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Enter teacher email, password, staff key, and CAPTCHA." }, { status: 400 });
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

  const teacher = await findTeacherByEmail(payload.data.email);
  const passwordValid = teacher ? await bcrypt.compare(payload.data.password, teacher.passwordHash) : false;
  const staffKeyValid = teacher ? await bcrypt.compare(payload.data.staffKey, teacher.staffKeyHash) : false;

  if (!teacher || teacher.status !== "active" || !passwordValid || !staffKeyValid) {
    await recordTeacherLoginEvent({
      teacher,
      email: payload.data.email,
      ipAddress: clientIp(request),
      userAgent: request.headers.get("user-agent"),
      status: "failed"
    });
    return NextResponse.json({ error: "Invalid teacher credentials or staff key." }, { status: 401 });
  }

  const token = signToken({
    id: teacher.id,
    teacherId: teacher.id,
    email: teacher.email,
    role: "teacher",
    name: teacher.teacherName,
    schoolId: teacher.schoolId,
    schoolName: teacher.schoolName
  });

  await recordTeacherLoginEvent({
    teacher,
    email: teacher.email,
    ipAddress: clientIp(request),
    userAgent: request.headers.get("user-agent"),
    status: "success"
  });

  const response = NextResponse.json({
    ok: true,
    teacher: {
      id: teacher.id,
      name: teacher.teacherName,
      email: teacher.email,
      schoolId: teacher.schoolId,
      schoolName: teacher.schoolName,
      subject: teacher.subject,
      assignedClasses: teacher.assignedClasses
    }
  });

  clearAuthCookies(response, "adyapan_teacher_token");
  response.cookies.set("adyapan_teacher_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}
