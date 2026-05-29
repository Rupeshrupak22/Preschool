import { NextResponse } from "next/server";
import { connectDb, isMysqlConfigured } from "@/lib/db";
import { currentUser } from "@/lib/security";
import type { RowDataPacket } from "mysql2/promise";

export async function POST(request: Request) {
  const auth = await currentUser(request);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  if (!isMysqlConfigured()) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const { email, role } = await request.json();

  if (!email || !role) {
    return NextResponse.json({ error: "Email and role are required." }, { status: 400 });
  }

  // Prevent admin from deleting themselves
  if (email === auth.email) {
    return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
  }

  const pool = await connectDb();
  if (!pool) {
    return NextResponse.json({ error: "Database connection failed." }, { status: 500 });
  }

  try {
    if (role === "principal") {
      const [rows] = await pool.query<RowDataPacket[]>("SELECT id, principal_name FROM principals WHERE email = ?", [email]);
      if (!rows.length) {
        return NextResponse.json({ error: "Principal not found." }, { status: 404 });
      }
      await pool.query("DELETE FROM principal_login_events WHERE email = ?", [email]);
      await pool.query("DELETE FROM principals WHERE email = ?", [email]);
      return NextResponse.json({ ok: true, message: `Principal "${rows[0].principal_name}" (${email}) deleted.` });

    } else if (role === "teacher") {
      const [rows] = await pool.query<RowDataPacket[]>("SELECT id, teacher_name FROM teachers WHERE email = ?", [email]);
      if (!rows.length) {
        return NextResponse.json({ error: "Teacher not found." }, { status: 404 });
      }
      await pool.query("DELETE FROM teacher_login_events WHERE email = ?", [email]);
      await pool.query("DELETE FROM teacher_class_sessions WHERE teacher_id = ?", [rows[0].id]);
      await pool.query("DELETE FROM teachers WHERE email = ?", [email]);
      return NextResponse.json({ ok: true, message: `Teacher "${rows[0].teacher_name}" (${email}) deleted.` });

    } else {
      // Student or Admin
      const [rows] = await pool.query<RowDataPacket[]>("SELECT id, name, role FROM users WHERE email = ?", [email]);
      if (!rows.length) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
      }

      // Delete related records
      await pool.query("DELETE FROM login_events WHERE email = ?", [email]);
      await pool.query("DELETE FROM students WHERE email = ?", [email]);
      await pool.query("DELETE FROM enrollments WHERE user_email = ?", [email]);
      await pool.query("DELETE FROM certificates WHERE user_email = ?", [email]);
      await pool.query("DELETE FROM payments WHERE user_email = ?", [email]);
      await pool.query("DELETE FROM notifications WHERE user_email = ?", [email]);
      await pool.query("DELETE FROM otps WHERE email = ?", [email]);
      await pool.query("DELETE FROM users WHERE email = ?", [email]);

      return NextResponse.json({ ok: true, message: `${rows[0].role} "${rows[0].name}" (${email}) deleted.` });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Failed to delete user: ${message}` }, { status: 500 });
  }
}
