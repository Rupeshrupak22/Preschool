import { NextResponse } from "next/server";
import { currentTeacher } from "@/lib/security";
import { connectDb } from "@/lib/db";

export async function GET(request: Request) {
  const teacher = await currentTeacher(request);
  if (!teacher) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pool = await connectDb();
  if (!pool) {
    return NextResponse.json({ submissions: [] });
  }

  try {
    // Fetch submissions for homework assigned by this teacher
    const [rows] = await pool.query(
      `SELECT s.id, s.homework_id, s.student_email, s.student_name, s.file_name, s.file_url, s.comment, s.status, s.grade, s.teacher_feedback, s.created_at
       FROM homework_submissions s
       INNER JOIN teacher_homework h ON h.id = s.homework_id
       WHERE h.teacher_id = ?
       ORDER BY s.created_at DESC
       LIMIT 100`,
      [teacher.id]
    );

    const submissions = (rows as any[]).map((row) => ({
      id: row.id,
      homework_id: row.homework_id,
      student_name: row.student_name || row.student_email,
      student_email: row.student_email,
      file_name: row.file_name,
      file_url: row.file_url,
      comment: row.comment,
      status: row.status,
      grade: row.grade,
      teacher_feedback: row.teacher_feedback,
      created_at: row.created_at ? new Date(row.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "",
    }));

    return NextResponse.json({ submissions });
  } catch (error) {
    // Table might not exist yet
    return NextResponse.json({ submissions: [] });
  }
}
