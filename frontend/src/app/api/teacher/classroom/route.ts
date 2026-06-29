import { NextResponse } from "next/server";
import { createTeacherHomework, createTeacherNote, createTeacherRecording, replyToStudentDoubt } from "@/lib/db";
import { currentTeacher } from "@/lib/security";

export async function POST(request: Request) {
  const teacher = await currentTeacher(request);

  if (!teacher) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const action = payload?.action;

  if (action === "homework") {
    if (!payload.title || !payload.subject) {
      return NextResponse.json({ error: "Title and subject are required." }, { status: 400 });
    }

    const result = await createTeacherHomework(teacher.id, {
      title: String(payload.title),
      subject: String(payload.subject),
      description: payload.description ? String(payload.description) : undefined,
      classLevel: payload.classLevel ? String(payload.classLevel) : undefined,
      studentEmail: payload.studentEmail ? String(payload.studentEmail) : undefined,
      dueDate: payload.dueDate ? String(payload.dueDate) : undefined,
      priority: payload.priority,
      fileName: payload.fileName ? String(payload.fileName) : undefined,
      fileSize: payload.fileSize ? String(payload.fileSize) : undefined,
      url: payload.fileUrl ? String(payload.fileUrl) : undefined,
    });

    return result
      ? NextResponse.json({ ok: true, result })
      : NextResponse.json({ error: "Homework could not be created." }, { status: 500 });
  }

  if (action === "note") {
    if (!payload.title || !payload.subject) {
      return NextResponse.json({ error: "Title and subject are required." }, { status: 400 });
    }

    const result = await createTeacherNote(teacher.id, {
      title: String(payload.title),
      subject: String(payload.subject),
      description: payload.description ? String(payload.description) : undefined,
      classLevel: payload.classLevel ? String(payload.classLevel) : undefined,
      studentEmail: payload.studentEmail ? String(payload.studentEmail) : undefined,
      fileName: payload.fileName ? String(payload.fileName) : undefined,
      fileSize: payload.fileSize ? String(payload.fileSize) : undefined,
      noteType: payload.noteType,
      url: payload.fileUrl ? String(payload.fileUrl) : (payload.url ? String(payload.url) : undefined),
    });

    return result
      ? NextResponse.json({ ok: true, result })
      : NextResponse.json({ error: "Note could not be created." }, { status: 500 });
  }

  if (action === "recording") {
    if (!payload.title || !payload.subject) {
      return NextResponse.json({ error: "Title and subject are required." }, { status: 400 });
    }

    const result = await createTeacherRecording(teacher.id, {
      title: String(payload.title),
      subject: String(payload.subject),
      description: payload.description ? String(payload.description) : undefined,
      classLevel: payload.classLevel ? String(payload.classLevel) : undefined,
      fileName: payload.fileName ? String(payload.fileName) : undefined,
      fileSize: payload.fileSize ? String(payload.fileSize) : undefined,
      url: payload.fileUrl ? String(payload.fileUrl) : undefined,
      duration: payload.duration ? String(payload.duration) : undefined,
    });

    return result
      ? NextResponse.json({ ok: true, result })
      : NextResponse.json({ error: "Recording could not be saved." }, { status: 500 });
  }

  if (action === "reply-doubt") {
    if (!payload.doubtId || !payload.replyText) {
      return NextResponse.json({ error: "Doubt id and reply are required." }, { status: 400 });
    }

    const result = await replyToStudentDoubt(teacher.id, String(payload.doubtId), String(payload.replyText));
    return result
      ? NextResponse.json({ ok: true, result })
      : NextResponse.json({ error: "Doubt reply could not be saved." }, { status: 404 });
  }

  return NextResponse.json({ error: "Unknown teacher classroom action." }, { status: 400 });
}
