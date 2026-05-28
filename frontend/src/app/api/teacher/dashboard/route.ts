import { NextResponse } from "next/server";
import { getTeacherDashboard } from "@/lib/db";
import { currentTeacher } from "@/lib/security";

export async function GET(request: Request) {
  const auth = await currentTeacher(request);

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dashboard = await getTeacherDashboard(auth.id);

  if (!dashboard) {
    return NextResponse.json({ error: "Teacher dashboard not found." }, { status: 404 });
  }

  return NextResponse.json(dashboard);
}
