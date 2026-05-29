import { NextResponse } from "next/server";
import { findTeacherByEmail } from "@/lib/db";
import { currentTeacher } from "@/lib/security";

export async function GET(request: Request) {
  const auth = await currentTeacher(request);

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const teacher = await findTeacherByEmail(auth.email);

  if (!teacher || teacher.status !== "active") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    teacher: {
      id: teacher.id,
      name: teacher.teacherName,
      email: teacher.email,
      schoolId: teacher.schoolId,
      schoolName: teacher.schoolName,
      subject: teacher.subject,
      phone: teacher.phone,
      assignedClasses: teacher.assignedClasses,
      lastLoginAt: teacher.lastLoginAt
    }
  });
}
