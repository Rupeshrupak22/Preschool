import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import {
  createActiveSession,
  findActiveSession,
  findTeacherByEmail,
  recordTeacherLoginEvent,
  updatePasswordHash,
  updateStaffKeyHash
} from "@/lib/db";
import { verifyPassword, hashPassword } from "@/lib/password";
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
  const passwordResult = teacher ? await verifyPassword(payload.data.password, teacher.passwordHash) : { valid: false, needsRehash: false };
  // Staff key: try exact match first, then uppercase fallback for legacy records
  let staffKeyResult = teacher ? await verifyPassword(payload.data.staffKey, teacher.staffKeyHash) : { valid: false, needsRehash: false };
  if (!staffKeyResult.valid && teacher) {
    staffKeyResult = await verifyPassword(payload.data.staffKey.toUpperCase(), teacher.staffKeyHash);
  }

  if (!teacher || teacher.status !== "active" || !passwordResult.valid || !staffKeyResult.valid) {
    await recordTeacherLoginEvent({
      teacher,
      email: payload.data.email,
      ipAddress: clientIp(request),
      userAgent: request.headers.get("user-agent"),
      status: "failed"
    });
    return NextResponse.json({ error: "Invalid teacher credentials or staff key." }, { status: 401 });
  }

  const existingSession = await findActiveSession(teacher.id);
  if (existingSession) {
    return NextResponse.json(
      {
        error: "This teacher account is already active on another device. Clear previous sessions, refresh, and login again.",
        code: "ACTIVE_SESSION_EXISTS",
        action: "CLEAR_PREVIOUS_SESSIONS_AND_RELOGIN"
      },
      { status: 409 }
    );
  }

  // Transparently upgrade bcrypt hashes to Argon2id
  if (passwordResult.needsRehash) {
    const newHash = await hashPassword(payload.data.password);
    await updatePasswordHash("teachers", teacher.email, newHash);
  }
  if (staffKeyResult.needsRehash) {
    // Rehash using the value that actually matched
    const matchedKey = (await verifyPassword(payload.data.staffKey, teacher.staffKeyHash)).valid
      ? payload.data.staffKey
      : payload.data.staffKey.toUpperCase();
    const newHash = await hashPassword(matchedKey);
    await updateStaffKeyHash("teachers", teacher.email, newHash);
  }

  const sid = randomBytes(32).toString("hex");
  const token = signToken({
    id: teacher.id,
    teacherId: teacher.id,
    email: teacher.email,
    role: "teacher",
    name: teacher.teacherName,
    schoolId: teacher.schoolId,
    schoolName: teacher.schoolName,
    sid
  });

  await createActiveSession({
    userId: teacher.id,
    sid,
    email: teacher.email,
    role: "teacher",
    ttlSeconds: 15 * 60
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
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 15 * 60
  });

  return response;
}
