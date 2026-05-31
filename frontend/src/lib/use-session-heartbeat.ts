"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Session heartbeat with INACTIVITY-BASED auto-logout.
 *
 * How it works:
 * - Tracks user activity (mouse, keyboard, clicks, scroll, touch)
 * - If the user is ACTIVE → heartbeat pings the backend every 60s to keep session alive
 * - If the user is INACTIVE for 15 minutes → stops pinging, forces logout
 *
 * The backend session also expires after 15 min of no API calls (sliding window),
 * so both frontend and backend are in sync.
 *
 * Works for all roles: student, teacher, principal, admin.
 */

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const HEARTBEAT_INTERVAL_MS = 60_000; // Ping backend every 60s (only when active)
const ACTIVITY_THROTTLE_MS = 30_000; // Only update "last active" timestamp every 30s to avoid excessive writes

type Options = {
  /** API endpoint to check session validity */
  checkUrl?: string;
  /** Where to redirect on session loss */
  loginUrl?: string;
  /** Only run heartbeat when true (default: true). Set to false on login pages. */
  enabled?: boolean;
  /** Callback before redirect (e.g. clear local state) */
  onSessionLost?: () => void;
};

export function useSessionHeartbeat(options: Options = {}) {
  const {
    checkUrl = "/api/auth/me",
    loginUrl = "/login",
    enabled = true,
    onSessionLost,
  } = options;

  const lastActivityRef = useRef<number>(Date.now());
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const redirectingRef = useRef(false);
  const throttleRef = useRef<number>(0);

  // ─── Force logout ──────────────────────────────────────────────────────────
  const forceLogout = useCallback(() => {
    if (redirectingRef.current) return;
    redirectingRef.current = true;
    if (onSessionLost) onSessionLost();
    window.location.href = loginUrl;
  }, [loginUrl, onSessionLost]);

  // ─── Check session with backend ───────────────────────────────────────────
  const checkSession = useCallback(async () => {
    if (redirectingRef.current) return;

    try {
      const res = await fetch(checkUrl, { cache: "no-store" });
      if (redirectingRef.current) return;

      if (res.status === 401) {
        // Session is gone on backend — force logout
        forceLogout();
      }
    } catch {
      // Network error — don't logout, just skip this check
    }
  }, [checkUrl, forceLogout]);

  // ─── Reset inactivity timer ────────────────────────────────────────────────
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(() => {
      // User has been inactive for 15 minutes — force logout
      forceLogout();
    }, INACTIVITY_TIMEOUT_MS);
  }, [forceLogout]);

  // ─── Handle user activity ──────────────────────────────────────────────────
  const handleActivity = useCallback(() => {
    const now = Date.now();

    // Throttle: only process activity events every 30 seconds
    if (now - throttleRef.current < ACTIVITY_THROTTLE_MS) return;
    throttleRef.current = now;

    lastActivityRef.current = now;
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  useEffect(() => {
    if (!enabled) {
      // Clean up everything if disabled
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
      return;
    }

    let active = true;
    redirectingRef.current = false;
    lastActivityRef.current = Date.now();
    throttleRef.current = 0;

    // ─── Activity listeners ────────────────────────────────────────────────
    const activityEvents = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "touchmove",
      "click",
      "wheel",
    ];

    for (const event of activityEvents) {
      document.addEventListener(event, handleActivity, { passive: true });
    }

    // ─── Start inactivity timer ────────────────────────────────────────────
    resetInactivityTimer();

    // ─── Heartbeat: only ping backend if user was recently active ───────────
    async function heartbeat() {
      if (!active || redirectingRef.current) return;

      const timeSinceActivity = Date.now() - lastActivityRef.current;

      // Only ping if user was active within the last 14 minutes
      // (gives 1 minute buffer before the 15-min backend timeout)
      if (timeSinceActivity < INACTIVITY_TIMEOUT_MS - 60_000) {
        await checkSession();
      }
    }

    // Check immediately on mount
    checkSession();

    // Start periodic heartbeat
    heartbeatRef.current = setInterval(heartbeat, HEARTBEAT_INTERVAL_MS);

    // ─── Visibility change: check session when tab becomes visible ─────────
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        const timeSinceActivity = Date.now() - lastActivityRef.current;

        if (timeSinceActivity >= INACTIVITY_TIMEOUT_MS) {
          // User was away for 15+ minutes — force logout
          forceLogout();
        } else {
          // Tab is back — mark as active and check session
          lastActivityRef.current = Date.now();
          resetInactivityTimer();
          checkSession();
        }
      }
    }

    function handleFocus() {
      const timeSinceActivity = Date.now() - lastActivityRef.current;

      if (timeSinceActivity >= INACTIVITY_TIMEOUT_MS) {
        forceLogout();
      } else {
        lastActivityRef.current = Date.now();
        resetInactivityTimer();
        checkSession();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    // ─── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      active = false;

      for (const event of activityEvents) {
        document.removeEventListener(event, handleActivity);
      }

      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);

      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [checkUrl, loginUrl, enabled, onSessionLost, handleActivity, resetInactivityTimer, checkSession, forceLogout]);
}
