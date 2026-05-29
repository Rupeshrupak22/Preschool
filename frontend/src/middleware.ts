import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const AUTH_COOKIE_NAMES = ["adyapan_token", "adyapan_principal_token", "adyapan_teacher_token"] as const;

// Login pages that should be blocked when already logged in
const LOGIN_PATHS = ["/login", "/principal/login", "/teacher/login"];

// Dashboard paths mapped by role
const DASHBOARD_BY_ROLE: Record<string, string> = {
  student: "/student-dashboard",
  admin: "/admin",
  principal: "/principal/dashboard",
  teacher: "/teacher/dashboard",
};

// Protected dashboard paths and which role can access them
const PROTECTED_PATHS: { prefix: string; allowedRoles: string[] }[] = [
  { prefix: "/student-dashboard", allowedRoles: ["student"] },
  { prefix: "/admin", allowedRoles: ["admin"] },
  { prefix: "/principal/dashboard", allowedRoles: ["principal"] },
  { prefix: "/teacher/dashboard", allowedRoles: ["teacher"] },
];

function getJwtSecret() {
  const secret = process.env.JWT_SECRET || "local-dev-secret-change-in-production";
  return new TextEncoder().encode(secret);
}

type TokenPayload = {
  id: string;
  email: string;
  role: "student" | "admin" | "principal" | "teacher";
  name: string;
};

async function verifyTokenEdge(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

async function getActiveSession(request: NextRequest): Promise<TokenPayload | null> {
  for (const cookieName of AUTH_COOKIE_NAMES) {
    const cookie = request.cookies.get(cookieName);
    if (cookie?.value) {
      const payload = await verifyTokenEdge(cookie.value);
      if (payload) return payload;
    }
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getActiveSession(request);

  // Block login/signup pages if already logged in
  if (LOGIN_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    if (session) {
      const dashboard = DASHBOARD_BY_ROLE[session.role] || "/";
      const url = request.nextUrl.clone();
      url.pathname = dashboard;
      url.searchParams.set("notice", "already_logged_in");
      return NextResponse.redirect(url);
    }
  }

  // Protect dashboard routes - only the correct role can access
  for (const { prefix, allowedRoles } of PROTECTED_PATHS) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) {
      if (!session) {
        // Not logged in at all - redirect to appropriate login
        const url = request.nextUrl.clone();
        if (prefix.startsWith("/principal")) {
          url.pathname = "/principal/login";
        } else if (prefix.startsWith("/teacher")) {
          url.pathname = "/teacher/login";
        } else {
          url.pathname = "/login";
          url.searchParams.set("next", pathname);
        }
        return NextResponse.redirect(url);
      }

      if (!allowedRoles.includes(session.role)) {
        // Logged in but wrong role - redirect to their own dashboard
        const dashboard = DASHBOARD_BY_ROLE[session.role] || "/";
        const url = request.nextUrl.clone();
        url.pathname = dashboard;
        url.searchParams.set("notice", "wrong_role");
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/principal/login",
    "/teacher/login",
    "/student-dashboard/:path*",
    "/admin/:path*",
    "/principal/dashboard/:path*",
    "/teacher/dashboard/:path*",
  ],
};
