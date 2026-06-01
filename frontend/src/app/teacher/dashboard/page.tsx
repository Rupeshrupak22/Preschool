"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Video,
  MessageSquare,
  Search,
  LogOut,
  RefreshCw,
  BookOpen,
  FileText,
  Bell,
  ClipboardList,
  Calendar,
  ChevronRight,
  Home,
  GraduationCap,
  LayoutGrid,
  HelpCircle,
  Settings,
  Menu,
  X,
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
    subject: string;
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
    homework: number;
    notes: number;
    pendingDoubts: number;
    notifications: number;
  };
  classBreakdown: Array<{ classLevel: string; total: number }>;
  students: Array<Record<string, string | number | null>>;
  schedule: Array<Record<string, string | number | null>>;
  logins: Array<Record<string, string | number | null>>;
  certificates: Array<Record<string, string | number | null>>;
  homework: Array<Record<string, string | number | null>>;
  notes: Array<Record<string, string | number | null>>;
  doubts: Array<Record<string, string | number | null>>;
  notifications: Array<Record<string, string | number | null>>;
};

type ActiveTab = "classroom" | "academics";

const sidebarNav = [
  { id: "home", label: "Home", icon: Home },
  { id: "syllabus", label: "Syllabus", icon: BookOpen },
  { id: "career", label: "Career Roadmap", icon: GraduationCap },
  { id: "leaderboard", label: "Leaderboard", icon: LayoutGrid },
  { id: "doubts", label: "Solve Doubts", icon: HelpCircle },
  { id: "settings", label: "Settings", icon: Settings },
];

