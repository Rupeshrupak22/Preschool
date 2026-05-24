"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Download,
  LayoutDashboard,
  Receipt,
  School,
  Search,
  Tag,
  UserCog,
  Users
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Row = Record<string, unknown>;

const analytics = [
  { month: "Jan", enrollments: 42, revenue: 180 },
  { month: "Feb", enrollments: 58, revenue: 240 },
  { month: "Mar", enrollments: 76, revenue: 330 },
  { month: "Apr", enrollments: 91, revenue: 410 },
  { month: "May", enrollments: 118, revenue: 560 }
];

const modules = [
  ["Students", Users],
  ["Courses", LayoutDashboard],
  ["Certificates", Receipt],
  ["Schools", School],
  ["Payments", Receipt],
  ["Coupons", Tag],
  ["Notifications", Bell],
  ["Activity Logs", UserCog]
] as const;

export default function AdminPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Row[]>([]);
  const [leads, setLeads] = useState<Row[]>([]);
  const [payments, setPayments] = useState<Row[]>([]);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/auth/me")
      .then((response) => response.json().then((data) => ({ ok: response.ok, data })))
      .then(({ ok, data }) => {
        if (!ok || data.user?.role !== "admin") {
          router.replace("/login");
          return null;
        }
        return fetch("/api/admin/overview");
      })
      .then((response) => response?.json())
      .then((data) => {
        if (!data) return;
        setStudents(data.students ?? []);
        setLeads(data.leads ?? []);
        setPayments(data.payments ?? []);
      });
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => JSON.stringify(student).toLowerCase().includes(query.toLowerCase()));
  }, [students, query]);

  function exportCsv() {
    const rows = filteredStudents.length ? filteredStudents : [{ name: "Demo Student", email: "student@adyapan.com", classLevel: "Class 8" }];
    const keys = Object.keys(rows[0]);
    const csv = [keys.join(","), ...rows.map((row) => keys.map((key) => JSON.stringify(row[key] ?? "")).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "adyapan-students.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-ink p-4 text-saffron-900 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-saffron-700">Admin panel</p>
            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl md:text-5xl">Operations command center</h1>
          </div>
          <button onClick={exportCsv} className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-saffron-500 px-5 font-semibold shadow-glow">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Students", students.length || 1284],
            ["Schools", leads.filter((lead) => lead.type === "school").length || 48],
            ["Payments", payments.length || 312],
            ["Live Enrollments", 37]
          ].map(([label, value]) => (
            <div key={String(label)} className="glass rounded-2xl p-5">
              <p className="text-sm text-saffron-900/56">{String(label)}</p>
              <p className="mt-2 text-3xl font-semibold">{String(value)}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="glass rounded-2xl p-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <h2 className="text-xl font-semibold">Analytics</h2>
              <div className="relative w-full md:w-auto">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-saffron-900/38" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search students"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-saffron-400 md:w-64"
                />
              </div>
            </div>
            <div className="mt-5 h-72">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics}>
                    <CartesianGrid stroke="#dbeafe" vertical={false} />
                    <XAxis dataKey="month" stroke="#475569" />
                    <YAxis stroke="#475569" />
                    <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #bfdbfe", borderRadius: 8, color: "#0f172a" }} />
                    <Bar dataKey="enrollments" fill="#2563eb" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="revenue" fill="#0d9488" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h2 className="text-xl font-semibold">Management</h2>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {modules.map(([label, Icon]) => (
                <button key={label} className="rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-saffron-300/40 hover:bg-blue-50">
                  <Icon className="h-5 w-5 text-saffron-600" />
                  <p className="mt-3 text-sm font-semibold">{label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <div className="min-w-[680px]">
            <div className="grid grid-cols-4 border-b border-slate-200 px-4 py-3 text-sm font-semibold text-saffron-900/66">
              <span>Name</span>
              <span>Email</span>
              <span>Class</span>
              <span>Status</span>
            </div>
            {(filteredStudents.length ? filteredStudents : [
              { name: "Aarav Sharma", email: "aarav@example.com", classLevel: "Class 8", status: "Active" },
              { name: "Mira Iyer", email: "mira@example.com", classLevel: "Class 10", status: "Certified" },
              { name: "Kabir Khan", email: "kabir@example.com", classLevel: "Class 6", status: "Trial" }
            ]).map((student, index) => (
              <div key={index} className="grid grid-cols-4 px-4 py-3 text-sm text-saffron-900/62 odd:bg-white/70">
                <span>{String(student.name ?? "Student")}</span>
                <span className="truncate">{String(student.email ?? "student@adyapan.com")}</span>
                <span>{String(student.classLevel ?? "Class 8")}</span>
                <span>{String(student.status ?? "Active")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}




