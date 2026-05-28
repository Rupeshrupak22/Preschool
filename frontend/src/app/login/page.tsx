"use client";

import { FormEvent, useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Checking credentials...");
    const body = Object.fromEntries(new FormData(event.currentTarget).entries());
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      // Check if response has content before parsing JSON
      const text = await response.text();
      let data;
      
      try {
        data = text ? JSON.parse(text) : {};
      } catch (jsonError) {
        console.error("JSON parse error:", jsonError);
        setStatus("Server response error. Please try again.");
        return;
      }

      if (!response.ok) {
        setStatus(data.error || "Login failed. Please try again.");
        return;
      }

      // Success case
      window.dispatchEvent(new Event("adyapan-auth-change"));
      const searchParams = new URLSearchParams(window.location.search);
      const next = searchParams.get("next");
      const target = next && next.startsWith("/") ? next : data.user?.role === "admin" ? "/admin" : "/student-dashboard";
      const windowName = data.user?.role === "admin" ? "adyapan_admin_dashboard" : "adyapan_student_dashboard";
      const lmsWindow = window.open(target, windowName);

      if (lmsWindow) {
        lmsWindow.opener = null;
        lmsWindow.focus();
        setStatus("Dashboard opened in a new tab.");
        window.setTimeout(() => {
          window.location.replace("/");
        }, 300);
        return;
      }

      window.location.href = target;
    } catch (error) {
      console.error("Network error:", error);
      setStatus("Network error. Please check your connection and try again.");
      return;
    }

    window.dispatchEvent(new Event("adyapan-auth-change"));
    const searchParams = new URLSearchParams(window.location.search);
    const next = searchParams.get("next");
    const target = next && next.startsWith("/") ? next : data.user.role === "admin" ? "/admin" : "/student-dashboard";
    const windowName = data.user.role === "admin" ? "adyapan_admin_dashboard" : "adyapan_student_dashboard";
    const lmsWindow = window.open(target, windowName);

    if (lmsWindow) {
      lmsWindow.opener = null;
      lmsWindow.focus();
      setStatus("Dashboard opened in a new tab.");
      window.setTimeout(() => {
        window.location.replace("/");
      }, 300);
      return;
    }

    window.location.href = target;
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#fff8ec] px-4 py-10 text-slate-950 md:px-6">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_0%_12%,rgba(181,101,242,0.30),transparent_19%),radial-gradient(circle_at_100%_12%,rgba(255,125,101,0.28),transparent_18%),radial-gradient(circle_at_50%_100%,rgba(255,85,145,0.28),transparent_24%),radial-gradient(circle_at_96%_84%,rgba(255,216,77,0.32),transparent_16%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-45 [background-image:linear-gradient(rgba(15,23,42,0.035)_1px,transparent_1px)] [background-size:100%_34px]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-160px)] max-w-7xl items-center gap-10 xl:grid-cols-[0.86fr_1fr]">
        <section className="relative hidden min-h-[660px] xl:block">
          <div className="flex items-center gap-5">
            <img
              src="/adyapan-logo.svg"
              alt="ADYAPAN"
              className="h-32 w-32 rounded-full object-contain drop-shadow-[0_22px_28px_rgba(15,23,42,0.2)]"
            />
            <div>
              <p className="text-5xl font-black tracking-tight text-[#08133f]">Adyapan</p>
              <p className="mt-2 text-right text-lg font-black tracking-wide text-[#08133f]">SCHOOL</p>
            </div>
          </div>

          <div className="absolute left-[350px] top-16 rotate-[-18deg] text-7xl">🛩️</div>
          <div className="absolute left-[330px] top-36 h-20 w-44 rounded-full border-t-2 border-dashed border-[#08133f]" />
          <div className="absolute right-0 top-10 text-7xl">💡</div>
          <div className="absolute right-8 top-[245px] text-7xl">🌐</div>
          <div className="absolute left-4 top-[275px] text-5xl">✏️</div>
          <div className="absolute left-[72px] top-[195px] rotate-[-12deg] text-4xl">⭐</div>
          <div className="absolute right-20 top-[205px] rotate-[-10deg] rounded-full border-2 border-rose-400 px-4 py-3 text-4xl font-black text-rose-500">A+</div>
          <div className="absolute right-0 top-[345px] text-5xl">⚛️</div>
          <div className="absolute left-1/2 top-[210px] -translate-x-1/2 text-center">
            <p className="text-6xl font-black leading-none text-[#08133f]">Welcome</p>
            <p className="text-8xl font-black leading-none text-[#4057c9] drop-shadow-[3px_4px_0_rgba(8,19,63,0.16)]">
              Back
            </p>
            <p className="mx-auto mt-3 w-max rotate-[-6deg] bg-[#ff3d81] px-9 py-3 text-3xl font-black uppercase tracking-wide text-white shadow-[0_8px_0_rgba(15,23,42,0.12)]">
              To School
            </p>
          </div>

          <div className="absolute bottom-8 left-[72px] h-28 w-44 rounded-xl bg-[#233c89] shadow-[0_18px_28px_rgba(15,23,42,0.18)]">
            <div className="absolute -top-20 left-7 h-28 w-32 rounded-t-[48px] bg-[#1f2f76]" />
            <img
              src="/adyapan-logo.svg"
              alt="ADYAPAN"
              className="absolute -top-6 left-14 h-16 w-16 rounded-full object-contain drop-shadow-[0_8px_12px_rgba(15,23,42,0.18)]"
            />
            <div className="absolute -top-28 left-4 h-24 w-20 rotate-[-10deg] rounded-lg bg-[#f04e72]" />
            <div className="absolute -top-32 left-24 h-28 w-20 rotate-[10deg] rounded-lg bg-[#f7c948]" />
            <div className="absolute -top-24 right-1 h-24 w-14 rotate-[18deg] rounded-lg bg-[#6ac76a]" />
            <div className="absolute bottom-4 left-10 h-20 w-28 rounded-3xl bg-[#ffc02e] shadow-inner" />
          </div>
          <div className="absolute bottom-0 left-0 grid gap-2">
            <div className="h-7 w-44 rounded-lg bg-[#2b67d1]" />
            <div className="h-7 w-52 rounded-lg bg-[#ffce3f]" />
            <div className="h-7 w-40 rounded-lg bg-[#f05276]" />
          </div>
        </section>

        <section className="relative mx-auto w-full max-w-xl rounded-[34px] bg-white/92 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/70 backdrop-blur md:p-10">
          <form onSubmit={onSubmit}>
            <input type="hidden" name="captcha" value="ADYAPAN" />
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f1e7ff] to-[#ffd6df] text-[#3d45d9]">
                <Lock className="h-10 w-10" />
              </div>
              <h1 className="mt-7 text-4xl font-black text-[#08133f]">Welcome back</h1>
              <p className="mt-3 text-base font-medium text-slate-600">Continue learning with your future skills dashboard.</p>
            </div>

            <div className="mt-8 grid gap-6">
              <label className="grid gap-3 text-base font-medium text-slate-700">
                Email
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-4 h-6 w-6 text-slate-500" />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="student@example.com"
                    className="h-16 w-full rounded-xl border border-slate-200 bg-white pl-14 pr-4 text-lg font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50"
                  />
                </div>
              </label>

              <label className="grid gap-3 text-base font-medium text-slate-700">
                Password
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-4 h-6 w-6 text-slate-500" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Password"
                    className="h-16 w-full rounded-xl border border-slate-200 bg-white pl-14 pr-14 text-lg font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-4 text-slate-500 transition hover:text-slate-950"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                  </button>
                </div>
              </label>

              <button className="h-16 rounded-xl bg-gradient-to-r from-[#1e63ff] via-[#9b3bdc] to-[#ff2d72] text-xl font-black text-white shadow-[0_18px_32px_rgba(236,72,153,0.25)] transition hover:-translate-y-0.5">
                Login
              </button>

              <button
                type="button"
                onClick={() => setStatus("Google OAuth provider ready for production keys.")}
                className="flex h-16 items-center justify-center gap-4 rounded-xl border border-slate-200 bg-white text-xl font-black text-[#08133f] transition hover:bg-slate-50"
              >
                <span className="text-3xl font-black text-[#4285f4]">G</span>
                Google
              </button>
            </div>

            <p className="mt-8 text-center text-base font-medium text-slate-700">
              New to ADYAPAN? <a href="/signup" className="font-black text-blue-700">Create account</a>
            </p>
            {status && <p className="mt-5 rounded-xl bg-blue-50 px-4 py-3 text-center text-sm font-bold text-blue-900">{status}</p>}
          </form>
        </section>
      </div>
    </main>
  );
}
