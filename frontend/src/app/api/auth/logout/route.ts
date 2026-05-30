import { NextResponse } from "next/server";
import { clearActiveSessions } from "@/lib/db";
import { clearAuthCookies, currentUser } from "@/lib/security";

export async function POST(request: Request) {
  const user = await currentUser(request);
  if (user) {
    await clearActiveSessions(user.id);
  }

  const response = NextResponse.json({ ok: true });
  clearAuthCookies(response);
  return response;
}
