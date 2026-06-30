"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  Flame,
  Gamepad2,
  Medal,
  Search,
  Sparkles,
  Star,
  Target,
  Trophy,
} from "lucide-react";
import DashboardLayout from "@/components/student-dashboard/DashboardLayout";
import QuickAccessGrid from "@/components/student-dashboard/QuickAccessGrid";
import LiveClassesSection from "@/components/student-dashboard/LiveClassesSection";
import PerformanceOverview from "@/components/student-dashboard/PerformanceOverview";
import CircularPerformanceChart from "@/components/student-dashboard/CircularPerformanceChart";
import PerformanceTrendChart from "@/components/student-dashboard/PerformanceTrendChart";
import AchievementsPanel from "@/components/student-dashboard/AchievementsPanel";
import { useDashboardData } from "@/lib/dashboard/use-dashboard-data";
import { MessageSystem } from "@/components/MessageSystem";

function numberFromStat(value?: string) {
  const match = value?.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

export default function StudentDashboardHome() {
  const data = useDashboardData();

  const overallScore = data.subjectPerformance.length
    ? Math.round(
        data.subjectPerformance.reduce((sum: number, subject: { score: number }) => sum + subject.score, 0) /
          data.subjectPerformance.length
      )
    : data.weeklyProgress.score;

  const firstName = data.studentData.name.split(" ")[0] || "Student";
  const homeworkCard = data.quickAccessCards.find((card) => card.id === "homework");
  const liveCard = data.quickAccessCards.find((card) => card.id === "live-classes");
  const earnedBadges = data.achievements.filter((achievement) => achievement.earned).length;
  const unreadNotifications = data.notifications.filter((notification) => notification.status !== "read").length;
  const courseCount = data.courses.length || numberFromStat(data.quickAccessCards.find((card) => card.id === "skills")?.stat);
  const questCount = numberFromStat(homeworkCard?.stat) + data.upcomingQuizzes.length;
  const rankText = data.studentData.rank > 0 ? `#${data.studentData.rank}` : "-";

  const [showNotifications, setShowNotifications] = useState(false);

  const heroStats = [
    {
      label: "Lessons",
      value: String(courseCount),
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Quests",
      value: String(questCount),
      icon: Target,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Rank",
      value: rankText,
      icon: Trophy,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  const todayCards = [
    {
      label: "Live Now",
      value: liveCard?.stat ?? "0",
      icon: CalendarDays,
      accent: "from-rose-500 to-pink-500",
    },
    {
      label: "Streak",
      value: `${data.weeklyProgress.streak}`,
      icon: Flame,
      accent: "from-orange-500 to-amber-500",
    },
    {
      label: "XP",
      value: `${data.gamifiedStats.xp}`,
      icon: Gamepad2,
      accent: "from-cyan-500 to-blue-500",
    },
  ];

  return (
    <>
    <DashboardLayout activeSection="/student-dashboard">
      <div className="space-y-8">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-gradient-to-br from-white via-blue-50 to-indigo-100 px-5 pb-16 pt-6 shadow-[0_24px_70px_rgba(59,130,246,0.16)] sm:px-7 lg:min-h-[300px] lg:px-9"
        >
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {data.studentData.avatarUrl ? (
                    <img src={data.studentData.avatarUrl} alt="Avatar" className="h-14 w-14 rounded-2xl object-cover shadow-[0_10px_30px_rgba(168,85,247,0.35)]" />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-base font-black text-white shadow-[0_10px_30px_rgba(168,85,247,0.35)]">
                      {data.studentData.avatar}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-500">Student Dashboard</p>
                    <h1 className="mt-1 text-3xl font-black leading-tight text-slate-950 md:text-4xl">
                      Hi, {firstName}
                    </h1>
                  </div>
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-white text-slate-700 shadow-[0_10px_26px_rgba(37,99,235,0.12)] transition hover:-translate-y-0.5 hover:text-blue-600"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white ring-2 ring-white">
                        {unreadNotifications}
                      </span>
                    )}
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 top-14 z-50 w-80 rounded-2xl border border-slate-100 bg-white p-0 shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
                      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                        <h3 className="text-sm font-black text-slate-900">Notifications ({data.notifications.length})</h3>
                        <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-700 text-lg">&times;</button>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {data.notifications.length === 0 ? (
                          <p className="py-8 text-center text-xs text-slate-400">No notifications yet</p>
                        ) : (
                          data.notifications.map((n) => (
                            <div key={n.id} className={`border-b border-slate-50 px-4 py-3 transition hover:bg-slate-50 ${n.status !== "read" ? "bg-blue-50/50" : ""}`}>
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-slate-800">{n.title}</p>
                                <p className="text-[10px] text-slate-400">{n.createdAt}</p>
                              </div>
                              <p className="mt-1 text-xs text-slate-600 line-clamp-2">{n.message}</p>
                              <span className="mt-1 inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-500">{n.channel}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <p className="max-w-2xl text-sm font-semibold leading-6 text-slate-600 md:text-base">
                {data.studentData.class} · {data.studentData.section} · {data.studentData.academicYear}
              </p>
              <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-slate-500">
                {data.studentData.aiInsight}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="/student-dashboard/my-courses"
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-[0_16px_36px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Continue Learning
                  <ArrowRight className="h-4 w-4" />
                </a>
                <span className="inline-flex items-center gap-2 rounded-2xl border border-emerald-100 bg-white/80 px-4 py-3 text-sm font-black text-emerald-700 shadow-[0_10px_24px_rgba(16,185,129,0.12)]">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {earnedBadges ? `${earnedBadges} badges earned` : "New learner"}
                </span>
              </div>
            </div>

            <div className="relative hidden min-h-[220px] lg:block">
              <div className="absolute bottom-0 right-3 h-56 w-56 rounded-[2rem] bg-white/70 shadow-[0_24px_60px_rgba(37,99,235,0.16)]" />
              {data.studentData.avatarUrl ? (
                <img
                  src={data.studentData.avatarUrl}
                  alt="Student"
                  className="absolute bottom-0 right-0 h-[260px] w-[260px] rounded-[2rem] object-cover"
                />
              ) : (
                <Image
                  src="/assets/primary-student.png"
                  alt="Student learning"
                  width={320}
                  height={320}
                  priority
                  className="absolute bottom-0 right-0 h-[260px] w-auto object-contain"
                />
              )}
              <div className="absolute left-0 top-5 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-[0_16px_34px_rgba(124,58,237,0.16)]">
                <div className="flex items-center gap-2">
                  <Medal className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Class Rank</p>
                    <p className="text-lg font-black text-slate-950">{rankText}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/90 to-transparent" />
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.4 }}
          className="-mt-14 px-2 sm:px-5"
        >
          <div className="grid gap-3 rounded-[1.75rem] border border-white/90 bg-white/90 p-3 shadow-[0_20px_50px_rgba(79,70,229,0.13)] backdrop-blur md:grid-cols-[1.2fr_1fr]">
            <div className="flex min-h-14 items-center gap-3 rounded-2xl bg-slate-50 px-4">
              <Search className="h-5 w-5 text-slate-400" />
              <span className="text-sm font-bold text-slate-400">Search courses, notes, classes...</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {heroStats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                    <stat.icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-base font-black leading-none text-slate-950">{stat.value}</p>
                    <p className="mt-1 truncate text-[10px] font-black uppercase tracking-wider text-slate-400">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <QuickAccessGrid cards={data.quickAccessCards} />

        <section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
          <LiveClassesSection classes={data.liveClasses} />

          <div className="rounded-[1.75rem] border border-white/80 bg-white/80 p-5 shadow-[0_16px_44px_rgba(59,130,246,0.10)] backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-950">Today</h2>
                <p className="text-xs font-bold text-slate-500">Live from your school records</p>
              </div>
              <Sparkles className="h-5 w-5 text-purple-500" />
            </div>
            <div className="grid gap-3">
              {todayCards.map((card) => (
                <div key={card.label} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.accent} text-white`}>
                      <card.icon className="h-5 w-5" />
                    </span>
                    <p className="text-sm font-black text-slate-700">{card.label}</p>
                  </div>
                  <p className="text-lg font-black text-slate-950">{card.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PerformanceOverview data={data} />

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

        <AchievementsPanel achievements={data.achievements} />
      </div>
    </DashboardLayout>
      <MessageSystem
        userEmail={data.studentData.name ?? "student@adyapan.com"}
        userRole="student"
      />
    </>
  );
}                                               
