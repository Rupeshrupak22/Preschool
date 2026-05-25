"use client";

import { motion } from "framer-motion";
import { CalendarCheck, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import DashboardLayout from "@/components/student-dashboard/DashboardLayout";

const months = [
  { month: "January",  present: 22, total: 24, pct: 92 },
  { month: "February", present: 19, total: 20, pct: 95 },
  { month: "March",    present: 23, total: 26, pct: 88 },
  { month: "April",    present: 21, total: 22, pct: 95 },
  { month: "May",      present: 18, total: 19, pct: 95 },
];

const subjectAttendance = [
  { subject: "Mathematics",     pct: 96, color: "bg-blue-500" },
  { subject: "Science",         pct: 88, color: "bg-emerald-500" },
  { subject: "English",         pct: 100, color: "bg-rose-500" },
  { subject: "Computer Science",pct: 94, color: "bg-cyan-500" },
  { subject: "AI Basics",       pct: 90, color: "bg-purple-500" },
  { subject: "Social Studies",  pct: 85, color: "bg-orange-500" },
];

export default function AttendancePage() {
  const overall = Math.round(months.reduce((s, m) => s + m.pct, 0) / months.length);

  return (
    <DashboardLayout activeSection="/student-dashboard/attendance">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-950">Attendance</h1>
          <p className="mt-1 text-sm text-slate-400">Your attendance record for this academic year</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Overall", value: `${overall}%`, icon: CalendarCheck, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Present Days", value: "103", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Absent Days", value: "8", icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
            { label: "This Month", value: "95%", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.06)]"
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.bg}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
              <p className="text-2xl font-black text-slate-950">{card.value}</p>
              <p className="text-xs font-semibold text-slate-400">{card.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Monthly Breakdown */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_24px_rgba(15,23,42,0.06)]">
          <h2 className="mb-4 text-sm font-black text-slate-950">Monthly Breakdown</h2>
          <div className="space-y-3">
            {months.map((m, i) => (
              <div key={m.month} className="flex items-center gap-4">
                <span className="w-20 shrink-0 text-xs font-semibold text-slate-500">{m.month}</span>
                <div className="flex-1 h-2 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${m.pct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className={`h-full rounded-full ${m.pct >= 90 ? "bg-emerald-500" : m.pct >= 75 ? "bg-yellow-500" : "bg-red-500"}`}
                  />
                </div>
                <span className="w-24 shrink-0 text-right text-xs font-black text-slate-950">
                  {m.present}/{m.total} days · {m.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Subject-wise */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_24px_rgba(15,23,42,0.06)]">
          <h2 className="mb-4 text-sm font-black text-slate-950">Subject-wise Attendance</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {subjectAttendance.map((s, i) => (
              <div key={s.subject} className="flex items-center gap-3">
                <span className="w-36 shrink-0 text-xs font-semibold text-slate-600">{s.subject}</span>
                <div className="flex-1 h-2 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.pct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.07 }}
                    className={`h-full rounded-full ${s.color}`}
                  />
                </div>
                <span className="w-10 text-right text-xs font-black text-slate-950">{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
