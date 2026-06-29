import { NextResponse } from "next/server";
import { currentPrincipal } from "@/lib/security";
import { refreshActiveSession } from "@/lib/db";

export async function GET(request: Request) {
  const principal = await currentPrincipal(request);

  if (!principal) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (principal.sid) {
    refreshActiveSession(principal.id, principal.sid).catch(() => {});
  }

  return NextResponse.json({ user: principal });
}
