import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

const fallbackSecret = "local-dev-secret-change-in-production";
export const authCookieNames = ["adyapan_token", "adyapan_principal_token", "adyapan_teacher_token"] as const;
type AuthCookieName = (typeof authCookieNames)[number];

export type AuthPayload = {
  id: string;
  email: string;
  role: "student" | "admin" | "principal" | "teacher";
  name: string;
  schoolId?: string;
  schoolName?: string;
  teacherId?: string;
};

function jwtSecret() {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required in production.");
  }

  return fallbackSecret;
}

export function signToken(payload: AuthPayload) {
  return jwt.sign(payload, jwtSecret(), {
    expiresIn: "8h"
  });
}

export function verifyToken(token?: string): AuthPayload | null {
  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, jwtSecret()) as AuthPayload;
  } catch {
    return null;
  }
}

export function clearAuthCookies(response: NextResponse, keep?: AuthCookieName) {
  for (const name of authCookieNames) {
    if (name === keep) continue;

    response.cookies.set(name, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0
    });
  }
}

function bearerToken(request?: Request) {
  const header = request?.headers.get("authorization");
  const [scheme, token] = header?.split(" ") ?? [];
  return scheme?.toLowerCase() === "bearer" ? token : undefined;
}

function roleMatchesCookie(name: AuthCookieName, session: AuthPayload) {
  return (
    (name === "adyapan_token" && (session.role === "student" || session.role === "admin")) ||
    (name === "adyapan_principal_token" && session.role === "principal") ||
    (name === "adyapan_teacher_token" && session.role === "teacher")
  );
}

export async function activeCookieSessions() {
  const cookieStore = await cookies();

  return authCookieNames
    .map((name) => {
      const session = verifyToken(cookieStore.get(name)?.value);
      return session && roleMatchesCookie(name, session) ? { cookie: name, session } : null;
    })
    .filter((item): item is { cookie: AuthCookieName; session: AuthPayload } => Boolean(item));
}

export function hasDifferentActiveSession(
  sessions: Array<{ session: AuthPayload }>,
  expected: Pick<AuthPayload, "email" | "role">
) {
  return sessions.some(({ session }) => session.email !== expected.email || session.role !== expected.role);
}

export async function currentUser(request?: Request) {
  const authUser = verifyToken(bearerToken(request));

  if (authUser && (authUser.role === "student" || authUser.role === "admin")) {
    return authUser;
  }

  const cookieStore = await cookies();
  const user = verifyToken(cookieStore.get("adyapan_token")?.value);
  return user?.role === "student" || user?.role === "admin" ? user : null;
}

export async function currentPrincipal(request?: Request) {
  const authUser = verifyToken(bearerToken(request));

  if (authUser?.role === "principal") {
    return authUser;
  }

  const cookieStore = await cookies();
  const principal = verifyToken(cookieStore.get("adyapan_principal_token")?.value);
  return principal?.role === "principal" ? principal : null;
}

export async function currentTeacher(request?: Request) {
  const authUser = verifyToken(bearerToken(request));

  if (authUser?.role === "teacher") {
    return authUser;
  }

  const cookieStore = await cookies();
  const teacher = verifyToken(cookieStore.get("adyapan_teacher_token")?.value);
  return teacher?.role === "teacher" ? teacher : null;
}

export function strongPassword(password: string) {
  return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
}