function formatDate(value?: string | number | null) {
  if (!value) return "-";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function TeacherDashboardPage() {
  const [dashboard, setDashboard] = useState<TeacherDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("academics");
  const [activeNav, setActiveNav] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      setStatus(data.error ?? "Dashboard could not be loaded.");
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

  useSessionHeartbeat({ checkUrl: "/api/teacher/me", loginUrl: "/teacher/login", enabled: !!dashboard });

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
      [student.name, student.email, student.phone, student.classLevel]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(text)
    );
  }, [dashboard, query]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f0f4ff]">
        <div className="rounded-2xl border border-blue-100 bg-white p-8 text-center shadow-lg">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-4 text-sm font-bold text-slate-700">Loading teacher dashboard...</p>
        </div>
      </main>
    );
  }

  if (!dashboard) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f0f4ff]">
        <div className="max-w-md rounded-2xl border border-blue-100 bg-white p-8 text-center shadow-lg">
          <p className="text-base font-bold text-slate-900">{status || "Dashboard not available."}</p>
          <a href="/teacher/login" className="mt-5 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700">
            Back to Login
          </a>
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f0f4ff]">
      {/* ─── SIDEBAR (Desktop) ─────────────────────────────────── */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-slate-200 shadow-sm z-30">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-sm">
            A
          </div>
          <div>
            <p className="text-sm font-black text-slate-900">Adyapan</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Educator Portal</p>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {sidebarNav.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-slate-100">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* ─── MOBILE HEADER ─────────────────────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 rounded-lg hover:bg-slate-100">
            <Menu className="h-5 w-5 text-slate-700" />
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-black text-xs">A</div>
          <span className="text-sm font-black text-slate-900">Adyapan</span>
        </div>
        <button onClick={logout} className="p-2 rounded-lg hover:bg-red-50 text-red-600">
          <LogOut className="h-5 w-5" />
        </button>
      </div>

      {/* ─── MOBILE DRAWER ─────────────────────────────────────── */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
          <aside className="fixed left-0 top-0 z-50 h-full w-64 bg-white shadow-xl lg:hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-black text-xs">A</div>
                <span className="text-sm font-black text-slate-900">Adyapan</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100">
                <X className="h-5 w-5 text-slate-600" />
              </button>
            </div>
            <nav className="px-4 py-4 space-y-1">
              {sidebarNav.map((item) => {
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveNav(item.id); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>
        </>
      )}

      {/* ─── MAIN CONTENT ──────────────────────────────────────── */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <div className="max-w-6xl mx-auto px-4 py-6 md:px-8 md:py-8">

          {/* ─── HEADER SECTION ──────────────────────────────────── */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-500 text-white text-xl font-black shadow-lg">
                {dashboard.teacher.name?.charAt(0)?.toUpperCase() || "T"}
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-600">{getGreeting()},</p>
                <h1 className="text-xl md:text-2xl font-black text-slate-900">{dashboard.teacher.name}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
                <span className="text-xs font-bold text-slate-500 uppercase">Your UID</span>
                <span className="text-sm font-bold text-slate-900">{dashboard.teacher.email}</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
              {dashboard.stats.notifications > 0 && (
                <button className="relative p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm hover:bg-slate-50">
                  <Bell className="h-5 w-5 text-slate-700" />
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {dashboard.stats.notifications}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* ─── PORTAL LABEL ────────────────────────────────────── */}
          <div className="mb-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Educator Portal</p>
            <h2 className="text-lg md:text-xl font-black text-slate-900">Supervision Control Center</h2>
          </div>

          {/* ─── SEARCH BAR ──────────────────────────────────────── */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search students, classes, homework, doubts..."
              className="w-full h-12 rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {/* ─── STATS CARDS ─────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-4 mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-2xl md:text-3xl font-black text-slate-900">{dashboard.stats.students}</span>
              </div>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">Students</p>
            </div>
            <div className="text-center border-x border-slate-100">
              <div className="flex items-center justify-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="text-2xl md:text-3xl font-black text-slate-900">{dashboard.stats.upcomingClasses}</span>
              </div>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">Live Class</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <span className="text-2xl md:text-3xl font-black text-slate-900">{dashboard.stats.pendingDoubts}</span>
              </div>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">Pending</p>
            </div>
          </div>

          {/* ─── SUPERVISION QUICK ACCESS HUB ────────────────────── */}
          <div className="mb-8">
            <h3 className="text-base font-black text-slate-900 mb-4">Supervision Quick Access Hub</h3>

            {/* Tab Switcher */}
            <div className="flex rounded-full bg-slate-100 p-1 mb-5 max-w-md">
              <button
                onClick={() => setActiveTab("classroom")}
                className={`flex-1 rounded-full py-2.5 text-sm font-bold transition-all ${
                  activeTab === "classroom"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Classroom
              </button>
              <button
                onClick={() => setActiveTab("academics")}
                className={`flex-1 rounded-full py-2.5 text-sm font-bold transition-all ${
                  activeTab === "academics"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Academics
              </button>
            </div>

            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeTab === "academics" ? (
                <>
                  <QuickCard
                    icon={<ClipboardList className="h-6 w-6 text-blue-600" />}
                    title="Assign Homework"
                    subtitle="Send task with notification"
                    badge={`${dashboard.stats.homework} Sent`}
                  />
                  <QuickCard
                    icon={<FileText className="h-6 w-6 text-blue-600" />}
                    title="Share Notes"
                    subtitle="PDFs and chapter files"
                    badge={`${dashboard.stats.notes} Files`}
                  />
                  <QuickCard
                    icon={<HelpCircle className="h-6 w-6 text-blue-600" />}
                    title="Solve Doubts"
                    subtitle="Answer student questions"
                    badge={`${dashboard.stats.pendingDoubts} Pending`}
                  />
                </>
              ) : (
                <>
                  <QuickCard
                    icon={<Users className="h-6 w-6 text-blue-600" />}
                    title="My Students"
                    subtitle="View all enrolled students"
                    badge={`${dashboard.stats.students} Total`}
                  />
                  <QuickCard
                    icon={<Video className="h-6 w-6 text-blue-600" />}
                    title="Live Classes"
                    subtitle="Schedule and manage sessions"
                    badge={`${dashboard.stats.upcomingClasses} Upcoming`}
                  />
                  <QuickCard
                    icon={<BookOpen className="h-6 w-6 text-blue-600" />}
                    title="Class Breakdown"
                    subtitle="Students per class"
                    badge={`${dashboard.stats.classes} Classes`}
                  />
                </>
              )}
            </div>
          </div>

          {/* ─── UPCOMING SCHEDULE ───────────────────────────────── */}
          {dashboard.schedule.length > 0 && (
            <section className="mb-8">
              <h3 className="text-base font-black text-slate-900 mb-4">Upcoming Classes</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {dashboard.schedule.slice(0, 6).map((session) => (
                  <div key={String(session.id)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-black text-slate-900">{session.title || "Class Session"}</p>
                        <p className="mt-1 text-xs font-semibold text-slate-500">
                          {session.subject} • {session.classLevel}
                        </p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                        session.status === "scheduled" ? "bg-blue-50 text-blue-700" :
                        session.status === "live" ? "bg-green-50 text-green-700 animate-pulse" :
                        "bg-slate-100 text-slate-600"
                      }`}>
                        {session.status || "scheduled"}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(session.startTime)}
                    </div>
                    {session.mode && (
                      <p className="mt-1 text-xs font-semibold text-slate-400">{session.mode}{session.room ? ` • ${session.room}` : ""}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── STUDENTS TABLE ──────────────────────────────────── */}
          <section className="mb-8">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900">Students</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">{dashboard.teacher.schoolName} • {dashboard.teacher.assignedClasses.join(", ") || "All Classes"}</p>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                  {filteredStudents.length} students
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-3">Name</th>
                      <th className="px-5 py-3">Email</th>
                      <th className="px-5 py-3">Phone</th>
                      <th className="px-5 py-3">Class</th>
                      <th className="px-5 py-3">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredStudents.length ? (
                      filteredStudents.slice(0, 20).map((student) => (
                        <tr key={String(student.id)} className="hover:bg-slate-50/50 transition">
                          <td className="px-5 py-3.5 font-bold text-slate-900">{student.name || "-"}</td>
                          <td className="px-5 py-3.5 font-medium text-slate-600">{student.email || "-"}</td>
                          <td className="px-5 py-3.5 font-medium text-slate-600">{student.phone || "-"}</td>
                          <td className="px-5 py-3.5 font-medium text-slate-600">{student.classLevel || "-"}</td>
                          <td className="px-5 py-3.5 font-medium text-slate-500">{formatDate(student.createdAt)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-5 py-10 text-center font-bold text-slate-400">
                          No students found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ─── RECENT DOUBTS ───────────────────────────────────── */}
          {dashboard.doubts.length > 0 && (
            <section className="mb-8">
              <h3 className="text-base font-black text-slate-900 mb-4">Recent Student Doubts</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {dashboard.doubts.slice(0, 6).map((doubt) => (
                  <div key={String(doubt.id)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900 truncate">{doubt.question || "Question"}</p>
                        <p className="mt-1 text-xs font-semibold text-slate-500">
                          {doubt.studentName} • {doubt.subject} • {doubt.classLevel}
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                        doubt.status === "solved" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        {doubt.status || "pending"}
                      </span>
                    </div>
                    <p className="mt-2 text-xs font-medium text-slate-400">{formatDate(doubt.createdAt)}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── CLASS BREAKDOWN ──────────────────────────────────── */}
          {dashboard.classBreakdown.length > 0 && (
            <section className="mb-8">
              <h3 className="text-base font-black text-slate-900 mb-4">Class Breakdown</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {dashboard.classBreakdown.map((item) => (
                  <div key={item.classLevel} className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                    <p className="text-2xl font-black text-blue-600">{item.total}</p>
                    <p className="mt-1 text-xs font-bold text-slate-600">{item.classLevel}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── RECENT HOMEWORK ─────────────────────────────────── */}
          {dashboard.homework.length > 0 && (
            <section className="mb-8">
              <h3 className="text-base font-black text-slate-900 mb-4">Recent Homework</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {dashboard.homework.slice(0, 6).map((hw) => (
                  <div key={String(hw.id)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-bold text-slate-900">{hw.title || "Homework"}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">{hw.subject} • {hw.classLevel}</p>
                    {hw.dueDate && <p className="mt-2 text-xs font-medium text-amber-600">Due: {formatDate(hw.dueDate)}</p>}
                    <span className={`mt-2 inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                      hw.status === "active" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-600"
                    }`}>
                      {hw.status || "active"}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>

      {/* ─── FLOATING SOLVE DOUBTS BUTTON ────────────────────────── */}
      {dashboard.stats.pendingDoubts > 0 && (
        <button className="fixed bottom-6 right-6 z-20 flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-blue-700 transition hover:shadow-xl">
          <MessageSquare className="h-4 w-4" />
          Solve Doubts
        </button>
      )}
    </div>
  );
}

/* ─── QUICK CARD COMPONENT ─────────────────────────────────────── */
function QuickCard({ icon, title, subtitle, badge }: { icon: React.ReactNode; title: string; subtitle: string; badge: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition cursor-pointer group">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 group-hover:bg-blue-100 transition">
          {icon}
        </div>
        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{badge}</span>
      </div>
      <p className="mt-3 text-sm font-black text-slate-900">{title}</p>
      <p className="mt-0.5 text-xs font-medium text-slate-500">{subtitle}</p>
    </div>
  );
}
