"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  Award,
  Building2,
  Download,
  Eye,
  IndianRupee,
  LayoutDashboard,
  LogOut,
  RefreshCw,
  School,
  Search,
  ShieldCheck,
  UserCog,
  Users,
  X
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { broadcastLogout, onAuthChange } from "@/lib/auth-channel";

type Row = Record<string, unknown>;

type AdminOverview = {
  mode?: string;
  totals?: Record<string, number>;
  schools?: Row[];
  principals?: Row[];
  teachers?: Row[];
  teacherPerformance?: Row[];
  students?: Row[];
  leads?: Row[];
  payments?: Row[];
  certificates?: Row[];
  loginEvents?: Row[];
  teacherLoginEvents?: Row[];
  tables?: Array<{ name: string; label: string; rows: Row[] }>;
};

const tabs = [
  { id: "schools", label: "Schools", icon: School },
  { id: "teachers", label: "Teachers", icon: UserCog },
  { id: "principals", label: "Principals", icon: ShieldCheck },
  { id: "students", label: "Students", icon: Users },
  { id: "payments", label: "Payments", icon: IndianRupee },
  { id: "activity", label: "Activity", icon: Activity }
] as const;

function text(value: unknown, fallback = "-") {
  if (value === null || value === undefined || value === "") return fallback;
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

function numberValue(value: unknown) {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number : 0;
}

function formatCurrency(value: unknown) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(numberValue(value));
}

