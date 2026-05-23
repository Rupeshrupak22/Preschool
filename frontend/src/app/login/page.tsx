"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Github, Lock, Mail, ShieldCheck } from "lucide-react";

function Field(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-12 w-full rounded-lg border border-white/12 bg-white/[0.06] px-4 text-sm text-saffron-900 outline-none transition placeholder:text-saffron-900/40 focus:border-saffron-400 focus:ring-4 focus:ring-saffron-500/15"
    />
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Checking credentials...");
    const body = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error);
      return;
    }

    router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-ink bg-radial-grid px-4 py-10 text-saffron-900">
      <a href="/" className="fixed left-5 top-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-saffron-500 font-black shadow-glow">A</span>
        <span className="font-bold">ADYAPAN</span>
      </a>
      <form onSubmit={onSubmit} className="glass w-full max-w-md rounded-2xl p-6">
        <div className="mb-7 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-saffron-500/15 text-saffron-700">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-3xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-sm text-saffron-900/58">Continue learning with your future skills dashboard.</p>
        </div>
        <div className="grid gap-3">
          <label className="grid gap-2 text-sm text-saffron-900/70">
            Email
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-saffron-900/34" />
              <input
                name="email"
                type="email"
                required
                placeholder="student@example.com"
                className="h-12 w-full rounded-lg border border-white/12 bg-white/[0.06] pl-11 pr-4 text-sm text-saffron-900 outline-none transition placeholder:text-saffron-900/40 focus:border-saffron-400 focus:ring-4 focus:ring-saffron-500/15"
              />
            </div>
          </label>
          <label className="grid gap-2 text-sm text-saffron-900/70">
            Password
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                className="h-12 w-full rounded-lg border border-white/12 bg-white/[0.06] px-4 pr-12 text-sm text-saffron-900 outline-none transition placeholder:text-saffron-900/40 focus:border-saffron-400 focus:ring-4 focus:ring-saffron-500/15"
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
          </label>
          <label className="grid gap-2 text-sm text-saffron-900/70">
            CAPTCHA
            <Field name="captcha" required placeholder="Type ADYAPAN" />
          </label>
          <button className="mt-2 h-12 rounded-lg bg-saffron-500 font-semibold shadow-glow transition hover:bg-saffron-400">
            Login
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setStatus("Google OAuth provider ready for production keys.")} className="h-11 rounded-lg border border-white/12 bg-white/8 text-sm font-semibold hover:bg-white/12">
              Google
            </button>
            <button type="button" onClick={() => setStatus("GitHub OAuth provider ready for production keys.")} className="flex h-11 items-center justify-center gap-2 rounded-lg border border-white/12 bg-white/8 text-sm font-semibold hover:bg-white/12">
              <Github className="h-4 w-4" /> GitHub
            </button>
          </div>
        </div>
        <p className="mt-5 text-center text-sm text-saffron-900/56">
          New to ADYAPAN? <a href="/signup" className="font-semibold text-saffron-700">Create account</a>
        </p>
        {status && (
          <p className="mt-4 rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3 text-center text-sm text-saffron-900/70">
            <ShieldCheck className="mr-2 inline h-4 w-4 text-saffron-600" />
            {status}
          </p>
        )}
      </form>
    </main>
  );
}



