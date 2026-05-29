import { NextResponse } from "next/server";
import { isMysqlConfigured, updateUserProfile } from "@/lib/db";
import { clearAuthCookies, currentUser, signToken } from "@/lib/security";
import { publicUser, store } from "@/lib/store";
import { profileSchema } from "@/lib/validators";

export async function PATCH(request: Request) {
  const authUser = await currentUser(request);

  if (!authUser) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const payload = profileSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Please enter a valid name and profile details." }, { status: 400 });
  }

  const cleanProfile = {
    name: payload.data.name.trim(),
    phone: payload.data.phone?.trim() || null,
    classLevel: payload.data.classLevel?.trim() || null,
    schoolName: payload.data.schoolName?.trim() || null
  };

  if (isMysqlConfigured()) {
    const updated = await updateUserProfile(authUser.email, cleanProfile);

    if (!updated) {
      return NextResponse.json({ error: "Profile could not be updated." }, { status: 500 });
    }

    const token = signToken({ id: updated.id, email: updated.email, role: updated.role, name: updated.name });
    const response = NextResponse.json({ user: publicUser(updated), mode: "mysql" });
    clearAuthCookies(response, "adyapan_token");
    response.cookies.set("adyapan_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8
    });
    return response;
  }

  const existing = store.users.find((item) => item.email === authUser.email);

  if (!existing) {
    return NextResponse.json({ error: "Profile not found." }, { status: 404 });
  }

  Object.assign(existing, cleanProfile, { updatedAt: new Date().toISOString() });
  const role = existing.role === "admin" ? "admin" : "student";
  const token = signToken({ id: String(existing.id), email: String(existing.email), role, name: cleanProfile.name });
  const response = NextResponse.json({ user: publicUser(existing), mode: "dev" });
  clearAuthCookies(response, "adyapan_token");
  response.cookies.set("adyapan_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 8
  });
  return response;
}
