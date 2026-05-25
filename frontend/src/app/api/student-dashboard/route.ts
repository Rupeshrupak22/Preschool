import { NextResponse } from "next/server";
import { getStudentDashboardData } from "@/lib/db";
import { currentUser } from "@/lib/security";

export async function GET(request: Request) {
  const user = await currentUser(request);
  const dashboard = await getStudentDashboardData(user?.email);

  return NextResponse.json(dashboard);
}
