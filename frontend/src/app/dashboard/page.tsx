"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Lock,
  MessageCircle,
  PlayCircle,
  Save,
  ShieldCheck,
  Star,
  Target,
  TrendingUp,
  UserPen
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type DashboardUser = {
  id?: string;
  name: string;
  email: string;
  phone?: string | null;
  classLevel?: string | null;
  schoolName?: string | null;
  role: "student" | "admin";
  unlockedCourses?: string[];
};

const courseCatalog = [
  {
    title: "Future Skills Starter",
    level: "Foundation",
    progress: 64,
    color: "from-blue-600 to-cyan-500",
    next: "Skill map and learning habits"
  },
  {
    title: "Robotics Lab",
    level: "Hands-on",
    progress: 28,
    color: "from-amber-500 to-rose-500",
    next: "Sensors and Arduino basics"
  },
  {
    title: "AI Coding",
    level: "Advanced",
    progress: 12,
    color: "from-violet-600 to-fuchsia-500",
    next: "Prompt logic and Python practice"
  }
];

const resultRows = [
  { subject: "Coding Logic", score: 92, status: "Excellent" },
  { subject: "Robotics", score: 78, status: "Improving" },
  { subject: "AI Basics", score: 84, status: "Strong" }
];

const quickActions = [
  { label: "Continue Lesson", href: "#courses", icon: PlayCircle, color: "bg-blue-600" },
  { label: "Track Result", href: "#results", icon: BarChart3, color: "bg-emerald-600" },
  { label: "Edit Profile", href: "#profile", icon: UserPen, color: "bg-rose-600" },
  { label: "Ask Mentor", href: "tel:+919000000000", icon: MessageCircle, color: "bg-slate-950" }
];

const studyPlan: { time: string; label: string; icon: LucideIcon }[] = [
  { time: "4:00 PM", label: "Robotics live practice", icon: CalendarDays },
  { time: "20 min", label: "AI quiz revision", icon: Clock3 },
  { time: "1 task", label: "Submit mini project", icon: FileText }
];

const settingsCards: { title: string; copy: string; icon: LucideIcon }[] = [
  { title: "Account Security", copy: "Password, session and login protection.", icon: ShieldCheck },
  { title: "Mentor Support", copy: "Raise course doubt and request callback.", icon: GraduationCap },
  { title: "Goals", copy: "Weekly targets and learning milestones.", icon: Target }
];

