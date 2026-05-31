import { NextResponse } from "next/server";
import { currentPrincipal } from "@/lib/security";

export async function GET(request: Request) {
  const principal = await currentPrincipal(request);

  if (!principal) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  return NextResponse.json({ user: principal });
}
