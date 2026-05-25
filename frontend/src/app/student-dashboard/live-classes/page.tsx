"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import DashboardLayout from "@/components/student-dashboard/DashboardLayout";
import LiveClassesSection from "@/components/student-dashboard/LiveClassesSection";
import { useDashboardData } from "@/lib/dashboard/use-dashboard-data";

export default function LiveClassesPage() {
  const data = useDashboardData();

  return (
    <DashboardLayout activeSection="/student-dashboard/live-classes">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-black text-slate-950">Live Classes</h1>
          <p className="mt-1 text-sm text-slate-400">Join live sessions and view your weekly schedule</p>
        </div>

        {/* Today's classes */}
        <LiveClassesSection classes={data.liveClasses} />

        {/* Weekly Schedule */}
        <section>
          <h2 className="mb-4 text-lg font-black text-slate-950">Weekly Schedule</h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {data.weeklySchedule.map((day, i) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.06)]"
              >
                <div className="mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-black text-slate-950">{day.day}</span>
                </div>
                <div className="space-y-2">
                  {day.classes.map((cls) => (
                    <div key={cls} className="flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      <span className="text-[11px] font-semibold text-slate-600">{cls}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
