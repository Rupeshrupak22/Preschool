import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { recipient, message, senderRole, senderEmail, senderName } = await request.json();

    if (!recipient || !message?.trim()) {
      return NextResponse.json({ error: "Recipient and message are required." }, { status: 400 });
    }

    const pool = await connectDb();
    if (!pool) {
      return NextResponse.json({ error: "Database not configured." }, { status: 503 });
    }

    const id = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const name = senderName || senderRole || "User";
    const email = senderEmail || "unknown@adyapan.com";

    if (recipient.includes(":")) {
      const [role, targetEmail] = recipient.split(":");
      await pool.query(
        `INSERT INTO admin_messages (id, sender_email, sender_name, recipient_type, recipient_email, recipient_role, message)
         VALUES (?, ?, ?, 'individual', ?, ?, ?)`,
        [id, email, name, targetEmail, role, message.trim()]
      );
    } else if (recipient === "all-admins" || recipient === "admin") {
      await pool.query(
        `INSERT INTO admin_messages (id, sender_email, sender_name, recipient_type, recipient_role, message)
         VALUES (?, ?, ?, 'broadcast', 'admin', ?)`,
        [id, email, name, message.trim()]
      );
    } else if (recipient === "all-teachers") {
      await pool.query(
        `INSERT INTO admin_messages (id, sender_email, sender_name, recipient_type, recipient_role, message)
         VALUES (?, ?, ?, 'broadcast', 'teacher', ?)`,
        [id, email, name, message.trim()]
      );
    } else if (recipient === "all-principals") {
      await pool.query(
        `INSERT INTO admin_messages (id, sender_email, sender_name, recipient_type, recipient_role, message)
         VALUES (?, ?, ?, 'broadcast', 'principal', ?)`,
        [id, email, name, message.trim()]
      );
    } else if (recipient === "all-students") {
      await pool.query(
        `INSERT INTO admin_messages (id, sender_email, sender_name, recipient_type, recipient_role, message)
         VALUES (?, ?, ?, 'broadcast', 'student', ?)`,
        [id, email, name, message.trim()]
      );
    } else if (recipient === "all") {
      const id2 = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      await pool.query(
        `INSERT INTO admin_messages (id, sender_email, sender_name, recipient_type, recipient_role, message) VALUES (?, ?, ?, 'broadcast', 'teacher', ?)`,
        [id, email, name, message.trim()]
      );
      await pool.query(
        `INSERT INTO admin_messages (id, sender_email, sender_name, recipient_type, recipient_role, message) VALUES (?, ?, ?, 'broadcast', 'principal', ?)`,
        [id2, email, name, message.trim()]
      );
    } else {
      return NextResponse.json({ error: "Invalid recipient." }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
