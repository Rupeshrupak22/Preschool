"use client";

import { motion } from "framer-motion";
import { Video, Clock, User, Play, BookOpen, Cpu, MessageSquare, Globe } from "lucide-react";
import type { LiveClass } from "@/lib/dashboard/dashboard-data";

const subjectIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Mathematics: BookOpen,
  Science: Globe,
  "AI Basics": Cpu,
  English: MessageSquare,
};

const colorMap: Record<string, { gradient: string; border: string; iconBg: string; btn: string; glow: string }> = {
  blue: {
    gradient: "from-blue-50 to-indigo-50",
    border: "border-blue-200",
    iconBg: "bg-gradient-to-br from-blue-500 to-indigo-500",
    btn: "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600",
    glow: "hover:shadow-[0_12px_36px_rgba(59,130,246,0.25)]",
  },
  emerald: {
    gradient: "from-emerald-50 to-teal-50",
    border: "border-emerald-200",
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
    btn: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600",
    glow: "hover:shadow-[0_12px_36px_rgba(16,185,129,0.25)]",
  },
  purple: {
    gradient: "from-purple-50 to-violet-50",
    border: "border-purple-200",
    iconBg: "bg-gradient-to-br from-purple-500 to-violet-500",
    btn: "bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600",
    glow: "hover:shadow-[0_12px_36px_rgba(139,92,246,0.25)]",
  },
  rose: {
    gradient: "from-rose-50 to-pink-50",
    border: "border-rose-200",
    iconBg: "bg-gradient-to-br from-rose-500 to-pink-500",
    btn: "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600",
    glow: "hover:shadow-[0_12px_36px_rgba(244,63,94,0.25)]",
  },
};

interface Props {
  classes: LiveClass[];
}

export default function LiveClassesSection({ classes }: Props) {
  return (
    <section id="live-classes">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-[0_4px_16px_rgba(244,63,94,0.35)]">
            <Video className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Today's Live Classes</h2>
            <p className="text-xs font-semibold text-slate-500">Join your sessions</p>
          </div>
          {classes.some((cls) => cls.isLive) && (
            <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-3 py-1 text-[10px] font-black text-white shadow-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              LIVE NOW
            </span>
          )}
        </div>
        <a
          href="/student-dashboard/live-classes"
          className="flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-black text-purple-700 transition hover:bg-purple-100"
        >
          View All
        </a>
      </div>

      {classes.length === 0 ? (
        <div className="rounded-3xl border-2 border-white/80 bg-white/70 p-6 text-sm font-semibold text-slate-500 shadow-[0_4px_20px_rgba(168,85,247,0.08)] backdrop-blur-sm">
          No live classes are scheduled yet.
        </div>
      ) : (
      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {classes.map((cls, i) => {
          const colors = colorMap[cls.color] ?? colorMap.blue;
          const SubjectIcon = subjectIcons[cls.subject] ?? BookOpen;

          return (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ y: -5 }}
              className={`relative flex min-w-[270px] flex-col gap-4 rounded-3xl border-2 ${colors.border} bg-gradient-to-br ${colors.gradient} p-5 shadow-[0_4px_20px_rgba(168,85,247,0.08)] transition-all ${colors.glow}`}
            >
              {/* Live Badge */}
              {cls.isLive && (
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-2.5 py-1 text-[10px] font-black text-white shadow-[0_4px_12px_rgba(244,63,94,0.4)]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                  LIVE
                </div>
              )}

              {/* Subject Icon + Name */}
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colors.iconBg} text-white shadow-md`}>
                  <SubjectIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">{cls.subject}</p>
                  <p className="text-xs font-semibold text-slate-500">{cls.topic}</p>
                </div>
              </div>

              {/* Meta */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <User className="h-3 w-3" />
                  <span className="font-semibold">{cls.teacher}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span className="font-semibold">{cls.time}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Video className="h-3 w-3" />
                    <span className="font-semibold">{cls.duration}</span>
                  </span>
                </div>
              </div>

              {/* Join Button */}
              <button
                className={`flex items-center justify-center gap-2 rounded-2xl py-2.5 text-xs font-black text-white shadow-md transition hover:-translate-y-0.5 ${colors.btn} ${
                  cls.isLive ? "shadow-[0_6px_20px_rgba(244,63,94,0.35)]" : ""
                }`}
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                {cls.isLive ? "Join Now" : "Set Reminder"}
              </button>
            </motion.div>
          );
        })}
      </div>
      )}
    </section>
  );
}
