"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Eye, EyeOff, IdCard, KeyRound, Lock, Mail } from "lucide-react";

export default function TeacherLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"error" | "info" | "warning">("info");
  const [loading, setLoading] = useState(false);
  const [showClearSession, setShowClearSession] = useState(false);
  const [pendingCredentials, setPendingCredentials] = useState<Record<string, string> | null>(null);
  const [clearingSession, setClearingSession] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("Verifying teacher access...");
    setStatusType("info");

    try {
      const body = Object.fromEntries(new FormData(event.currentTarget).entries()) as Record<string, string>;
      const response = await fetch("/api/teacher/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await response.json().catch(() => ({}));

      if (response.status === 409 && data.code === "ACTIVE_SESSION_EXISTS") {
        setPendingCredentials(body);
        setShowClearSession(true);
        setStatus("A session for this teacher account is already active on another device.");
        setStatusType("warning");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        setStatus(data.error ?? "Teacher login failed.");
        setStatusType("error");
        setLoading(false);
        return;
      }

      window.dispatchEvent(new Event("adyapan-auth-change"));
      setStatus("Access granted. Opening teacher dashboard...");
      setStatusType("info");
      window.location.href = "/teacher/dashboard";
    } catch {
      setStatus("Network issue. Please try again.");
      setStatusType("error");
      setLoading(false);
    }
  }

  async function handleClearSessions() {
    if (!pendingCredentials) return;
    setClearingSession(true);
    setStatus("Clearing previous sessions...");
    setStatusType("info");

    try {
      const response = await fetch("/api/teacher/clear-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pendingCredentials)
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus(data.error ?? "Failed to clear sessions. Please try again.");
        setStatusType("error");
        setClearingSession(false);
        return;
      }

      setShowClearSession(false);
      setStatus("Previous sessions cleared. Logging you in...");
      setStatusType("info");

      const loginResponse = await fetch("/api/teacher/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pendingCredentials)
      });
      const loginData = await loginResponse.json().catch(() => ({}));

      if (!loginResponse.ok) {
        setStatus(loginData.error ?? "Login failed after clearing sessions. Please try again.");
        setStatusType("error");
        setClearingSession(false);
        setPendingCredentials(null);
        return;
      }

      window.dispatchEvent(new Event("adyapan-auth-change"));
      window.location.href = "/teacher/dashboard";
    } catch {
      setStatus("Network issue. Please try again.");
      setStatusType("error");
      setClearingSession(false);
    }
  }

  return (
    <main className="relative flex h-screen w-full overflow-hidden">
      {/* Full-screen background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      >
        <source src="/newlogin-vid_qPNCEcV9.mp4" type="video/mp4" />
      </video>
      {/* Watermark cover — gradient at bottom */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-40 w-full bg-gradient-to-t from-black via-black/90 to-transparent" />

      {/* Left half — Adyapan branding (hidden on mobile) */}
      <div className="relative z-10 hidden w-1/2 flex-col items-center justify-center lg:flex pointer-events-none">
        <img
          src="/ady-logo.png"
          alt="Adyapan"
          className="h-36 w-36 rounded-full object-cover shadow-2xl"
        />
        <h2 className="mt-6 text-5xl font-black text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          Adyapan{" "}
          <span className="text-sky-400 drop-shadow-[0_2px_8px_rgba(56,189,248,0.6)]">School</span>
        </h2>
      </div>

      {/* Right half — login card */}
      <div className="relative z-10 flex w-full items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* Active session conflict banner */}
          {showClearSession && (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-black text-amber-900">⚠️ Active Session Detected</p>
              <p className="mt-1 text-sm font-medium text-amber-800">
                This teacher account is already logged in on another device. Clear the previous session to continue.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleClearSessions}
                  disabled={clearingSession}
                  className="flex-1 rounded-lg bg-amber-600 px-3 py-2.5 text-xs font-black text-white transition hover:bg-amber-700 disabled:opacity-60"
                >
                  {clearingSession ? "Clearing..." : "Clear & Login"}
                </button>
                <button
                  onClick={() => { setShowClearSession(false); setPendingCredentials(null); setStatus(""); }}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-black text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Card */}
          <div className="rounded-2xl bg-white/95 px-7 py-7 shadow-[0_8px_40px_rgba(0,0,0,0.28)] backdrop-blur-md">
            {/* Header */}
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <IdCard className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900">Teacher Login</h1>
                <p className="text-xs text-slate-500">Sign in to access your teacher dashboard</p>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <input type="hidden" name="captcha" value="ADYAPAN" />

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">Teacher Email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="yourname@school.edu"
                    autoComplete="email"
                    className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    placeholder="Enter your password"
                    className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-11 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Staff Access Key */}
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">Staff Access Key</label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    name="staffKey"
                    type={showKey ? "text" : "password"}
                    required
                    minLength={8}
                    placeholder="Private staff key"
                    className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-11 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                    aria-label="Toggle staff key visibility"
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Status */}
              {status && !showClearSession && (
                <div className={`rounded-lg px-4 py-3 text-sm font-semibold ${
                  statusType === "error" ? "bg-red-50 text-red-700 border border-red-100" :
                  statusType === "warning" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                  "bg-blue-50 text-blue-700 border border-blue-100"
                }`}>
                  {status}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || showClearSession}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 text-sm font-black text-white shadow-lg shadow-emerald-300/40 transition hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Open Teacher Dashboard"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <p className="mt-4 text-center text-[11px] text-slate-500">
              Only pre-registered teacher accounts can login.<br />Contact your school admin for access.
            </p>
          </div>

          {/* Back link */}
          <p className="mt-4 text-center text-sm">
            <a href="/" className="font-semibold text-white drop-shadow transition hover:text-emerald-300">
              ← Back to Adyapan
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
