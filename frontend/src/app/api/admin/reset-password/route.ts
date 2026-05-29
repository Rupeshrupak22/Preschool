import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDb, isMysqlConfigured } from "@/lib/db";
import { currentUser, strongPassword } from "@/lib/security";
import type { RowDataPacket } from "mysql2/promise";

export async function POST(request: Request) {
  const auth = await currentUser(request);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  if (!isMysqlConfigured()) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const { email, newPassword, role } = await request.json();

  if (!email || !newPassword) {
    return NextResponse.json({ error: "Email and new password are required." }, { status: 400 });
  }

  if (!strongPassword(newPassword)) {
    return NextResponse.json({ error: "Password must be at least 8 characters with one uppercase letter and one number." }, { status: 400 });
  }

  const pool = await connectDb();
  if (!pool) {
    return NextResponse.json({ error: "Database connection failed." }, { status: 500 });
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  try {
    if (role === "principal") {
      const [rows] = await pool.query<RowDataPacket[]>("SELECT id FROM principals WHERE email = ?", [email]);
      if (!rows.length) {
        return NextResponse.json({ error: "Principal not found." }, { status: 404 });
      }
      await pool.query("UPDATE principals SET password_hash = ? WHERE email = ?", [passwordHash, email]);
      return NextResponse.json({ ok: true, message: `Password reset for principal ${email}.` });

    } else if (role === "teacher") {
      const [rows] = await pool.query<RowDataPacket[]>("SELECT id FROM teachers WHERE email = ?", [email]);
      if (!rows.length) {
        return NextResponse.json({ error: "Teacher not found." }, { status: 404 });
      }
      await pool.query("UPDATE teachers SET password_hash = ? WHERE email = ?", [passwordHash, email]);
      return NextResponse.json({ ok: true, message: `Password reset for teacher ${email}.` });

    } else {
      // Student or Admin — check users table
      const [rows] = await pool.query<RowDataPacket[]>("SELECT id FROM users WHERE email = ?", [email]);
      if (!rows.length) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
      }

      // Check if legacy password column exists
      const [cols] = await pool.query<RowDataPacket[]>(
        "SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'password'"
      );
      const hasPasswordCol = Number(cols[0]?.count ?? 0) > 0;

      if (hasPasswordCol) {
        await pool.query("UPDATE users SET password_hash = ?, password = ? WHERE email = ?", [passwordHash, passwordHash, email]);
      } else {
        await pool.query("UPDATE users SET password_hash = ? WHERE email = ?", [passwordHash, email]);
      }

      return NextResponse.json({ ok: true, message: `Password reset for ${email}.` });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Failed to reset password: ${message}` }, { status: 500 });
  }
}
