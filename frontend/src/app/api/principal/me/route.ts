import { NextResponse } from "next/server";
import { findPrincipalByEmail } from "@/lib/db";
import { currentPrincipal } from "@/lib/security";

export async function GET(request: Request) {
  const auth = await currentPrincipal(request);

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const principal = await findPrincipalByEmail(auth.email);

  if (!principal || principal.status !== "active") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    principal: {
      id: principal.id,
      name: principal.principalName,
      email: principal.email,
      schoolId: principal.schoolId,
      schoolName: principal.schoolName,
      phone: principal.phone,
      lastLoginAt: principal.lastLoginAt
    }
  });
}
