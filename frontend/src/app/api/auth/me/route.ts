import { NextResponse } from "next/server";
import { findUserByEmail, isMysqlConfigured, refreshActiveSession } from "@/lib/db";
import { currentUser } from "@/lib/security";
import { publicUser, store } from "@/lib/store";

export async function GET(request: Request) {
  const user = await currentUser(request);

  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  // Refresh session TTL (sliding window) — keeps user logged in while active
  if (user.sid) {
    refreshActiveSession(user.id, user.sid).catch(() => {});
  }

  if (isMysqlConfigured()) {
    const mysqlUser = await findUserByEmail(user.email);
    return NextResponse.json({ user: mysqlUser ? publicUser(mysqlUser) : user });
  }

  const devUser = store.users.find((item) => item.email === user.email);
  return NextResponse.json({ user: devUser ? publicUser(devUser) : user });
}
