"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Eye, EyeOff, KeyRound, Lock, Mail, School, ShieldCheck } from "lucide-react";

export default function PrincipalLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("Verifying principal access...");
    const dashboardWindow = window.open("about:blank", "_blank");

    try {
      const body = Object.fromEntries(new FormData(event.currentTarget).entries());
      const response = await fetch("/api/principal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        dashboardWindow?.close();
        setStatus(data.error ?? "Principal login failed.");
        return;
      }

      window.dispatchEvent(new Event("adyapan-auth-change"));
      if (dashboardWindow) {
        dashboardWindow.location.href = "/principal/dashboard";
        dashboardWindow.opener = null;
        dashboardWindow.focus();
        setStatus("Dashboard opened in a new tab.");
        window.setTimeout(() => {
          window.location.replace("/");
        }, 300);
        return;
      }

      setStatus("Access granted. Opening dashboard...");
      window.location.href = "/principal/dashboard";
    } catch {
      dashboardWindow?.close();
      setStatus("Network issue. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f9fb] px-4 py-8 text-slate-950 md:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-lg border border-cyan-200 bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.16em] text-cyan-700 shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              Secure School Access
            </div>
            <h1 className="mt-6 text-5xl font-black leading-tight tracking-tight text-slate-950">
              Principal Management System
            </h1>
            <p className="mt-5 text-lg font-medium leading-8 text-slate-700">
              A private dashboard for each partner school principal with school-wise students, leads, login activity, and payment signals.
            </p>
            <div className="mt-8 grid gap-4">
              {[
                ["Separate school login", "Every principal uses their own email, password, and school key."],
                ["JWT protected session", "Access is stored in an httpOnly cookie and expires automatically."],
                ["School-wise dashboard", "Data is filtered by the principal's assigned school."]
              ].map(([title, text]) => (
                <div key={title} className="flex gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
                    <School className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-base font-black text-slate-950">{title}</span>
                    <span className="mt-1 block text-sm font-medium leading-6 text-slate-600">{text}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.10)] md:p-8">
          <form onSubmit={onSubmit}>
            <input type="hidden" name="captcha" value="ADYAPAN" />
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-950">Principal Login</h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                  Use your principal ID, password, and school key.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-5">
              <label className="grid gap-2 text-sm font-black text-slate-700">
                Principal Email
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-slate-500" />
                  <input
                    name="email"
                    type="email"
                    required
                    defaultValue="rupeshrupak609@gmail.com"
                    className="h-14 w-full rounded-lg border border-slate-200 bg-white pl-12 pr-4 text-base font-semibold text-slate-950 outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
                  />
                </div>
              </label>

              <label className="grid gap-2 text-sm font-black text-slate-700">
                Password
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-slate-500" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    placeholder="Principal password"
                    className="h-14 w-full rounded-lg border border-slate-200 bg-white pl-12 pr-12 text-base font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-4 text-slate-500 transition hover:text-slate-950"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </label>

              <label className="grid gap-2 text-sm font-black text-slate-700">
                School Access Key
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-slate-500" />
                  <input
                    name="schoolKey"
                    type={showKey ? "text" : "password"}
                    required
                    minLength={8}
                    placeholder="Private school key"
                    className="h-14 w-full rounded-lg border border-slate-200 bg-white pl-12 pr-12 text-base font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey((value) => !value)}
                    className="absolute right-4 top-4 text-slate-500 transition hover:text-slate-950"
                    aria-label="Toggle school key visibility"
                  >
                    {showKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </label>

              <button
                disabled={loading}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-cyan-700 px-5 text-base font-black text-white shadow-[0_16px_34px_rgba(8,145,178,0.24)] transition hover:-translate-y-0.5 hover:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Checking..." : "Open Dashboard"}
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            {status && (
              <p className="mt-5 rounded-lg bg-slate-100 px-4 py-3 text-center text-sm font-black text-slate-800">
                {status}
              </p>
            )}
          </form>
        </section>
      </div>
    </main>
  );
}
