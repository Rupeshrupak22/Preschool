import { NextResponse } from "next/server";
import { clearActiveSessions } from "@/lib/db";
import { clearAuthCookies, currentPrincipal } from "@/lib/security";

export async function POST(request: Request) {
  const principal = await currentPrincipal(request);
  if (principal) {
    await clearActiveSessions(principal.id);
  }

  const response = NextResponse.json({ ok: true });
  clearAuthCookies(response);
  return response;
}
