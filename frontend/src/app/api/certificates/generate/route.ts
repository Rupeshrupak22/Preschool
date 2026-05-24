import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { createCertificate, isMysqlConfigured } from "@/lib/db";
import { id, store } from "@/lib/store";

export async function POST(request: Request) {
  const { studentName, userEmail, course } = await request.json();

  if (!studentName || !userEmail || !course) {
    return NextResponse.json({ error: "Student name, email, and course are required." }, { status: 400 });
  }

  const credentialId = id("ady_cert");
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/certificate/verify/${credentialId}`;
  const qrCode = await QRCode.toDataURL(verifyUrl);
  const certificate = {
    credentialId,
    studentName,
    userEmail,
    course,
    qrCode,
    issuedAt: new Date().toISOString(),
    status: "active"
  };

  if (isMysqlConfigured()) {
    await createCertificate(certificate);
  } else {
    store.certificates.push(certificate);
  }

  return NextResponse.json({ certificate, verifyUrl });
}
