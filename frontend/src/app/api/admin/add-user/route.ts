import { NextResponse } from "next/server";
import { connectDb, findUserByEmail, findPrincipalByEmail, findTeacherByEmail, isMysqlConfigured } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { currentUser, strongPassword } from "@/lib/security";
import { id } from "@/lib/store";
import type { RowDataPacket } from "mysql2/promise";

export async function POST(request: Request) {
  // Only admin can add users
  const auth = await currentUser(request);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  if (!isMysqlConfigured()) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const body = await request.json();
  const { role, name, email, password, phone, classLevel, school, schoolId, schoolKey, staffKey, subject, classes } = body;

  if (!role || !name || !email || !password) {
    return NextResponse.json({ error: "Name, email, password, and role are required." }, { status: 400 });
  }

  if (!strongPassword(password)) {
    return NextResponse.json({ error: "Password must be at least 8 characters with one uppercase letter and one number." }, { status: 400 });
  }

  const pool = await connectDb();
  if (!pool) {
    return NextResponse.json({ error: "Database connection failed." }, { status: 500 });
  }

  const passwordHash = await hashPassword(password);

  try {
    if (role === "student" || role === "admin") {
      const existing = await findUserByEmail(email);
      if (existing) {
        return NextResponse.json({ error: `User with email ${email} already exists.` }, { status: 409 });
      }

      const userId = id("user");

      // Check if legacy password column exists
      const [cols] = await pool.query<RowDataPacket[]>(
        "SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'password'",
      );
      const hasPasswordCol = Number(cols[0]?.count ?? 0) > 0;

      const columns = ["id", "name", "email", "password_hash", ...(hasPasswordCol ? ["password"] : []), "phone", "class_level", "class_name", "school_name", "school", "role", "signup_source", "access_key_hash"];
      // For admin users, set the default access key hash (SHA-256 of ADMIN-ADY-2026)
      const crypto = await import("node:crypto");
      const accessKeyHash = role === "admin" ? crypto.createHash("sha256").update("ADMIN-ADY-2026").digest("hex") : null;
      const values = [userId, name, email, passwordHash, ...(hasPasswordCol ? [passwordHash] : []), phone || null, classLevel || null, classLevel || null, school || null, school || null, role, "admin", accessKeyHash];

      await pool.query(
        `INSERT INTO users (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`,
        values
      );

      if (role === "student") {
        await pool.query(
          `INSERT INTO students (id, user_id, name, email, phone, class_level, class_name, school_name, school, signup_source)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'admin')
           ON DUPLICATE KEY UPDATE user_id = VALUES(user_id), name = VALUES(name)`,
          [id("student"), userId, name, email, phone || null, classLevel || null, classLevel || null, school || null, school || null]
        );
      }

      return NextResponse.json({ ok: true, message: `${role === "admin" ? "Admin" : "Student"} "${name}" added successfully.`, userId });

    } else if (role === "principal") {
      if (!school || !schoolKey) {
        return NextResponse.json({ error: "School name and school key are required for principal." }, { status: 400 });
      }

      const existing = await findPrincipalByEmail(email);
      if (existing) {
        return NextResponse.json({ error: `Principal with email ${email} already exists.` }, { status: 409 });
      }

      const accessKeyHash = await hashPassword(schoolKey);
      const principalId = id("principal");
      const finalSchoolId = schoolId || id("school");

      // Ensure school exists
      await pool.query(
        `INSERT INTO schools (id, name, status) VALUES (?, ?, 'active') ON DUPLICATE KEY UPDATE name = VALUES(name)`,
        [finalSchoolId, school]
      );

      await pool.query(
        `INSERT INTO principals (id, school_id, school_name, principal_name, email, password_hash, access_key_hash, phone, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
        [principalId, finalSchoolId, school, name, email, passwordHash, accessKeyHash, phone || null]
      );

      return NextResponse.json({ ok: true, message: `Principal "${name}" added for school "${school}".`, principalId });

    } else if (role === "teacher") {
      if (!school || !staffKey) {
        return NextResponse.json({ error: "School name and staff key are required for teacher." }, { status: 400 });
      }

      const existing = await findTeacherByEmail(email);
      if (existing) {
        return NextResponse.json({ error: `Teacher with email ${email} already exists.` }, { status: 409 });
      }

      const staffKeyHash = await hashPassword(staffKey);
      const teacherId = id("teacher");
      const finalSchoolId = schoolId || id("school");
      const assignedClasses = classes ? (Array.isArray(classes) ? classes : classes.split(",").map((c: string) => c.trim())) : [];

      await pool.query(
        `INSERT INTO teachers (id, school_id, school_name, teacher_name, email, password_hash, staff_key_hash, subject, phone, assigned_classes, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
        [teacherId, finalSchoolId, school, name, email, passwordHash, staffKeyHash, subject || null, phone || null, JSON.stringify(assignedClasses)]
      );

      return NextResponse.json({ ok: true, message: `Teacher "${name}" added for school "${school}".`, teacherId });

    } else {
      return NextResponse.json({ error: "Invalid role. Use: student, admin, principal, teacher." }, { status: 400 });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Failed to add user: ${message}` }, { status: 500 });
  }
}
