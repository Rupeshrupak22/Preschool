import { NextResponse } from "next/server";
import { getTeacherDashboard } from "@/lib/db";
import { currentTeacher } from "@/lib/security";

// Server-side cache per teacher
const teacherCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

export async function GET(request: Request) {
  const auth = await currentTeacher(request);

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check cache
  const cached = teacherCache.get(auth.id);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  const dashboard = await getTeacherDashboard(auth.id);

  if (!dashboard) {
    return NextResponse.json({ error: "Teacher dashboard not found." }, { status: 404 });
  }

  // Cache result
  teacherCache.set(auth.id, { data: dashboard, timestamp: Date.now() });
  if (teacherCache.size > 100) {
    const oldest = [...teacherCache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp)[0];
    if (oldest) teacherCache.delete(oldest[0]);
  }

  return NextResponse.json(dashboard);
}
