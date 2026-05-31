import { NextResponse } from "next/server";
import { currentTeacher } from "@/lib/security";

export async function GET(request: Request) {
  const teacher = await currentTeacher(request);

  if (!teacher) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  return NextResponse.json({ user: teacher });
}
