import { NextResponse } from "next/server";
import { createStudentDoubt, findUserByEmail } from "@/lib/db";
import { currentUser } from "@/lib/security";

export async function POST(request: Request) {
  const auth = await currentUser(request);

  if (!auth || auth.role !== "student") {
    return NextResponse.json({ error: "Student login required." }, { status: 401 });
  }

  const user = await findUserByEmail(auth.email);
  if (!user || user.role !== "student") {
    return NextResponse.json({ error: "Student profile not found." }, { status: 404 });
  }

  const payload = await request.json().catch(() => null);
  if (!payload?.subject || !payload?.question) {
    return NextResponse.json({ error: "Subject and question are required." }, { status: 400 });
  }

  const result = await createStudentDoubt(user, {
    subject: String(payload.subject),
    question: String(payload.question),
    attachmentName: payload.attachmentName ? String(payload.attachmentName) : undefined,
    attachmentType: payload.attachmentType ? String(payload.attachmentType) : undefined,
  });

  return result
    ? NextResponse.json({ ok: true, result })
    : NextResponse.json({ error: "Doubt could not be submitted." }, { status: 500 });
}