const recentUpdates: { title: string; copy: string; icon: LucideIcon }[] = [
  { title: "Lesson completed", copy: "Coding Logic - Variables", icon: CheckCircle2 },
  { title: "Badge earned", copy: "7 day study streak", icon: Star },
  { title: "Report generated", copy: "May learning summary", icon: FileText }
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    classLevel: "",
    schoolName: ""
  });

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => response.json().then((data) => ({ ok: response.ok, data })))
      .then(({ ok, data }) => {
        if (!ok || !data.user) {
          router.replace("/login");
          return;
        }

        if (data.user.role === "admin") {
          router.replace("/admin");
          return;
        }

        setUser(data.user);
        setProfile({
          name: data.user.name ?? "",
          phone: data.user.phone ?? "",
          classLevel: data.user.classLevel ?? "",
          schoolName: data.user.schoolName ?? ""
        });
      })
      .catch(() => router.replace("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const unlocked = useMemo(() => new Set(user?.unlockedCourses ?? ["Future Skills Starter"]), [user]);
  const averageScore = Math.round(resultRows.reduce((sum, row) => sum + row.score, 0) / resultRows.length);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus("Saving profile...");

    const response = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile)
    });
    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error || "Profile update failed.");
      setSaving(false);
      return;
    }

    setUser(data.user);
    window.dispatchEvent(new Event("adyapan-auth-change"));
    setStatus("Profile updated.");
    setSaving(false);
  }

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center px-4 text-slate-950">
        <div className="rounded-2xl border border-blue-100 bg-white px-6 py-5 text-sm font-black shadow-glass">
          Opening your dashboard...
        </div>
      </main>
    );
  }

  if (!user) {
    return <main className="min-h-screen" />;
  }

  return (
    <main className="min-h-screen px-4 pb-14 pt-8 text-slate-950 md:px-6">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[28px] border border-blue-100 bg-white/95 p-5 shadow-[0_24px_70px_rgba(37,99,235,0.14)] md:p-8">
          <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#ffd84d] to-[#ff5b55] text-base font-black text-slate-950">
                  {user.name?.[0]?.toUpperCase() || "A"}
                </span>
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-700">Student dashboard</p>
                  <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
                    Welcome, {user.name}
                  </h1>
                </div>
              </div>
              <p className="mt-5 max-w-3xl text-base font-medium leading-7 text-slate-600 md:text-lg">
                Continue courses, track results, update profile, and download certificates from one clean dashboard.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {quickActions.map((action) => (
                  <a
                    key={action.label}
                    href={action.href}
                    className="flex min-h-16 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 font-black shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-glass"
                  >
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white ${action.color}`}>
                      <action.icon className="h-5 w-5" />
                    </span>
                    {action.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-950 p-5 text-white">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-white/62">Learning score</p>
                  <p className="mt-1 text-5xl font-black">{averageScore}%</p>
                </div>
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
                  <TrendingUp className="h-8 w-8" />
                </span>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  ["Courses", courseCatalog.length],
                  ["Badges", 6],
                  ["Streak", "12d"]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-white/10 p-3 text-center">
                    <p className="text-xl font-black">{value}</p>
                    <p className="mt-1 text-xs font-bold text-white/62">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div id="courses" className="rounded-[24px] border border-blue-100 bg-white/95 p-5 shadow-glass md:p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-700">Courses</p>
                <h2 className="mt-1 text-2xl font-black">My Courses</h2>
              </div>
              <a href="/#curriculum" className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-black text-white">
                Explore More
              </a>
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-3">
              {courseCatalog.map((course) => {
                const active = unlocked.has(course.title);
                return (
                  <article key={course.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className={`flex h-32 items-end rounded-xl bg-gradient-to-br ${course.color} p-4 text-white`}>
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-white/75">{course.level}</p>
                        <h3 className="mt-1 text-xl font-black">{course.title}</h3>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="text-sm font-bold text-slate-600">Progress</span>
                      <span className="text-sm font-black">{active ? `${course.progress}%` : "Locked"}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-slate-950" style={{ width: active ? `${course.progress}%` : "8%" }} />
                    </div>
                    <p className="mt-4 min-h-12 text-sm font-semibold leading-6 text-slate-600">{course.next}</p>
                    <button
                      className={`mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-black ${
                        active ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {active ? <PlayCircle className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                      {active ? "Open Course" : "Unlock Course"}
                    </button>
                  </article>
                );
              })}
            </div>
          </div>

          <aside className="grid gap-6">
            <div className="rounded-[24px] border border-blue-100 bg-white/95 p-5 shadow-glass">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-rose-600">Today</p>
              <h2 className="mt-1 text-2xl font-black">Study Plan</h2>
              <div className="mt-5 grid gap-3">
                {studyPlan.map((item) => (
                  <div key={item.label} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{item.time}</p>
                      <p className="text-sm font-black">{item.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div id="certificates" className="rounded-[24px] border border-blue-100 bg-white/95 p-5 shadow-glass">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-amber-500" />
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-600">Certificates</p>
                  <h2 className="text-2xl font-black">Achievements</h2>
                </div>
              </div>
              <div className="mt-5 rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-4">
                <p className="font-black">Future Skills Starter</p>
                <p className="mt-2 text-sm font-semibold text-slate-600">Complete 80% to generate certificate.</p>
                <button className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-amber-500 px-4 text-sm font-black text-white">
                  <Download className="h-4 w-4" /> Download
                </button>
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1fr]">
          <div id="results" className="rounded-[24px] border border-blue-100 bg-white/95 p-5 shadow-glass md:p-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-emerald-600" />
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">Track Result</p>
                <h2 className="text-2xl font-black">Performance Report</h2>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {resultRows.map((row) => (
                <div key={row.subject} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-black">{row.subject}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-500">{row.status}</p>
                    </div>
                    <span className="text-2xl font-black text-emerald-600">{row.score}%</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${row.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="profile" className="rounded-[24px] border border-blue-100 bg-white/95 p-5 shadow-glass md:p-6">
            <div className="flex items-center gap-3">
              <UserPen className="h-8 w-8 text-rose-600" />
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-rose-700">Edit Profile</p>
                <h2 className="text-2xl font-black">Student Details</h2>
              </div>
            </div>
            <form onSubmit={saveProfile} className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-black text-slate-700">
                Name
                <input
                  value={profile.name}
                  onChange={(event) => setProfile((value) => ({ ...value, name: event.target.value }))}
                  className="h-12 rounded-xl border border-slate-200 bg-white px-4 font-semibold outline-none focus:border-blue-500"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-black text-slate-700">
                Phone
                <input
                  value={profile.phone}
                  onChange={(event) => setProfile((value) => ({ ...value, phone: event.target.value }))}
                  className="h-12 rounded-xl border border-slate-200 bg-white px-4 font-semibold outline-none focus:border-blue-500"
                />
              </label>
              <label className="grid gap-2 text-sm font-black text-slate-700">
                Class
                <select
                  value={profile.classLevel}
                  onChange={(event) => setProfile((value) => ({ ...value, classLevel: event.target.value }))}
                  className="h-12 rounded-xl border border-slate-200 bg-white px-4 font-semibold outline-none focus:border-blue-500"
                >
                  <option value="">Select class</option>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <option key={index + 5} value={`Class ${index + 5}`}>
                      Class {index + 5}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-black text-slate-700">
                School
                <input
                  value={profile.schoolName}
                  onChange={(event) => setProfile((value) => ({ ...value, schoolName: event.target.value }))}
                  className="h-12 rounded-xl border border-slate-200 bg-white px-4 font-semibold outline-none focus:border-blue-500"
                />
              </label>
              <label className="grid gap-2 text-sm font-black text-slate-700 md:col-span-2">
                Email
                <input
                  value={user.email}
                  className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 font-semibold text-slate-500 outline-none"
                  disabled
                />
              </label>
              <button
                disabled={saving}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 font-black text-white transition hover:-translate-y-0.5 disabled:opacity-60 md:col-span-2"
              >
                <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </div>
        </section>

        <section id="settings" className="mt-6 grid gap-6 lg:grid-cols-3">
          {settingsCards.map((card) => (
            <div key={card.title} className="rounded-[24px] border border-blue-100 bg-white/95 p-5 shadow-glass">
              <card.icon className="h-8 w-8 text-blue-700" />
              <h3 className="mt-4 text-xl font-black">{card.title}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{card.copy}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 rounded-[24px] border border-blue-100 bg-white/95 p-5 shadow-glass md:p-6">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-8 w-8 text-blue-700" />
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-700">Activity</p>
              <h2 className="text-2xl font-black">Recent Updates</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {recentUpdates.map((update) => (
              <div key={update.title} className="rounded-2xl bg-slate-50 p-4">
                <update.icon className="h-6 w-6 text-cyan-700" />
                <p className="mt-3 font-black">{update.title}</p>
                <p className="mt-1 text-sm font-semibold text-slate-600">{update.copy}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {status && (
        <button
          onClick={() => setStatus("")}
          className="fixed bottom-6 left-1/2 z-50 max-w-[92vw] -translate-x-1/2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-2xl"
        >
          {status}
        </button>
      )}
    </main>
  );
}
