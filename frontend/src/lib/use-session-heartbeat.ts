"use client";

import { useEffect, useRef } from "react";

/**
 * Session heartbeat — periodically checks if the session is still valid.
 * If the session was cleared (e.g. from another device or another browser),
 * forces logout immediately.
 *
 * Works across:
 * - Different devices (Device A vs Device B)
 * - Same device, different browsers (Chrome vs Brave)
 * - Same browser, different tabs (handled by BroadcastChannel separately)
 *
 * The heartbeat runs every 10 seconds and also fires immediately on:
 * - Component mount (catches stale sessions on page load)
 * - Tab becoming visible (user switches back to this tab)
 */

const HEARTBEAT_INTERVAL_MS = 10_000; // Check every 10 seconds

type Options = {
  /** API endpoint to check session validity */
  checkUrl?: string;
  /** Where to redirect on session loss */
  loginUrl?: string;
  /** Callback before redirect (e.g. clear local state) */
  onSessionLost?: () => void;
};

export function useSessionHeartbeat(options: Options = {}) {
  const {
    checkUrl = "/api/auth/me",
    loginUrl = "/login",
    onSessionLost,
  } = options;

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const redirectingRef = useRef(false);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      if (redirectingRef.current) return;

      try {
        const res = await fetch(checkUrl, { cache: "no-store" });

        if (!active || redirectingRef.current) return;

        if (res.status === 401) {
          // Session is gone — force logout immediately
          redirectingRef.current = true;
          if (onSessionLost) onSessionLost();
          window.location.href = loginUrl;
        }
      } catch {
        // Network error — don't logout, just skip this check
      }
    }

    // Check immediately on mount — catches stale sessions right away
    checkSession();

    // Start periodic heartbeat
    intervalRef.current = setInterval(checkSession, HEARTBEAT_INTERVAL_MS);

    // Also check immediately when tab becomes visible (user switches back)
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        checkSession();
      }
    }

    // Also check when window regains focus (covers alt-tab scenarios)
    function handleFocus() {
      checkSession();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      active = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [checkUrl, loginUrl, onSessionLost]);
}
