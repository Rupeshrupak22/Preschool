"use client";

import { motion } from "framer-motion";
import { Star, Flame, Trophy, ArrowRight } from "lucide-react";
import DashboardLayout from "@/components/student-dashboard/DashboardLayout";
import QuickAccessGrid from "@/components/student-dashboard/QuickAccessGrid";
import LiveClassesSection from "@/components/student-dashboard/LiveClassesSection";
import PerformanceOverview from "@/components/student-dashboard/PerformanceOverview";
import CircularPerformanceChart from "@/components/student-dashboard/CircularPerformanceChart";
import PerformanceTrendChart from "@/components/student-dashboard/PerformanceTrendChart";
import AchievementsPanel from "@/components/student-dashboard/AchievementsPanel";
import { useDashboardData } from "@/lib/dashboard/use-dashboard-data";

export default function StudentDashboardHome() {
  const data = useDashboardData();

  const overallScore = data.subjectPerformance.length
    ? Math.round(
        data.subjectPerformance.reduce((sum: number, s: { score: number }) => sum + s.score, 0) /
          data.subjectPerformance.length
      )
    : 0;
  const attendanceCard = data.quickAccessCards.find((card) => card.id === "attendance");
  const earnedBadges = data.achievements.filter((achievement) => achievement.earned).length;

  return (
    <DashboardLayout activeSection="/student-dashboard">
      <div className="space-y-8">

        {/* ── Hero Greeting Banner ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white"
          style={{
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 35%, #a855f7 65%, #ec4899 100%)",
            boxShadow: "0 20px 60px rgba(168,85,247,0.4)",
          }}
        >
          {/* Blobs */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-10 left-1/3 h-40 w-40 rounded-full bg-white/8" />
          <div className="pointer-events-none absolute right-1/4 top-4 h-20 w-20 rounded-full bg-pink-400/20" />

          {/* Floating emoji */}
          <div className="pointer-events-none absolute right-8 top-6 hidden text-4xl sm:block" style={{ animation: "bounce 2s infinite" }}>🎓</div>

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Left */}
            <div>
              {/* Chips */}
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-black backdrop-blur-sm">
                  <Star className="h-3 w-3 fill-yellow-300 text-yellow-300" />
                  {data.studentData.rank > 0 ? `Rank #${data.studentData.rank}` : "No rank yet"} of {data.studentData.totalStudents}
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-black backdrop-blur-sm">
                  <Flame className="h-3 w-3 text-orange-300" />
                  {data.weeklyProgress.streak}-day streak
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-black backdrop-blur-sm">
                  <Trophy className="h-3 w-3 text-yellow-300" />
                  {earnedBadges > 0 ? `${earnedBadges} badges earned` : "New learner"}
                </span>
              </div>

              <h1 className="text-3xl font-black leading-tight md:text-4xl">
                Welcome back, {data.studentData.name.split(" ")[0]}! 👋
              </h1>
              <p className="mt-2 text-sm font-semibold text-white/75">
                {data.studentData.class} · {data.studentData.section} · {data.studentData.academicYear}
              </p>

              <a
                href="/student-dashboard/my-courses"
                className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-sm font-black text-purple-700 shadow-[0_8px_24px_rgba(255,255,255,0.25)] transition hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(255,255,255,0.35)]"
              >
                Continue Learning <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* Right — floating stat cards */}
            <div className="flex gap-3 sm:flex-col sm:gap-3">
              {[
                { label: "Overall Score", value: `${overallScore}%`, emoji: "📊" },
                { label: "Attendance", value: attendanceCard?.stat ?? "0%", emoji: "OK" },
                { label: "Badges Earned", value: String(earnedBadges), emoji: "Trophy" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex min-w-[80px] flex-col items-center rounded-2xl bg-white/15 px-4 py-3 text-center backdrop-blur-sm"
                >
                  <span className="text-xl">{stat.emoji}</span>
                  <p className="mt-1 text-lg font-black leading-none">{stat.value}</p>
                  <p className="mt-0.5 text-[10px] font-bold text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Quick Access ─────────────────────────────────────────── */}
        <QuickAccessGrid cards={data.quickAccessCards} />

        {/* ── Live Classes ─────────────────────────────────────────── */}
        <LiveClassesSection classes={data.liveClasses} />

        {/* ── Performance Overview (new premium analytics) ─────────── */}
        <PerformanceOverview data={data} />

        {/* ── 360° Analytics Charts ────────────────────────────────── */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-black text-slate-900">360° Analytics</h2>
            <p className="mt-0.5 text-xs font-semibold text-slate-500">Subject distribution and growth trend</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <CircularPerformanceChart data={data.circularPerformanceData} overallScore={overallScore} />
            <PerformanceTrendChart data={data.performanceTrend} />
          </div>
        </section>

        {/* ── Achievements ─────────────────────────────────────────── */}
        <AchievementsPanel achievements={data.achievements} />

      </div>
    </DashboardLayout>
  );
}

