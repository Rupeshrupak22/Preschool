"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, AlertTriangle, Circle, Download } from "lucide-react";
import type { HomeworkItem } from "@/lib/dashboard/dashboard-data";

interface Props {
  items: HomeworkItem[];
}

const statusConfig = {
  pending: {
    icon: Circle,
    label: "Pending",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    badge: "bg-yellow-100 text-yellow-700",
  },
  submitted: {
    icon: CheckCircle2,
    label: "Submitted",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
  },
  overdue: {
    icon: AlertTriangle,
    label: "Overdue",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-700",
  },
};

const priorityColors = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-emerald-500",
};

const subjectColors: Record<string, string> = {
  Mathematics: "bg-blue-100 text-blue-700",
  Science: "bg-emerald-100 text-emerald-700",
  English: "bg-purple-100 text-purple-700",
  "Computer Science": "bg-cyan-100 text-cyan-700",
  "AI Basics": "bg-fuchsia-100 text-fuchsia-700",
  Robotics: "bg-orange-100 text-orange-700",
};

export default function HomeworkSection({ items }: Props) {
  const pending = items.filter((i) => i.status === "pending").length;
  const submitted = items.filter((i) => i.status === "submitted").length;
  const overdue = items.filter((i) => i.status === "overdue").length;

  return (
    <section id="homework">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-950">Homework Tracker</h2>
        <button className="text-xs font-bold text-blue-600 hover:text-blue-800 transition">View All →</button>
      </div>

      {/* Summary */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        {[
          { label: "Pending", count: pending, color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
          { label: "Submitted", count: submitted, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
          { label: "Overdue", count: overdue, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
        ].map((s) => (
          <div key={s.label} className={`flex flex-col items-center rounded-xl border ${s.border} ${s.bg} py-3`}>
            <span className={`text-2xl font-black ${s.color}`}>{s.count}</span>
            <span className="text-[11px] font-semibold text-slate-500">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-2.5">
        {items.length === 0 ? (
          <div className="rounded-xl border border-slate-100 bg-white px-4 py-6 text-sm font-semibold text-slate-500">
            No homework has been assigned yet.
          </div>
        ) : items.map((hw, i) => {
          const cfg = statusConfig[hw.status];
          const StatusIcon = cfg.icon;
          return (
            <motion.div
              key={hw.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`flex items-center gap-3 rounded-xl border ${cfg.border} ${cfg.bg} px-4 py-3 transition hover:shadow-sm`}
            >
              {/* Priority dot */}
              <span className={`h-2 w-2 shrink-0 rounded-full ${priorityColors[hw.priority]}`} />

              {/* Status Icon */}
              <StatusIcon className={`h-4 w-4 shrink-0 ${cfg.color}`} />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-slate-950">{hw.title}</p>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-black ${subjectColors[hw.subject] ?? "bg-slate-100 text-slate-600"}`}>
                    {hw.subject}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                    <Clock className="h-2.5 w-2.5" />
                    Due: {hw.dueDate}
                  </span>
                </div>
                {hw.url && (
                  <a href={hw.url} download={hw.fileName || true} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 hover:bg-blue-200 transition">
                    <Download className="h-3 w-3" /> {hw.fileName || "Download File"}
                  </a>
                )}
              </div>

              {/* Status Badge */}
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black ${cfg.badge}`}>
                {cfg.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
