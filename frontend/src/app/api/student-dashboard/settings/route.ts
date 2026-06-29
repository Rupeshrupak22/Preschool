import { NextResponse } from "next/server";
import { currentUser } from "@/lib/security";
import { connectDb } from "@/lib/db";
import { verifyPassword, hashPassword } from "@/lib/password";

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
  const action = body.action;

  if (action === "profile") {
    const { name, phone } = body;
    await pool.query(
      "UPDATE users SET name = ?, phone = ?, updated_at = NOW() WHERE id = ? OR email = ?",
      [name || user.name, phone || null, user.id, user.email]
    );
    // Also update students table if exists
    try {
      await pool.query(
        "UPDATE students SET name = ?, phone = ?, updated_at = NOW() WHERE email = ?",
        [name || user.name, phone || null, user.email]
      );
    } catch {}
    return NextResponse.json({ ok: true });
  }

  if (action === "avatar") {
    const { avatarUrl } = body;
    await pool.query(
      "UPDATE users SET avatar_url = ?, updated_at = NOW() WHERE id = ? OR email = ?",
      [avatarUrl, user.id, user.email]
    );
    return NextResponse.json({ ok: true });
  }

  if (action === "notifications") {
    // Store notification preferences (could use a preferences table, but for now just acknowledge)
    return NextResponse.json({ ok: true });
  }

  if (action === "password") {
    const { currentPassword, newPassword } = body;
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Both passwords required." }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be 6+ characters." }, { status: 400 });
    }

    // Get current password hash
    const [rows] = await pool.query<any[]>(
      "SELECT password_hash, password FROM users WHERE id = ? OR email = ? LIMIT 1",
      [user.id, user.email]
    );
    const userRow = rows[0];
    if (!userRow) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const storedHash = userRow.password_hash || userRow.password;
    const { valid } = await verifyPassword(currentPassword, storedHash);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }

    const newHash = await hashPassword(newPassword);
    await pool.query(
      "UPDATE users SET password_hash = ?, password = ?, updated_at = NOW() WHERE id = ? OR email = ?",
      [newHash, newHash, user.id, user.email]
    );

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
