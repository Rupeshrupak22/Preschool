"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Github, MailCheck, Rocket } from "lucide-react";

function Field(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-saffron-900 outline-none transition placeholder:text-saffron-900/40 focus:border-saffron-400 focus:ring-4 focus:ring-saffron-500/15"
    />
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");

  async function sendOtp() {
    if (!email) {
      setStatus("Enter email before OTP verification.");
      return;
    }
    const response = await fetch("/api/auth/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const data = await response.json();
    setStatus(response.ok ? `OTP sent${data.devOtp ? `: ${data.devOtp}` : "."}` : data.error);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Creating account...");
    const body = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-ink bg-radial-grid px-4 py-10 text-saffron-900">
      <a href="/" className="fixed left-5 top-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-saffron-500 font-black shadow-glow">A</span>
        <span className="font-bold">ADYAPAN</span>
      </a>
      <form onSubmit={onSubmit} className="glass w-full max-w-2xl rounded-2xl p-6">
        <div className="mb-7 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-saffron-500/15 text-saffron-700">
            <Rocket className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-3xl font-semibold">Start your future skills journey</h1>
          <p className="mt-2 text-sm text-saffron-900/58">Create your student profile, verify OTP, and unlock the dashboard.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Field name="name" placeholder="Student name" required />
          <Field name="phone" placeholder="Phone" required />
          <Field name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" required />
          <select
            name="classLevel"
            required
            className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-saffron-900 outline-none transition focus:border-saffron-400 focus:ring-4 focus:ring-saffron-500/15"
          >
            <option value="">Class</option>
            {Array.from({ length: 8 }).map((_, index) => (
              <option key={index + 5} value={`Class ${index + 5}`}>
                Class {index + 5}
              </option>
            ))}
          </select>
          <div className="relative md:col-span-2">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password with uppercase and number"
              className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 pr-12 text-sm text-saffron-900 outline-none transition placeholder:text-saffron-900/40 focus:border-saffron-400 focus:ring-4 focus:ring-saffron-500/15"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-3 rounded-md p-1 text-saffron-900/50 hover:text-saffron-700"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <div className="flex gap-3 md:col-span-2">
            <Field name="otp" placeholder="OTP code" />
            <button type="button" onClick={sendOtp} className="inline-flex h-12 min-w-32 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 font-semibold hover:bg-blue-50">
              <MailCheck className="h-4 w-4" /> OTP
            </button>
          </div>
          <Field name="captcha" placeholder="CAPTCHA: type ADYAPAN" required />
          <input name="interest" placeholder="Interest: AI, coding, robotics..." className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-saffron-900 outline-none transition placeholder:text-saffron-900/40 focus:border-saffron-400 focus:ring-4 focus:ring-saffron-500/15" />
        </div>
        <button className="mt-5 h-12 w-full rounded-lg bg-saffron-500 font-semibold shadow-glow transition hover:bg-saffron-400">
          Create Account
        </button>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setStatus("Google OAuth provider ready for production keys.")} className="h-11 rounded-lg border border-slate-200 bg-white text-sm font-semibold hover:bg-blue-50">
            Google
          </button>
          <button type="button" onClick={() => setStatus("GitHub OAuth provider ready for production keys.")} className="flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold hover:bg-blue-50">
            <Github className="h-4 w-4" /> GitHub
          </button>
        </div>
        <p className="mt-5 text-center text-sm text-saffron-900/56">
          Already have an account? <a href="/login" className="font-semibold text-saffron-700">Login</a>
        </p>
        {status && <p className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-sm text-saffron-900/70">{status}</p>}
      </form>
    </main>
  );
}




