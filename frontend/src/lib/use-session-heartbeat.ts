"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Session heartbeat with INACTIVITY-BASED auto-logout.
 *
 * How it works:
 * - Tracks user activity (mouse, touch, pen, keyboard, scroll, click, input).
 * - Listens on `window` in the CAPTURE phase so events are caught even when
 *   a downstream component (modal, dropdown, animation library, etc.) calls
 *   event.stopPropagation() — this was the primary cause of false logouts.
 * - Includes `pointermove` so touchscreens and pen input are detected too,
 *   and `input` / `keypress` so typing via IME, paste, and autofill counts.
 * - The local inactivity timer is reset on EVERY activity event (cheap), so an
 *   active user can never be logged out — even if it fires thousands of times
 *   per minute. The "last activity" stamp used to gate backend heartbeats is
 *   throttled separately (5s) to avoid excessive ref writes.
 * - If the user is truly INACTIVE for 15 minutes → stops pinging, force logout.
 *
 * The backend session also expires after 15 min of no API calls (sliding window),
 * so frontend and backend stay in sync.
 *
 * Works for all roles: student, teacher, principal, admin.
 */

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const HEARTBEAT_INTERVAL_MS = 60_000; // Ping backend every 60s (only when active)
const ACTIVITY_THROTTLE_MS = 5_000; // Throttle "last activity" stamp to every 5s

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
    // ALWAYS reset the inactivity timer on every activity event.
    // clearTimeout + setTimeout is cheap; this guarantees a working user
    // cannot be logged out, regardless of how many events fire.
    resetInactivityTimer();

    const now = Date.now();

    // Throttle only the "last activity" stamp that the heartbeat uses to
    // decide whether to ping the backend. Keeps ref writes negligible.
    if (now - throttleRef.current < ACTIVITY_THROTTLE_MS) return;
    throttleRef.current = now;
    lastActivityRef.current = now;
  }, [resetInactivityTimer]);

  useEffect(() => {
    if (!enabled) {
      // Defensive cleanup when disabled — prevent leaked timers between mounts
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
    // Listening on `window` in the capture phase guarantees we catch every
    // event regardless of whether a child component stops propagation.
    const activityEvents = [
      "mousemove",
      "pointermove", // mouse + touch + pen, all in one
      "mousedown",
      "keydown",
      "keypress",    // legacy browsers / IME composition
      "input",       // paste, autofill, contenteditable, IME
      "scroll",
      "touchstart",
      "touchmove",
      "click",
      "wheel",
    ];

    for (const event of activityEvents) {
      window.addEventListener(event, handleActivity, { capture: true, passive: true });
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
        // `capture: true` must match the addEventListener options, or the
        // listener will silently fail to be removed.
        window.removeEventListener(event, handleActivity, true);
      }

      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);

      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [checkUrl, loginUrl, enabled, onSessionLost, handleActivity, resetInactivityTimer, checkSession, forceLogout]);
}
