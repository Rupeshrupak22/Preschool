"use client";

import { FormEvent, useState } from "react";
import { Building2, Eye, EyeOff, GraduationCap, Lock, Mail, Phone, Rocket, User } from "lucide-react";

function Field({
  icon: Icon,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className={`relative ${className}`}>
      <Icon className="pointer-events-none absolute left-4 top-4 h-6 w-6 text-slate-500" />
      <input
        {...props}
        className="h-16 w-full rounded-xl border border-slate-200 bg-white pl-14 pr-4 text-base font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-200/50"
      />
    </div>
  );
}

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    if (form.get("password") !== form.get("confirmPassword")) {
      setStatus("Passwords do not match.");
      return;
    }

    try {
      setStatus("Creating account...");
      const body = Object.fromEntries(form.entries());
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        setStatus(data.error || "Account could not be created. Please try again.");
        return;
      }

      window.dispatchEvent(new Event("adyapan-auth-change"));
      window.location.href = data.user.role === "admin" ? "/admin" : "/student-dashboard";
    } catch {
      setStatus("Account could not be created. Please try again.");
      return;
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#fff8ec] px-4 py-10 text-slate-950 md:px-6">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,45,114,0.32),transparent_18%),radial-gradient(circle_at_100%_0%,rgba(255,125,101,0.25),transparent_18%),radial-gradient(circle_at_52%_100%,rgba(255,180,60,0.34),transparent_28%),radial-gradient(circle_at_0%_82%,rgba(181,101,242,0.25),transparent_18%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-45 [background-image:linear-gradient(rgba(15,23,42,0.035)_1px,transparent_1px)] [background-size:100%_34px]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-160px)] max-w-7xl items-center gap-10 xl:grid-cols-[0.86fr_1fr]">
        <section className="relative hidden min-h-[720px] xl:block">
          <div className="flex items-center gap-5">
            <img
              src="/adyapan-logo.svg"
              alt="ADYAPAN"
              className="h-24 w-24 rounded-full object-contain drop-shadow-[0_12px_20px_rgba(15,23,42,0.16)]"
            />
            <div>
              <p className="text-5xl font-black tracking-tight text-[#08133f]">Adyapan</p>
              <p className="mt-2 text-right text-lg font-black tracking-wide text-[#08133f]">SCHOOL</p>
            </div>
          </div>

          <div className="absolute left-[370px] top-16 rotate-[-18deg] text-7xl">🛩️</div>
          <div className="absolute left-[350px] top-36 h-20 w-48 rounded-full border-t-2 border-dashed border-[#6b56d7]" />
          <div className="absolute left-0 top-[175px] text-4xl">☁️</div>
          <div className="absolute right-8 top-[145px] text-4xl text-yellow-400">⭐</div>
          <div className="absolute left-[115px] top-[250px] text-center">
            <p className="text-6xl font-black leading-tight text-[#08133f]">Unfold your</p>
            <p className="text-6xl font-black leading-tight text-[#ff2d72]">potential.</p>
            <p className="mt-4 text-6xl font-black leading-tight text-[#08133f]">Create your</p>
            <p className="text-7xl font-black leading-tight text-[#ff2d72]">future!</p>
            <div className="mx-auto mt-4 h-2 w-56 rounded-full bg-[#ffc400]" />
          </div>

          <div className="absolute bottom-20 left-0">
            <div className="relative h-40 w-28">
              <div className="absolute bottom-0 left-8 h-28 w-12 rounded-full bg-gradient-to-b from-[#f43f5e] to-[#b91c1c]" />
              <div className="absolute bottom-24 left-6 h-20 w-16 rounded-t-full bg-gradient-to-b from-[#ff95a8] to-[#ef4444]" />
              <div className="absolute bottom-0 left-0 h-14 w-10 rounded-full bg-white/80" />
              <div className="absolute bottom-0 right-0 h-14 w-10 rounded-full bg-white/80" />
              <div className="absolute bottom-24 left-12 h-8 w-8 rounded-full bg-[#0ea5e9]" />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 grid gap-2">
            <div className="flex h-12 w-64 items-center rounded-lg bg-[#f4c430] px-5 text-xl font-black text-slate-900">LEARN</div>
            <div className="flex h-12 w-72 items-center rounded-lg bg-[#e74747] px-5 text-xl font-black text-white">GROW</div>
            <div className="flex h-12 w-60 items-center rounded-lg bg-[#2367d1] px-5 text-xl font-black text-white">SUCCEED</div>
          </div>

          <div className="absolute bottom-14 left-[275px] h-48 w-32 rotate-[-2deg] rounded-xl border-4 border-[#233c89] bg-[#fff7df] p-5 text-center shadow-[0_14px_24px_rgba(15,23,42,0.14)]">
            <p className="mt-4 text-xl font-black text-[#08133f]">Every step</p>
            <p className="mt-2 text-xl font-black text-[#08133f]">today,</p>
            <p className="mt-2 text-xl font-black text-[#ff2d72]">a success</p>
            <p className="mt-2 text-xl font-black text-[#08133f]">tomorrow.</p>
          </div>

          <div className="absolute bottom-3 right-8 text-7xl">⏰</div>
          <div className="absolute right-0 top-[70px] text-7xl">💡</div>
        </section>

        <section className="relative mx-auto w-full max-w-2xl rounded-[34px] bg-white/92 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/70 backdrop-blur md:p-10">
          <form onSubmit={onSubmit}>
            <input type="hidden" name="captcha" value="ADYAPAN" />
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ffd84d] to-[#ff5b55] text-[#08133f]">
                <Rocket className="h-10 w-10" />
              </div>
              <h1 className="mt-7 text-3xl font-black text-[#08133f] md:text-4xl">Start your future skills journey</h1>
              <p className="mt-3 text-base font-medium text-slate-600">
                Create your student profile, verify OTP, and unlock the dashboard.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <Field icon={User} name="name" placeholder="Student name" required />
              <Field icon={Phone} name="phone" placeholder="Phone" required />
              <Field icon={Mail} name="email" type="email" placeholder="Email" required />
              <div className="relative">
                <GraduationCap className="pointer-events-none absolute left-4 top-4 h-6 w-6 text-slate-500" />
                <select
                  name="classLevel"
                  required
                  className="h-16 w-full rounded-xl border border-slate-200 bg-white pl-14 pr-10 text-base font-medium text-slate-950 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-200/50"
                >
                  <option value="">Class</option>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <option key={index + 5} value={`Class ${index + 5}`}>
                      Class {index + 5}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative md:col-span-2">
                <Lock className="pointer-events-none absolute left-4 top-4 h-6 w-6 text-slate-500" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password with uppercase and number"
                  className="h-16 w-full rounded-xl border border-slate-200 bg-white pl-14 pr-14 text-base font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-200/50"
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

              <div className="relative md:col-span-2">
                <Lock className="pointer-events-none absolute left-4 top-4 h-6 w-6 text-slate-500" />
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Confirm password"
                  className="h-16 w-full rounded-xl border border-slate-200 bg-white pl-14 pr-14 text-base font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-200/50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="absolute right-4 top-4 text-slate-500 transition hover:text-slate-950"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                </button>
              </div>

              <Field icon={Building2} name="schoolName" placeholder="School name" className="md:col-span-2" />
            </div>

            <button className="mt-6 flex h-16 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#ff2d72] via-[#ff7255] to-[#ffd23f] text-xl font-black text-white shadow-[0_18px_32px_rgba(244,63,94,0.24)] transition hover:-translate-y-0.5">
              Create Account <span className="text-3xl leading-none">→</span>
            </button>

            <button
              type="button"
              onClick={() => setStatus("Google OAuth provider ready for production keys.")}
              className="mt-5 flex h-16 w-full items-center justify-center gap-4 rounded-xl border border-slate-200 bg-white text-xl font-black text-[#08133f] transition hover:bg-slate-50"
            >
              <span className="text-3xl font-black text-[#4285f4]">G</span>
              Google
            </button>

            <p className="mt-8 text-center text-base font-medium text-slate-700">
              Already have an account? <a href="/login" className="font-black text-rose-600">Login</a>
            </p>
            {status && <p className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-center text-sm font-bold text-rose-900">{status}</p>}
          </form>
        </section>
      </div>
    </main>
  );
}
