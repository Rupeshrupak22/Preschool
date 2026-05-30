"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, GraduationCap, Lock, Mail, RefreshCw } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // If someone comes to /login?next=/admin, redirect to /admin
  useEffect(() => {
    const next = searchParams.get("next");
    if (next === "/admin") {
      router.replace("/admin");
    }
  }, [searchParams, router]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");
    const body = Object.fromEntries(new FormData(event.currentTarget).entries());

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const text = await response.text();
      let data;

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        setStatus("Server response error. Please try again.");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        setStatus(data.error || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      window.dispatchEvent(new Event("adyapan-auth-change"));
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next");
      const target = next && next.startsWith("/") ? next : data.user?.role === "admin" ? "/admin" : "/student-dashboard";

      window.location.href = target;
    } catch {
      setStatus("Network error. Please check your connection.");
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 px-4 py-10">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0">
        <svg className="absolute left-0 top-0 h-full w-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1e3a5f" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
        {/* Decorative icons */}
        <div className="absolute left-[10%] top-[15%] text-5xl opacity-20">📚</div>
        <div className="absolute right-[12%] top-[20%] text-4xl opacity-20">⭐</div>
        <div className="absolute left-[8%] bottom-[20%] text-4xl opacity-20">🎓</div>
        <div className="absolute right-[15%] bottom-[15%] text-5xl opacity-20">💡</div>
        <div className="absolute left-[45%] top-[8%] text-3xl opacity-15">✏️</div>
        <div className="absolute right-[30%] bottom-[10%] text-3xl opacity-15">🌟</div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-xs font-black text-white shadow-lg">
            ady.
          </div>
          <span className="text-xl font-black text-slate-800">Adyapan</span>
        </div>

        {/* Login Card */}
        <div className="rounded-xl border-t-4 border-orange-400 bg-white p-8 shadow-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-100">
              <GraduationCap className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">Student Login</h1>
              <p className="text-sm text-slate-500">Welcome back! Login to your dashboard</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <input type="hidden" name="captcha" value="ADYAPAN" />

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  name="email"
                  type="email"
                  placeholder="student@example.com"
                  className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-12 text-sm font-medium text-slate-900 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error/Status */}
            {status && (
              <div className={`rounded-lg px-4 py-3 text-sm font-semibold ${status.includes("error") || status.includes("failed") || status.includes("Invalid") || status.includes("not registered") ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"}`}>
                {status}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-400 to-orange-500 text-sm font-black text-white shadow-lg shadow-orange-200 transition hover:from-orange-500 hover:to-orange-600 disabled:opacity-60"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <>Sign In to Dashboard →</>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-slate-400">
            Only pre-registered accounts can login. Contact your school admin for access.
          </p>
        </div>

        {/* Back link */}
        <p className="mt-4 text-center text-sm text-slate-500">
          <a href="/" className="font-semibold transition hover:text-orange-600">← Back to Adyapan</a>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <RefreshCw className="h-8 w-8 animate-spin text-orange-500" />
      </main>
    }>
      <LoginForm />
    </Suspense>
  );
}
