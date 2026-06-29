import { NextResponse } from "next/server";
import { currentTeacher } from "@/lib/security";
import { refreshActiveSession } from "@/lib/db";

export async function GET(request: Request) {
  const teacher = await currentTeacher(request);

  if (!teacher) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (teacher.sid) {
    refreshActiveSession(teacher.id, teacher.sid).catch(() => {});
  }

  return NextResponse.json({ user: teacher });
}
