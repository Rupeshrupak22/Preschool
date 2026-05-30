import { NextResponse } from "next/server";
import { clearActiveSessions } from "@/lib/db";
import { clearAuthCookies, currentTeacher } from "@/lib/security";

export async function POST(request: Request) {
  const teacher = await currentTeacher(request);
  if (teacher) {
    await clearActiveSessions(teacher.id);
  }

  const response = NextResponse.json({ ok: true });
  clearAuthCookies(response);
  return response;
}
