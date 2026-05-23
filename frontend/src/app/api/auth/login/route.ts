import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDb, isMongoConfigured } from "@/lib/db";
import { User } from "@/lib/models";
import { signToken } from "@/lib/security";
import { publicUser, store } from "@/lib/store";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const payload = loginSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Enter a valid email, password, and CAPTCHA." }, { status: 400 });
  }

  if (isMongoConfigured()) {
    await connectDb();
    const user = await User.findOne({ email: payload.data.email });
    const valid = user ? await bcrypt.compare(payload.data.password, user.passwordHash) : false;

    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
    const response = NextResponse.json({ user: publicUser(user.toObject()), token });
    response.cookies.set("adyapan_token", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" });
    return response;
  }

  const user = store.users.find((item) => item.email === payload.data.email);
  const valid = user ? await bcrypt.compare(payload.data.password, String(user.passwordHash)) : false;

  if (!user || !valid) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const role = user.role === "admin" ? "admin" : "student";
  const token = signToken({ id: String(user.id), email: String(user.email), role, name: String(user.name) });
  const response = NextResponse.json({ user: publicUser(user), token, mode: "dev" });
  response.cookies.set("adyapan_token", token, { httpOnly: true, sameSite: "lax", secure: false, path: "/" });
  return response;
}


