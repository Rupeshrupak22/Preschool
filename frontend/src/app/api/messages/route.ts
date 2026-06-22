import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const role = searchParams.get("role");

    if (!email || !role) {
      return NextResponse.json({ error: "Email and role are required." }, { status: 400 });
    }

    const pool = await connectDb();
    if (!pool) {
      return NextResponse.json({ error: "Database not configured." }, { status: 503 });
    }

    // Get messages: individual ones for this email OR broadcast ones for this role
    const [rows] = await pool.query(
      `SELECT id, sender_name, message, is_read, created_at
       FROM admin_messages
       WHERE (recipient_type = 'individual' AND recipient_email = ?)
          OR (recipient_type = 'broadcast' AND recipient_role = ?)
       ORDER BY created_at DESC
       LIMIT 50`,
      [email.toLowerCase(), role.toLowerCase()]
    );

    return NextResponse.json({ success: true, messages: rows });
  } catch (error) {
    console.error("Fetch messages error:", error);
    return NextResponse.json({ error: "Failed to fetch messages." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Message ID required." }, { status: 400 });
    }

    const pool = await connectDb();
    if (!pool) {
      return NextResponse.json({ error: "Database not configured." }, { status: 503 });
    }

    await pool.query("UPDATE admin_messages SET is_read = 1 WHERE id = ?", [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mark read error:", error);
    return NextResponse.json({ error: "Failed to mark message as read." }, { status: 500 });
  }
}
