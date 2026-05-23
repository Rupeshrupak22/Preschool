import { NextResponse } from "next/server";
import { connectDb, isMongoConfigured } from "@/lib/db";
import { Lead, Payment, User } from "@/lib/models";
import { currentUser } from "@/lib/security";
import { store } from "@/lib/store";

export async function GET() {
  const auth = await currentUser();

  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  if (isMongoConfigured()) {
    await connectDb();
    const [students, leads, payments] = await Promise.all([
      User.find({ role: "student" }).sort({ createdAt: -1 }).limit(50),
      Lead.find({}).sort({ createdAt: -1 }).limit(50),
      Payment.find({}).sort({ createdAt: -1 }).limit(50)
    ]);

    return NextResponse.json({ students, leads, payments, mode: "mongo" });
  }

  return NextResponse.json({
    students: store.users.filter((user) => user.role !== "admin"),
    leads: store.leads,
    payments: store.payments,
    mode: "dev"
  });
}