function formatDate(value: unknown) {
  if (!value) return "-";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function exportCsv(filename: string, rows: Row[]) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const csv = [keys.join(","), ...rows.map((row) => keys.map((key) => JSON.stringify(row[key] ?? "")).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminPage() {
  const router = useRouter();
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("schools");
  const [selectedStudent, setSelectedStudent] = useState<Row | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [mounted, setMounted] = useState(false);

  async function loadOverview() {
    setLoading(true);
    setStatus("");

    const authResponse = await fetch("/api/auth/me", { cache: "no-store" });
    const authData = await authResponse.json().catch(() => ({}));

    if (!authResponse.ok || authData.user?.role !== "admin") {
      router.replace("/login?next=/admin");
      return;
    }

    const overviewResponse = await fetch("/api/admin/overview", { cache: "no-store" });
    const data = await overviewResponse.json().catch(() => ({}));

    if (!overviewResponse.ok) {
      setStatus(data.error ?? "Admin dashboard could not be loaded.");
      setLoading(false);
      return;
    }

    setOverview(data);
    setLoading(false);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    broadcastLogout();
    window.dispatchEvent(new Event("adyapan-auth-change"));
    window.location.href = "/login?next=/admin";
  }

  useEffect(() => {
    setMounted(true);
    loadOverview();
  }, []);

  // Listen for logout from other tabs
  useEffect(() => {
    const cleanup = onAuthChange((message) => {
      if (message.type === "logout") {
        window.location.href = "/login?next=/admin";
      }
    });
    return cleanup;
  }, []);

  const totals = overview?.totals ?? {};
  const schools = overview?.schools ?? [];
  const teachers = overview?.teachers ?? [];
  const principals = overview?.principals ?? [];
  const students = overview?.students ?? [];
  const payments = overview?.payments ?? [];
  const teacherPerformance = overview?.teacherPerformance ?? [];
  const activity = [...(overview?.loginEvents ?? []), ...(overview?.teacherLoginEvents as Row[] | undefined ?? [])].slice(0, 120);

  const activeRows = useMemo(() => {
    const rows =
      activeTab === "schools"
        ? schools
        : activeTab === "teachers"
          ? teacherPerformance
          : activeTab === "principals"
            ? principals
            : activeTab === "students"
              ? students
              : activeTab === "payments"
                ? payments
                : activity;
    const search = query.trim().toLowerCase();
    if (!search) return rows;
    return rows.filter((row) => JSON.stringify(row).toLowerCase().includes(search));
  }, [activeTab, activity, payments, principals, query, schools, students, teacherPerformance]);

  const schoolChart = schools.slice(0, 8).map((school) => ({
    name: text(school.name, "School"),
    students: numberValue(school.students),
    teachers: numberValue(school.teachers)
  }));

  const statCards = [
    ["Schools", totals.schools, School, "bg-cyan-50 text-cyan-700"],
    ["Students", totals.students, Users, "bg-emerald-50 text-emerald-700"],
    ["Teachers", totals.teachers, UserCog, "bg-violet-50 text-violet-700"],
    ["Principals", totals.principals, ShieldCheck, "bg-blue-50 text-blue-700"],
    ["Connections", totals.connections, Building2, "bg-indigo-50 text-indigo-700"],
    ["Revenue", formatCurrency(totals.revenue), IndianRupee, "bg-amber-50 text-amber-700"],
    ["Certificates", totals.certificates, Award, "bg-rose-50 text-rose-700"]
  ] as const;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-950">
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-cyan-700" />
          <p className="mt-4 text-sm font-black text-slate-700">Loading admin control center...</p>
        </div>
      </main>
    );
  }

  if (!overview) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-950">
        <div className="max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-base font-black text-slate-950">{status || "Admin dashboard not available."}</p>
          <a href="/login?next=/admin" className="mt-5 inline-flex rounded-lg bg-slate-950 px-5 py-3 text-sm font-black text-white">
            Admin Login
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 md:px-6">
      <div className="mx-auto max-w-[1500px]">
        <header className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm xl:flex-row xl:items-center xl:justify-between">
          <div className="flex gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white">
              <LayoutDashboard className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">Admin Control Center</p>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
                Network operations dashboard
              </h1>
              <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
                Schools, principals, teachers, students, payments, certificates, and access logs are controlled from this secure admin view.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => exportCsv(`${activeTab}.csv`, activeRows)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-black text-slate-950 transition hover:bg-slate-950 hover:text-white"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            <button
              onClick={loadOverview}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-cyan-700 px-4 text-sm font-black text-white transition hover:bg-slate-950"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              onClick={logout}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-rose-700"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-7">
          {statCards.map(([label, value, Icon, color]) => (
            <article key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-3xl font-black text-slate-950">{text(value, "0")}</p>
              <p className="mt-1 text-sm font-black text-slate-500">{label}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_430px]">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-950">School network</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">Top schools by student and teacher coverage</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                <Building2 className="h-4 w-4" />
                {overview.mode ?? "mysql"}
              </span>
            </div>
            <div className="mt-5 h-80">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={schoolChart}>
                    <CartesianGrid stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569" tickLine={false} />
                    <YAxis stroke="#475569" tickLine={false} />
                    <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 8, color: "#0f172a" }} />
                    <Bar dataKey="students" fill="#0891b2" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="teachers" fill="#059669" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Security overview</h2>
            <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-600">
              {[
                ["Admin API guard", "Role checked server-side"],
                ["Session cookie", "httpOnly and sameSite=lax"],
                ["Teacher portal", `${totals.teacherLogins ?? 0} successful logins`],
                ["Principal portal", `${totals.principalLogins ?? 0} successful logins`],
                ["Active students", `${totals.activeStudents ?? 0} recent login users`]
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-4 py-3">
                  <span>{label}</span>
                  <span className="text-right font-black text-slate-950">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-950">Management tables</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">Search and inspect the full operational data set</p>
            </div>
            <label className="relative block xl:w-96">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search any name, school, email, class, status"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm font-semibold outline-none focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
              />
            </label>
          </div>

          <div className="flex gap-2 overflow-x-auto border-b border-slate-200 p-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-4 text-sm font-black transition ${
                    active ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-600 hover:bg-cyan-50 hover:text-cyan-700"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="overflow-x-auto">
            {activeTab === "schools" && <SchoolsTable rows={activeRows} />}
            {activeTab === "teachers" && <TeacherPerformanceTable rows={activeRows} />}
            {activeTab === "principals" && <PrincipalsTable rows={activeRows} />}
            {activeTab === "students" && <StudentsTable rows={activeRows} onView={setSelectedStudent} />}
            {activeTab === "payments" && <PaymentsTable rows={activeRows} />}
            {activeTab === "activity" && <ActivityTable rows={activeRows} />}
          </div>
        </section>

        {selectedStudent && (
          <StudentDetailsModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
        )}
      </div>
    </main>
  );
}

function EmptyRow({ columns }: { columns: number }) {
  return (
    <tr>
      <td colSpan={columns} className="px-5 py-8 text-center text-sm font-black text-slate-500">
        No records found.
      </td>
    </tr>
  );
}

function SchoolsTable({ rows }: { rows: Row[] }) {
  return (
    <table className="w-full min-w-[1040px] text-left text-sm">
      <thead className="bg-slate-50 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
        <tr>
          <th className="px-5 py-4">School</th>
          <th className="px-5 py-4">Contact</th>
          <th className="px-5 py-4">Students</th>
          <th className="px-5 py-4">Teachers</th>
          <th className="px-5 py-4">Principals</th>
          <th className="px-5 py-4">Revenue</th>
          <th className="px-5 py-4">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {rows.length ? rows.map((row) => (
          <tr key={text(row.id)} className="font-semibold text-slate-700">
            <td className="px-5 py-4">
              <span className="block font-black text-slate-950">{text(row.name)}</span>
              <span className="text-xs text-slate-500">{text(row.city)}</span>
            </td>
            <td className="px-5 py-4">
              <span className="block">{text(row.contactPerson)}</span>
              <span className="text-xs text-slate-500">{text(row.phone || row.email)}</span>
            </td>
            <td className="px-5 py-4">{text(row.students, "0")}</td>
            <td className="px-5 py-4">{text(row.teachers, "0")}</td>
            <td className="px-5 py-4">{text(row.principals, "0")}</td>
            <td className="px-5 py-4 font-black text-slate-950">{formatCurrency(row.revenue)}</td>
            <td className="px-5 py-4"><StatusBadge value={row.status} /></td>
          </tr>
        )) : <EmptyRow columns={7} />}
      </tbody>
    </table>
  );
}

function TeacherPerformanceTable({ rows }: { rows: Row[] }) {
  return (
    <table className="w-full min-w-[1100px] text-left text-sm">
      <thead className="bg-slate-50 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
        <tr>
          <th className="px-5 py-4">Teacher</th>
          <th className="px-5 py-4">School</th>
          <th className="px-5 py-4">Classes</th>
          <th className="px-5 py-4">Students</th>
          <th className="px-5 py-4">Sessions</th>
          <th className="px-5 py-4">Score</th>
          <th className="px-5 py-4">Last Login</th>
          <th className="px-5 py-4">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {rows.length ? rows.map((row) => (
          <tr key={text(row.teacherId)} className="font-semibold text-slate-700">
            <td className="px-5 py-4">
              <span className="block font-black text-slate-950">{text(row.name)}</span>
              <span className="text-xs text-slate-500">{text(row.email)}</span>
            </td>
            <td className="px-5 py-4">{text(row.schoolName)}</td>
            <td className="px-5 py-4">{text(row.assignedClasses)}</td>
            <td className="px-5 py-4">{text(row.students, "0")}</td>
            <td className="px-5 py-4">{text(row.sessions, "0")}</td>
            <td className="px-5 py-4">
              <span className="rounded bg-cyan-50 px-2 py-1 text-xs font-black text-cyan-700">{text(row.score, "0")}</span>
            </td>
            <td className="px-5 py-4">{formatDate(row.lastLoginAt)}</td>
            <td className="px-5 py-4"><StatusBadge value={row.status} /></td>
          </tr>
        )) : <EmptyRow columns={8} />}
      </tbody>
    </table>
  );
}

function PrincipalsTable({ rows }: { rows: Row[] }) {
  return (
    <table className="w-full min-w-[920px] text-left text-sm">
      <thead className="bg-slate-50 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
        <tr>
          <th className="px-5 py-4">Principal</th>
          <th className="px-5 py-4">School</th>
          <th className="px-5 py-4">Phone</th>
          <th className="px-5 py-4">Last Login</th>
          <th className="px-5 py-4">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {rows.length ? rows.map((row) => (
          <tr key={text(row.id)} className="font-semibold text-slate-700">
            <td className="px-5 py-4">
              <span className="block font-black text-slate-950">{text(row.name)}</span>
              <span className="text-xs text-slate-500">{text(row.email)}</span>
            </td>
            <td className="px-5 py-4">{text(row.schoolName)}</td>
            <td className="px-5 py-4">{text(row.phone)}</td>
            <td className="px-5 py-4">{formatDate(row.lastLoginAt)}</td>
            <td className="px-5 py-4"><StatusBadge value={row.status} /></td>
          </tr>
        )) : <EmptyRow columns={5} />}
      </tbody>
    </table>
  );
}

function StudentsTable({ rows, onView }: { rows: Row[]; onView: (row: Row) => void }) {
  return (
    <table className="w-full min-w-[1040px] text-left text-sm">
      <thead className="bg-slate-50 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
        <tr>
          <th className="px-5 py-4">Student</th>
          <th className="px-5 py-4">Phone</th>
          <th className="px-5 py-4">School</th>
          <th className="px-5 py-4">Class</th>
          <th className="px-5 py-4">Source</th>
          <th className="px-5 py-4">Joined</th>
          <th className="px-5 py-4 text-right">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {rows.length ? rows.map((row) => (
          <tr key={text(row.id)} className="font-semibold text-slate-700">
            <td className="px-5 py-4">
              <span className="block font-black text-slate-950">{text(row.name)}</span>
              <span className="text-xs text-slate-500">{text(row.email)}</span>
            </td>
            <td className="px-5 py-4">{text(row.phone)}</td>
            <td className="px-5 py-4">{text(row.schoolName)}</td>
            <td className="px-5 py-4">{text(row.classLevel)}</td>
            <td className="px-5 py-4">{text(row.signupSource)}</td>
            <td className="px-5 py-4">{formatDate(row.createdAt)}</td>
            <td className="px-5 py-4 text-right">
              <button
                type="button"
                onClick={() => onView(row)}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 text-xs font-black text-white transition hover:bg-cyan-700"
              >
                <Eye className="h-4 w-4" />
                View
              </button>
            </td>
          </tr>
        )) : <EmptyRow columns={7} />}
      </tbody>
    </table>
  );
}

function StudentDetailsModal({ student, onClose }: { student: Row; onClose: () => void }) {
  const rawFields = Object.entries(student).filter(([, value]) => value !== null && value !== undefined && value !== "");

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
      <section className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white text-slate-950 shadow-[0_28px_80px_rgba(15,23,42,0.35)]">
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-slate-200 bg-white p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-700">Student Details</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">{text(student.name, "Student")}</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">{text(student.email)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition hover:bg-slate-950 hover:text-white"
            aria-label="Close student details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-5 p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <DetailBox label="Phone" value={student.phone} />
            <DetailBox label="School" value={student.schoolName} />
            <DetailBox label="Class" value={student.classLevel} />
            <DetailBox label="Signup Source" value={student.signupSource} />
            <DetailBox label="Role" value={student.role} />
            <DetailBox label="Joined" value={formatDate(student.createdAt)} />
          </div>

          <div className="rounded-lg border border-slate-200">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
              <h3 className="text-sm font-black uppercase tracking-[0.12em] text-slate-500">Complete Record</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {rawFields.map(([key, value]) => (
                <div key={key} className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-[180px_1fr] sm:gap-4">
                  <span className="font-black capitalize text-slate-500">{key.replace(/([A-Z])/g, " $1")}</span>
                  <span className="break-words font-semibold text-slate-900">{text(value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function DetailBox({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-2 break-words text-sm font-black text-slate-950">{text(value)}</p>
    </div>
  );
}

function PaymentsTable({ rows }: { rows: Row[] }) {
  return (
    <table className="w-full min-w-[960px] text-left text-sm">
      <thead className="bg-slate-50 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
        <tr>
          <th className="px-5 py-4">User</th>
          <th className="px-5 py-4">Plan</th>
          <th className="px-5 py-4">Amount</th>
          <th className="px-5 py-4">Order</th>
          <th className="px-5 py-4">Date</th>
          <th className="px-5 py-4">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {rows.length ? rows.map((row) => (
          <tr key={text(row.id)} className="font-semibold text-slate-700">
            <td className="px-5 py-4">{text(row.userEmail)}</td>
            <td className="px-5 py-4">{text(row.plan)}</td>
            <td className="px-5 py-4 font-black text-slate-950">{formatCurrency(row.amount)}</td>
            <td className="px-5 py-4">{text(row.razorpayOrderId)}</td>
            <td className="px-5 py-4">{formatDate(row.createdAt)}</td>
            <td className="px-5 py-4"><StatusBadge value={row.status} /></td>
          </tr>
        )) : <EmptyRow columns={6} />}
      </tbody>
    </table>
  );
}

function ActivityTable({ rows }: { rows: Row[] }) {
  return (
    <table className="w-full min-w-[860px] text-left text-sm">
      <thead className="bg-slate-50 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
        <tr>
          <th className="px-5 py-4">Email</th>
          <th className="px-5 py-4">Role</th>
          <th className="px-5 py-4">Source</th>
          <th className="px-5 py-4">When</th>
          <th className="px-5 py-4">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {rows.length ? rows.map((row, index) => (
          <tr key={`${text(row.id)}-${index}`} className="font-semibold text-slate-700">
            <td className="px-5 py-4">{text(row.email)}</td>
            <td className="px-5 py-4">{text(row.role || (row.teacherId ? "teacher" : "user"))}</td>
            <td className="px-5 py-4">{text(row.source || row.schoolId)}</td>
            <td className="px-5 py-4">{formatDate(row.createdAt)}</td>
            <td className="px-5 py-4"><StatusBadge value={row.status} /></td>
          </tr>
        )) : <EmptyRow columns={5} />}
      </tbody>
    </table>
  );
}

function StatusBadge({ value }: { value: unknown }) {
  const status = text(value, "active").toLowerCase();
  const color =
    status === "active" || status === "paid" || status === "success"
      ? "bg-emerald-50 text-emerald-700"
      : status === "failed" || status === "paused"
        ? "bg-rose-50 text-rose-700"
        : "bg-slate-100 text-slate-700";

  return <span className={`rounded px-2 py-1 text-xs font-black uppercase ${color}`}>{status}</span>;
}
