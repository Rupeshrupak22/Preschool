import { NextResponse } from "next/server";
import { getAdminOverview, isMysqlConfigured } from "@/lib/db";
import { currentUser } from "@/lib/security";
import { store } from "@/lib/store";

export async function GET() {
  const auth = await currentUser();

  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  if (isMysqlConfigured()) {
    const overview = await getAdminOverview();
    return NextResponse.json({ ...overview, mode: "mysql" });
  }

  return NextResponse.json({
    students: store.users.filter((user) => user.role !== "admin"),
    leads: store.leads,
    payments: store.payments,
    mode: "dev"
  });
}
