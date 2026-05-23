import { NextResponse } from "next/server";
import { currentUser } from "@/lib/security";

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  return NextResponse.json({ user });
}


