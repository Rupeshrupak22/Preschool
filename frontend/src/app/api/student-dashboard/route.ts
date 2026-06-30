import { NextResponse } from "next/server";
import { getStudentDashboardData } from "@/lib/db";
import { currentUser } from "@/lib/security";

// Server-side in-memory cache per user (survives within same Vercel function instance)
const dashboardCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 3 * 60 * 1000; // 3 minutes

export async function GET(request: Request) {
  const user = await currentUser(request);
  const email = user?.email || "";

  // Check cache
  const cached = dashboardCache.get(email);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  const dashboard = await getStudentDashboardData(email || undefined);

  // Store in cache
  if (email) {
    dashboardCache.set(email, { data: dashboard, timestamp: Date.now() });
    // Limit cache size to prevent memory leak
    if (dashboardCache.size > 200) {
      const oldest = [...dashboardCache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp)[0];
      if (oldest) dashboardCache.delete(oldest[0]);
    }
  }

  return NextResponse.json(dashboard);
}
