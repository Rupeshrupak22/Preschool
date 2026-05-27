import { NextResponse } from "next/server";
import { getPrincipalDashboard } from "@/lib/db";
import { currentPrincipal } from "@/lib/security";

export async function GET(request: Request) {
  const auth = await currentPrincipal(request);

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dashboard = await getPrincipalDashboard(auth.id);

  if (!dashboard) {
    return NextResponse.json({ error: "Principal dashboard not found." }, { status: 404 });
  }

  return NextResponse.json(dashboard);
}
