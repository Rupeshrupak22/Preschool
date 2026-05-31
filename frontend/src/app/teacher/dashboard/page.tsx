"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Award,
  BookOpenCheck,
  CalendarClock,
  GraduationCap,
  LogOut,
  Mail,
  Phone,
  RefreshCw,
  School,
  Search,
  ShieldCheck,
  UserRound,
  Users
} from "lucide-react";
import { broadcastLogout, onAuthChange } from "@/lib/auth-channel";
import { useSessionHeartbeat } from "@/lib/use-session-heartbeat";

type TeacherDashboard = {
  teacher: {
    id: string;
    name: string;
    email: string;
    schoolId: string;
    schoolName: string;
    subject?: string | null;
    phone?: string | null;
    assignedClasses: string[];
    lastLoginAt?: string | null;
  };
  stats: {
    students: number;
    classes: number;
    upcomingClasses: number;
    certificates: number;
    activeLogins: number;
  };
  classBreakdown: Array<{ classLevel: string; total: number }>;
  students: Array<Record<string, string | number | null>>;
  schedule: Array<Record<string, string | number | null>>;
  logins: Array<Record<string, string | number | null>>;
  certificates: Array<Record<string, string | number | null>>;
};

function formatDate(value?: string | number | null) {
  if (!value) return "-";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function formatTimeRange(start?: string | number | null, end?: string | number | null) {
  const startText = formatDate(start);
  if (!end) return startText;
  const date = new Date(String(end));
  const endText = Number.isNaN(date.getTime()) ? String(end) : date.toLocaleTimeString("en-IN", { timeStyle: "short" });
  return `${startText} to ${endText}`;
}

export default function TeacherDashboardPage() {
  const [dashboard, setDashboard] = useState<TeacherDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setStatus("");
    const response = await fetch("/api/teacher/dashboard", { cache: "no-store" });
    const data = await response.json().catch(() => ({}));

    if (response.status === 401) {
      window.location.href = "/teacher/login";
      return;
    }

    if (!response.ok) {
      setStatus(data.error ?? "Teacher dashboard could not be loaded.");
      setLoading(false);
      return;
    }

    setDashboard(data);
    setLoading(false);
  }

  async function logout() {
    await fetch("/api/teacher/logout", { method: "POST" });
    broadcastLogout();
    window.location.href = "/teacher/login";
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  // Session heartbeat — auto-logout if session is cleared from another device
  useSessionHeartbeat({ checkUrl: "/api/teacher/me", loginUrl: "/teacher/login", enabled: !!dashboard });

  // Listen for logout from other tabs — redirect to login
  useEffect(() => {
    const cleanup = onAuthChange((message) => {
      if (message.type === "logout") {
        window.location.href = "/teacher/login";
      }
    });
    return cleanup;
  }, []);

  const filteredStudents = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!dashboard || !text) return dashboard?.students ?? [];
    return dashboard.students.filter((student) =>
      [student.name, student.email, student.phone, student.classLevel, student.schoolName]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(text)
    );
  }, [dashboard, query]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-950">
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-emerald-700" />
          <p className="mt-4 text-sm font-black text-slate-700">Loading teacher dashboard...</p>
        </div>
      </main>
    );
  }

  if (!dashboard) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-950">
        <div className="max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-base font-black text-slate-950">{status || "Dashboard not available."}</p>
          <a href="/teacher/login" className="mt-5 inline-flex rounded-lg bg-slate-950 px-5 py-3 text-sm font-black text-white">
            Back to Login
          </a>
        </div>
      </main>
    );
  }

  const statCards = [
    ["Students", dashboard.stats.students, Users, "bg-emerald-50 text-emerald-700"],
    ["Assigned Classes", dashboard.stats.classes, GraduationCap, "bg-cyan-50 text-cyan-700"],
    ["Upcoming Sessions", dashboard.stats.upcomingClasses, CalendarClock, "bg-blue-50 text-blue-700"],
    ["Certificates", dashboard.stats.certificates, Award, "bg-amber-50 text-amber-700"],
    ["Login Signals", dashboard.stats.activeLogins, Activity, "bg-violet-50 text-violet-700"]
  ] as const;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 md:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white">
              <BookOpenCheck className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Teacher Dashboard</p>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
                {dashboard.teacher.name}
              </h1>
              <div className="mt-2 flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <School className="h-4 w-4" /> {dashboard.teacher.schoolName}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Mail className="h-4 w-4" /> {dashboard.teacher.email}
                </span>
                {dashboard.teacher.phone && (
                  <span className="inline-flex items-center gap-2">
                    <Phone className="h-4 w-4" /> {dashboard.teacher.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-2 sm:min-w-64">
            <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
              <span className="block text-xs font-black uppercase tracking-[0.12em] text-slate-400">Subject</span>
              <span className="mt-1 block font-black text-slate-950">{dashboard.teacher.subject || "Not assigned"}</span>
            </div>
            <button
              onClick={logout}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-black text-slate-950 transition hover:bg-slate-950 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {statCards.map(([label, value, Icon, color]) => (
            <article key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-3xl font-black text-slate-950">{value}</p>
              <p className="mt-1 text-sm font-black text-slate-500">{label}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.45fr_0.9fr]">
          <div id="students" className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-950">Student List</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Assigned school and class records with profile details
                </p>
              </div>
              <label className="relative block md:w-72">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search students"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm font-semibold outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                />
              </label>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] text-left text-sm">
                <thead className="bg-slate-50 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Profile</th>
                    <th className="px-5 py-4">Email</th>
                    <th className="px-5 py-4">Phone</th>
                    <th className="px-5 py-4">School</th>
                    <th className="px-5 py-4">Class</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length ? (
                    filteredStudents.map((student) => (
                      <tr key={String(student.id)} className="font-semibold text-slate-700">
                        <td className="px-5 py-4">
                          <span className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                              <UserRound className="h-4 w-4" />
                            </span>
                            <span>
                              <span className="block font-black text-slate-950">{student.name || "-"}</span>
                              <span className="block text-xs text-slate-500">{formatDate(student.createdAt)}</span>
                            </span>
                          </span>
                        </td>
                        <td className="px-5 py-4">{student.email || "-"}</td>
                        <td className="px-5 py-4">{student.phone || "-"}</td>
                        <td className="px-5 py-4">{student.schoolName || "-"}</td>
                        <td className="px-5 py-4">{student.classLevel || "-"}</td>
                        <td className="px-5 py-4">
                          <span className="rounded bg-emerald-50 px-2 py-1 text-xs font-black uppercase text-emerald-700">
                            {student.status || "active"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center font-black text-slate-500">
                        No students found for this teacher assignment yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-6">
            <section id="classes" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">Assigned Classes</h2>
              <div className="mt-4 grid gap-3">
                {dashboard.classBreakdown.length ? (
                  dashboard.classBreakdown.map((item) => (
                    <div key={item.classLevel} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                      <span className="font-black text-slate-950">{item.classLevel}</span>
                      <span className="rounded bg-white px-3 py-1 text-sm font-black text-emerald-700">{item.total} students</span>
                    </div>
                  ))
                ) : (
                  <p className="py-6 text-center text-sm font-black text-slate-500">No class records yet.</p>
                )}
              </div>
            </section>

            <section id="schedule" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">Class Schedule</h2>
              <div className="mt-4 grid gap-3">
                {dashboard.schedule.slice(0, 8).map((item) => (
                  <div key={String(item.id)} className="rounded-lg border border-slate-100 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-black text-slate-950">{item.title || "Class session"}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-600">
                          {item.classLevel || "-"} | {item.subject || dashboard.teacher.subject || "Subject"}
                        </p>
                      </div>
                      <span className="rounded bg-blue-50 px-2 py-1 text-xs font-black uppercase text-blue-700">
                        {item.mode || "online"}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      {formatTimeRange(item.startTime, item.endTime)}
                    </p>
                    <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                      {item.room || "Room not assigned"} | {item.status || "scheduled"}
                    </p>
                  </div>
                ))}
                {!dashboard.schedule.length && <p className="py-6 text-center text-sm font-black text-slate-500">No sessions scheduled.</p>}
              </div>
            </section>

            <section id="security" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">Security Profile</h2>
              <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-600">
                <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-4 py-3">
                  <span>Teacher ID</span>
                  <span className="text-right font-black text-slate-950">{dashboard.teacher.id}</span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-4 py-3">
                  <span>School ID</span>
                  <span className="font-black text-slate-950">{dashboard.teacher.schoolId}</span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-4 py-3">
                  <span>Last Login</span>
                  <span className="text-right font-black text-slate-950">{formatDate(dashboard.teacher.lastLoginAt)}</span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-4 py-3">
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" /> Session
                  </span>
                  <span className="font-black text-emerald-700">Protected</span>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
