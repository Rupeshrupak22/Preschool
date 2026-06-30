"use client";

import { useEffect, useState } from "react";
import { createEmptyDashboardData, type DashboardData } from "@/lib/dashboard/dashboard-data";

// In-memory cache — persists across page navigations within the same session
let cachedData: DashboardData | null = null;
let fetchPromise: Promise<void> | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // Refresh every 5 minutes max

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>(() => cachedData || createEmptyDashboardData());

  useEffect(() => {
    let active = true;

    // If cached data is fresh, use it immediately
    if (cachedData && Date.now() - lastFetchTime < CACHE_TTL_MS) {
      setData(cachedData);
      return;
    }

    // If already fetching, wait for it
    if (fetchPromise) {
      fetchPromise.then(() => {
        if (active && cachedData) setData(cachedData);
      });
      return;
    }

    // Fetch fresh data
    fetchPromise = fetch("/api/student-dashboard", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => {
        if (payload.dashboard) {
          cachedData = payload.dashboard;
          lastFetchTime = Date.now();
          if (active) setData(payload.dashboard);
        }
      })
      .catch(() => undefined)
      .finally(() => { fetchPromise = null; });

    return () => {
      active = false;
    };
  }, []);

  return data;
}

/** Force refresh dashboard data (call after submitting homework, etc.) */
export function invalidateDashboardCache() {
  cachedData = null;
  lastFetchTime = 0;
}
