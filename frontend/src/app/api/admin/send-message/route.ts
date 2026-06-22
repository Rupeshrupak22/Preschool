import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { recipient, message, senderRole, senderEmail: senderEmailParam, senderName: senderNameParam } = await request.json();

    if (!recipient || !message?.trim()) {
      return NextResponse.json({ error: "Recipient and message are required." }, { status: 400 });
    }

    const pool = await connectDb();
    if (!pool) {
      return NextResponse.json({ error: "Database not configured." }, { status: 503 });
    }

    const id = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const senderName = senderNameParam || (senderRole === "principal" ? "Principal" : senderRole === "teacher" ? "Teacher" : "Admin");
    const senderEmail = senderEmailParam || "admin@adyapan.com";

    if (recipient.includes(":")) {
      // Individual message: "teacher:email" or "principal:email" or "student:email" or "admin:email"
      const [role, email] = recipient.split(":");
      await pool.query(
        `INSERT INTO admin_messages (id, sender_email, sender_name, recipient_type, recipient_email, recipient_role, message)
         VALUES (?, ?, ?, 'individual', ?, ?, ?)`,
        [id, senderEmail, senderName, email, role, message.trim()]
      );
    } else if (recipient === "all-admins" || recipient === "admin") {
      await pool.query(
        `INSERT INTO admin_messages (id, sender_email, sender_name, recipient_type, recipient_role, message)
         VALUES (?, ?, ?, 'broadcast', 'admin', ?)`,
        [id, senderEmail, senderName, message.trim()]
      );
    } else if (recipient === "all-teachers") {
      await pool.query(
        `INSERT INTO admin_messages (id, sender_email, sender_name, recipient_type, recipient_role, message)
         VALUES (?, ?, ?, 'broadcast', 'teacher', ?)`,
        [id, senderEmail, senderName, message.trim()]
      );
    } else if (recipient === "all-principals") {
      await pool.query(
        `INSERT INTO admin_messages (id, sender_email, sender_name, recipient_type, recipient_role, message)
         VALUES (?, ?, ?, 'broadcast', 'principal', ?)`,
        [id, senderEmail, senderName, message.trim()]
      );
    } else if (recipient === "all-students") {
      await pool.query(
        `INSERT INTO admin_messages (id, sender_email, sender_name, recipient_type, recipient_role, message)
         VALUES (?, ?, ?, 'broadcast', 'student', ?)`,
        [id, senderEmail, senderName, message.trim()]
      );
    } else if (recipient === "all") {
      const id2 = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      await pool.query(
        `INSERT INTO admin_messages (id, sender_email, sender_name, recipient_type, recipient_role, message)
         VALUES (?, ?, ?, 'broadcast', 'teacher', ?)`,
        [id, senderEmail, senderName, message.trim()]
      );
      await pool.query(
        `INSERT INTO admin_messages (id, sender_email, sender_name, recipient_type, recipient_role, message)
         VALUES (?, ?, ?, 'broadcast', 'principal', ?)`,
        [id2, senderEmail, senderName, message.trim()]
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
