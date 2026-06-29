import { NextResponse } from "next/server";
import { currentUser } from "@/lib/security";
import { connectDb } from "@/lib/db";

export async function POST(request: Request) {
  const user = await currentUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pool = await connectDb();
  if (!pool) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  const { homeworkId, fileName, fileUrl, comment } = body;

  if (!homeworkId) {
    return NextResponse.json({ error: "homeworkId required" }, { status: 400 });
  }

  const submissionId = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  try {
    // Check if homework_submissions table exists, create if not
    await pool.query(`
      CREATE TABLE IF NOT EXISTS homework_submissions (
        id VARCHAR(64) PRIMARY KEY,
        homework_id VARCHAR(64) NOT NULL,
        student_email VARCHAR(190) NOT NULL,
        student_name VARCHAR(160),
        file_name VARCHAR(190),
        file_url TEXT,
        comment TEXT,
        status VARCHAR(40) DEFAULT 'submitted',
        grade VARCHAR(20),
        teacher_feedback TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_hw_sub (homework_id),
        INDEX idx_student_sub (student_email)
      )
    `);

    // Delete existing submission for resubmission
    await pool.query(
      "DELETE FROM homework_submissions WHERE homework_id = ? AND student_email = ?",
      [homeworkId, user.email]
    );

    // Insert new submission
    await pool.query(
      `INSERT INTO homework_submissions (id, homework_id, student_email, student_name, file_name, file_url, comment)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [submissionId, homeworkId, user.email, user.name, fileName || null, fileUrl || null, comment || null]
    );

    // Update homework status for this student
    await pool.query(
      `UPDATE teacher_homework SET status = 'submitted' WHERE id = ? AND student_email = ?`,
      [homeworkId, user.email]
    ).catch(() => {});

    return NextResponse.json({ ok: true, id: submissionId });
  } catch (error) {
    console.error("Submit homework error:", error);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
