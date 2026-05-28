import { NextResponse } from "next/server";

// Signup is disabled — only admin can add users to the database
export async function POST() {
  return NextResponse.json(
    { error: "Registration is disabled. Only pre-registered accounts can login. Contact your school admin." },
    { status: 403 }
  );
}
