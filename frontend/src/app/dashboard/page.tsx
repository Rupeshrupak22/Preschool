"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  Bell,
  Bot,
  CalendarDays,
  CheckCircle2,
  Code2,
  FileText,
  Flame,
  LayoutDashboard,
  Play,
  Trophy,
  User,
  Users
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const progress = [
  { week: "W1", score: 38 },
  { week: "W2", score: 52 },
  { week: "W3", score: 67 },
  { week: "W4", score: 78 },
  { week: "W5", score: 86 }
];

const courses = [
  ["AI Builder", 78],
  ["Python Pro", 62],
  ["Robotics Starter", 44]
] as const;

const nav = [
  ["Overview", LayoutDashboard],
  ["Courses", Code2],
  ["Certificates", Award],
  ["Assignments", FileText],
  ["Attendance", CheckCircle2],
  ["Community", Users],
  ["Profile", User]
] as const;

export default function DashboardPage() {
  const router = useRouter();
  const [assistant, setAssistant] = useState("Ask ADYAPAN AI for a career or project recommendation.");
  const [active, setActive] = useState("Overview");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/auth/me").then((response) => {
      if (!response.ok) router.replace("/login");
    });
  }, []);

  async function askAssistant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/ai-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: form.get("message") })
    });
    const data = await response.json();
    setAssistant(`${data.answer} Next: ${data.nextSteps.join(", ")}.`);
  }

  return (
    <main className="min-h-screen bg-ink text-saffron-900">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-white/10 bg-panel/80 p-4 backdrop-blur-xl lg:border-b-0 lg:border-r">
          <a href="/" className="mb-8 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-saffron-500 font-black shadow-glow">A</span>
            <span className="font-bold">ADYAPAN</span>
          </a>
          <div className="grid gap-2">
            {nav.map(([item, Icon]) => (
              <button
                key={item}
                onClick={() => setActive(item)}
                className={`flex h-11 items-center gap-3 rounded-lg px-3 text-left text-sm transition ${
                  active === item ? "bg-saffron-500 text-white shadow-glow" : "text-saffron-900/62 hover:bg-white/8 hover:text-saffron-700"
                }`}
              >
                <Icon className="h-4 w-4" /> {item}
              </button>
            ))}
          </div>
        </aside>

        <section className="p-4 md:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-saffron-700">Student dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold md:text-5xl">Welcome back, future builder</h1>
            </div>
            <div className="flex gap-3">
              <button className="relative rounded-lg border border-white/12 bg-white/8 p-3 hover:bg-white/12" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-saffron-400" />
              </button>
              <a href="/certificate/verify/demo" className="rounded-lg bg-saffron-500 px-4 py-3 text-sm font-semibold shadow-glow">
                Verify Certificate
              </a>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              ["Courses", "3 active", Code2],
              ["Certificates", "2 earned", Award],
              ["Streak", "14 days", Flame],
              ["Leaderboard", "#12", Trophy]
            ].map(([label, value, Icon]) => (
              <div key={String(label)} className="glass rounded-2xl p-5">
                <Icon className="h-7 w-7 text-saffron-600" />
                <p className="mt-4 text-sm text-saffron-900/56">{String(label)}</p>
                <p className="mt-1 text-2xl font-semibold">{String(value)}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Progress analytics</h2>
                <span className="rounded-full bg-saffron-500/15 px-3 py-1 text-sm text-saffron-700">Smart tracking</span>
              </div>
              <div className="mt-5 h-72">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={progress}>
                      <defs>
                        <linearGradient id="progress" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#ff7a00" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#ff7a00" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
                      <XAxis dataKey="week" stroke="rgba(255,255,255,.5)" />
                      <YAxis stroke="rgba(255,255,255,.5)" />
                      <Tooltip contentStyle={{ background: "#ff8a00", border: "1px solid rgba(255,255,255,.55)", borderRadius: 8 }} />
                      <Area type="monotone" dataKey="score" stroke="#ff7a00" fill="url(#progress)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="glass rounded-2xl p-5">
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <Bot className="h-5 w-5 text-saffron-600" /> AI assistant
              </h2>
              <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.05] p-4 text-sm leading-6 text-saffron-900/68">{assistant}</p>
              <form onSubmit={askAssistant} className="mt-4 grid gap-3">
                <input
                  name="message"
                  placeholder="I am in Class 9 and like robotics"
                  className="h-12 rounded-lg border border-white/12 bg-white/[0.06] px-4 text-sm outline-none focus:border-saffron-400"
                />
                <button className="h-11 rounded-lg bg-saffron-500 font-semibold shadow-glow">Ask AI</button>
              </form>
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            <div className="glass rounded-2xl p-5 xl:col-span-2">
              <h2 className="text-xl font-semibold">Continue learning</h2>
              <div className="mt-5 grid gap-4">
                {courses.map(([course, value]) => (
                  <div key={course} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold">{course}</p>
                        <p className="mt-1 text-sm text-saffron-900/52">Next live class and project review unlocked</p>
                      </div>
                      <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-saffron-500" aria-label={`Continue ${course}`}>
                        <Play className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-white/10">
                      <div className="h-2 rounded-full bg-saffron-400" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass rounded-2xl p-5">
              <h2 className="text-xl font-semibold">Upcoming classes</h2>
              <div className="mt-5 grid gap-3">
                {["AI Projects - Today 6 PM", "Python Quiz - Tomorrow", "Robotics Lab - Saturday"].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm text-saffron-900/70">
                    <CalendarDays className="h-4 w-4 text-saffron-600" /> {item}
                  </div>
                ))}
              </div>
              <h2 className="mt-6 text-xl font-semibold">Assignments</h2>
              <div className="mt-4 grid gap-3">
                {["Submit AI chatbot", "Record speaking pitch", "Upload portfolio link"].map((item) => (
                  <div key={item} className="rounded-lg bg-white/[0.04] p-3 text-sm text-saffron-900/68">{item}</div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}


