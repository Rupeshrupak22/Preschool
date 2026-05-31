"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Building2,
  ExternalLink,
  KeyRound,
  LogOut,
  Mail,
  Phone,
  RefreshCw,
  School,
  Search,
  Settings,
  ShieldCheck,
  Users
} from "lucide-react";
import { broadcastLogout, onAuthChange } from "@/lib/auth-channel";
import { useSessionHeartbeat } from "@/lib/use-session-heartbeat";

type PrincipalDashboard = {
  principal: {
    id: string;
    name: string;
    email: string;
    schoolId: string;
    schoolName: string;
    phone?: string | null;
    lastLoginAt?: string | null;
  };
  stats: {
    students: number;
    leads: number;
    activeLogins: number;
    payments: number;
  };
  students: Array<Record<string, string | number | null>>;
  leads: Array<Record<string, string | number | null>>;
  logins: Array<Record<string, string | number | null>>;
};

function formatDate(value?: string | number | null) {
  if (!value) return "-";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default function PrincipalDashboardPage() {
  const [dashboard, setDashboard] = useState<PrincipalDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setStatus("");
    const response = await fetch("/api/principal/dashboard", { cache: "no-store" });
    const data = await response.json().catch(() => ({}));

    if (response.status === 401) {
      window.location.href = "/principal/login";
      return;
    }

    if (!response.ok) {
      setStatus(data.error ?? "Dashboard could not be loaded.");
      setLoading(false);
      return;
    }

    setDashboard(data);
    setLoading(false);
  }

  async function logout() {
    await fetch("/api/principal/logout", { method: "POST" });
    broadcastLogout();
    window.location.href = "/principal/login";
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  // Session heartbeat — auto-logout if session is cleared from another device
  useSessionHeartbeat({ checkUrl: "/api/principal/me", loginUrl: "/principal/login", enabled: !!dashboard });

  // Listen for logout from other tabs — redirect to login
  useEffect(() => {
    const cleanup = onAuthChange((message) => {
      if (message.type === "logout") {
        window.location.href = "/principal/login";
      }
    });
    return cleanup;
  }, []);

  const filteredStudents = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!dashboard || !text) return dashboard?.students ?? [];
    return dashboard.students.filter((student) =>
      [student.name, student.email, student.phone, student.classLevel]
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
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-cyan-700" />
          <p className="mt-4 text-sm font-black text-slate-700">Loading principal dashboard...</p>
        </div>
      </main>
    );
  }

  if (!dashboard) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-950">
        <div className="max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-base font-black text-slate-950">{status || "Dashboard not available."}</p>
          <a href="/principal/login" className="mt-5 inline-flex rounded-lg bg-slate-950 px-5 py-3 text-sm font-black text-white">
            Back to Login
          </a>
        </div>
      </main>
    );
  }

  const statCards = [
    ["Students", dashboard.stats.students, Users, "bg-cyan-50 text-cyan-700"],
    ["School Leads", dashboard.stats.leads, Building2, "bg-emerald-50 text-emerald-700"],
    ["Login Activity", dashboard.stats.activeLogins, Activity, "bg-blue-50 text-blue-700"],
    ["Payments", dashboard.stats.payments, KeyRound, "bg-amber-50 text-amber-700"]
  ] as const;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 md:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white">
              <School className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">Principal Dashboard</p>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
                {dashboard.principal.schoolName}
              </h1>
              <div className="mt-2 flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
                <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> {dashboard.principal.name}</span>
                <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4" /> {dashboard.principal.email}</span>
                {dashboard.principal.phone && (
                  <span className="inline-flex items-center gap-2"><Phone className="h-4 w-4" /> {dashboard.principal.phone}</span>
                )}
              </div>
            </div>
          </div>
          <div className="grid gap-2 sm:min-w-56">
            <a
              href="#settings"
              className="inline-flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
            >
              <Settings className="h-4 w-4 text-slate-500" />
              Settings
            </a>
            <a
              href="/student-dashboard"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
            >
              <ExternalLink className="h-4 w-4" />
              View Student Site
            </a>
            <button
              onClick={logout}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-black text-slate-950 transition hover:bg-slate-950 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div id="students" className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-950">Students</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">School-wise student records</p>
              </div>
              <label className="relative block md:w-72">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search students"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm font-semibold outline-none focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
                />
              </label>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-slate-50 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Name</th>
                    <th className="px-5 py-4">Email</th>
                    <th className="px-5 py-4">Phone</th>
                    <th className="px-5 py-4">Class</th>
                    <th className="px-5 py-4">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length ? (
                    filteredStudents.map((student) => (
                      <tr key={String(student.id)} className="font-semibold text-slate-700">
                        <td className="px-5 py-4 font-black text-slate-950">{student.name || "-"}</td>
                        <td className="px-5 py-4">{student.email || "-"}</td>
                        <td className="px-5 py-4">{student.phone || "-"}</td>
                        <td className="px-5 py-4">{student.classLevel || "-"}</td>
                        <td className="px-5 py-4">{formatDate(student.createdAt)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center font-black text-slate-500">
                        No students found for this school yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-6">
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">School Leads</h2>
              <div className="mt-4 grid gap-3">
                {dashboard.leads.slice(0, 5).map((lead) => (
                  <div key={String(lead.id)} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                    <p className="font-black text-slate-950">{lead.name || lead.email || "Lead"}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-600">{lead.phone || lead.city || lead.interest || "-"}</p>
                    <p className="mt-2 text-xs font-black uppercase tracking-[0.12em] text-slate-400">{formatDate(lead.createdAt)}</p>
                  </div>
                ))}
                {!dashboard.leads.length && <p className="py-6 text-center text-sm font-black text-slate-500">No leads yet.</p>}
              </div>
            </section>

            <section id="activity" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">Recent Login Activity</h2>
              <div className="mt-4 grid gap-3">
                {dashboard.logins.slice(0, 6).map((login) => (
                  <div key={String(login.id)} className="flex items-center justify-between gap-4 rounded-lg border border-slate-100 bg-white p-3">
                    <div>
                      <p className="text-sm font-black text-slate-950">{login.email || "-"}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">{formatDate(login.createdAt)}</p>
                    </div>
                    <span className="rounded bg-emerald-50 px-2 py-1 text-xs font-black uppercase text-emerald-700">
                      {login.status || "success"}
                    </span>
                  </div>
                ))}
                {!dashboard.logins.length && <p className="py-6 text-center text-sm font-black text-slate-500">No login activity yet.</p>}
              </div>
            </section>

            <section id="settings" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">Settings</h2>
              <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-600">
                <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-4 py-3">
                  <span>School ID</span>
                  <span className="font-black text-slate-950">{dashboard.principal.schoolId}</span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-4 py-3">
                  <span>Principal Email</span>
                  <span className="text-right font-black text-slate-950">{dashboard.principal.email}</span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-4 py-3">
                  <span>Last Login</span>
                  <span className="text-right font-black text-slate-950">{formatDate(dashboard.principal.lastLoginAt)}</span>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
