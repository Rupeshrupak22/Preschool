"use client";

import { useEffect, useState } from "react";
import { dashboardData, type DashboardData } from "@/lib/dashboard/dashboard-data";

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>(dashboardData);

  useEffect(() => {
    let active = true;

    fetch("/api/student-dashboard", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => {
        if (active && payload.dashboard) setData(payload.dashboard);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  return data;
}
