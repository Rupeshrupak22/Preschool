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

const colorMap: Record<string, { bg: string; border: string; badge: string; btn: string }> = {
  blue: {
    bg: "from-blue-50 to-indigo-50",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    btn: "bg-blue-600 hover:bg-blue-700",
  },
  emerald: {
    bg: "from-emerald-50 to-teal-50",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    btn: "bg-emerald-600 hover:bg-emerald-700",
  },
  purple: {
    bg: "from-purple-50 to-violet-50",
    border: "border-purple-200",
    badge: "bg-purple-100 text-purple-700",
    btn: "bg-purple-600 hover:bg-purple-700",
  },
  rose: {
    bg: "from-rose-50 to-pink-50",
    border: "border-rose-200",
    badge: "bg-rose-100 text-rose-700",
    btn: "bg-rose-600 hover:bg-rose-700",
  },
};

interface Props {
  classes: LiveClass[];
}

export default function LiveClassesSection({ classes }: Props) {
  return (
    <section id="live-classes">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-black text-slate-950">Today's Live Classes</h2>
          <span className="flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-black text-rose-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" />
            LIVE NOW
          </span>
        </div>
        <button className="text-xs font-bold text-blue-600 hover:text-blue-800 transition">View All →</button>
      </div>

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
              whileHover={{ y: -4 }}
              className={`relative flex min-w-[260px] flex-col gap-3 rounded-2xl border bg-gradient-to-br ${colors.bg} ${colors.border} p-4 shadow-[0_4px_20px_rgba(15,23,42,0.07)] transition-shadow hover:shadow-[0_8px_32px_rgba(15,23,42,0.12)]`}
            >
              {/* Live Badge */}
              {cls.isLive && (
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-black text-white shadow">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                  LIVE
                </div>
              )}

              {/* Subject Icon + Name */}
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.badge}`}>
                  <SubjectIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-950">{cls.subject}</p>
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
                className={`flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-black text-white shadow-md transition hover:-translate-y-0.5 ${colors.btn} ${
                  cls.isLive ? "shadow-[0_4px_16px_rgba(239,68,68,0.3)]" : ""
                }`}
              >
                <Play className="h-3 w-3 fill-current" />
                {cls.isLive ? "Join Now" : "Set Reminder"}
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
