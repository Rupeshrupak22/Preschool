import { NextResponse } from "next/server";
import { createLead, isMysqlConfigured } from "@/lib/db";
import { sendEmail } from "@/lib/mail";
import { id, store } from "@/lib/store";
import { leadSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const payload = leadSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Please enter a valid email and required details." }, { status: 400 });
  }

  const lead = { id: id("lead"), ...payload.data, createdAt: new Date().toISOString() };

  if (isMysqlConfigured()) {
    await createLead(payload.data);
  } else {
    store.leads.push(lead);
  }

  await sendEmail({
    to: payload.data.email,
    subject: "ADYAPAN received your request",
    html: `<p>Thanks for reaching out. Our future skills team will contact you soon.</p>`
  });

  return NextResponse.json({ ok: true, lead, mode: isMysqlConfigured() ? "mysql" : "dev" });
}
