import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const fallbackSecret = "local-dev-secret-change-in-production";

export type AuthPayload = {
  id: string;
  email: string;
  role: "student" | "admin";
  name: string;
};

export function signToken(payload: AuthPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET ?? fallbackSecret, {
    expiresIn: "7d"
  });
}

export function verifyToken(token?: string): AuthPayload | null {
  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET ?? fallbackSecret) as AuthPayload;
  } catch {
    return null;
  }
}

export async function currentUser() {
  const cookieStore = await cookies();
  return verifyToken(cookieStore.get("adyapan_token")?.value);
}

export function strongPassword(password: string) {
  return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
}
