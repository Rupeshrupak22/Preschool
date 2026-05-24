import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createUser, findUserByEmail, isMysqlConfigured, recordLoginEvent } from "@/lib/db";
import { sendEmail } from "@/lib/mail";
import { signToken, strongPassword } from "@/lib/security";
import { id, publicUser, store } from "@/lib/store";
import { signupSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const payload = signupSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Please complete all fields and enter CAPTCHA as ADYAPAN." }, { status: 400 });
  }

  if (!strongPassword(payload.data.password)) {
    return NextResponse.json({ error: "Password must include 8 characters, one uppercase letter, and one number." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(payload.data.password, 12);
  const role = payload.data.email.endsWith("@adyapan.com") ? "admin" : "student";

  if (isMysqlConfigured()) {
    const exists = await findUserByEmail(payload.data.email);

    if (exists) {
      return NextResponse.json({ error: "An account already exists for this email." }, { status: 409 });
    }

    const user = await createUser({ ...payload.data, passwordHash, role });

    if (!user) {
      return NextResponse.json({ error: "MySQL is not configured correctly." }, { status: 500 });
    }

    const token = signToken({ id: user.id, email: user.email, role, name: user.name });
    await recordLoginEvent({
      user,
      ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip"),
      userAgent: request.headers.get("user-agent"),
      status: "signup"
    });
    await sendEmail({
      to: user.email,
      subject: "Welcome to ADYAPAN Future Skills",
      html: `<p>Hi ${user.name}, your future skills account is ready.</p>`
    });

    const response = NextResponse.json({ user: publicUser(user), token, mode: "mysql" });
    response.cookies.set("adyapan_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/"
    });
    return response;
  }

  const exists = store.users.find((user) => user.email === payload.data.email);

  if (exists) {
    return NextResponse.json({ error: "An account already exists for this email." }, { status: 409 });
  }

  const user = {
    id: id("user"),
    ...payload.data,
    role,
    passwordHash,
    unlockedCourses: ["Future Skills Starter"],
    createdAt: new Date().toISOString()
  };

  store.users.push(user);
  await sendEmail({
    to: payload.data.email,
    subject: "Welcome to ADYAPAN Future Skills",
    html: `<p>Hi ${payload.data.name}, your future skills account is ready.</p>`
  });

  const token = signToken({ id: String(user.id), email: payload.data.email, role, name: payload.data.name });
  const response = NextResponse.json({ user: publicUser(user), token, mode: "dev" });
  response.cookies.set("adyapan_token", token, { httpOnly: true, sameSite: "lax", secure: false, path: "/" });
  return response;
}
