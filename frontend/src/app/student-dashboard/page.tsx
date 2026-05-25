"use client";

import DashboardLayout from "@/components/student-dashboard/DashboardLayout";
import QuickAccessGrid from "@/components/student-dashboard/QuickAccessGrid";
import LiveClassesSection from "@/components/student-dashboard/LiveClassesSection";
import WeeklyProgressCard from "@/components/student-dashboard/WeeklyProgressCard";
import MetricCards from "@/components/student-dashboard/MetricCards";
import CircularPerformanceChart from "@/components/student-dashboard/CircularPerformanceChart";
import PerformanceTrendChart from "@/components/student-dashboard/PerformanceTrendChart";
import AchievementsPanel from "@/components/student-dashboard/AchievementsPanel";
import AiLabPreview from "@/components/student-dashboard/AiLabPreview";
import DailyNewsPreview from "@/components/student-dashboard/DailyNewsPreview";
import {
  quickAccessCards,
  liveClasses,
  metricCards,
  subjectPerformance,
  achievements,
  performanceTrend,
  circularPerformanceData,
  weeklyProgress,
} from "@/lib/dashboard/dashboard-data";

export default function StudentDashboardHome() {
  const overallScore = Math.round(
    subjectPerformance.reduce((sum: number, s: { score: number }) => sum + s.score, 0) /
      subjectPerformance.length
  );

  return (
    <DashboardLayout activeSection="/student-dashboard">
      <div className="space-y-8">

        {/* Quick Access */}
        <QuickAccessGrid cards={quickAccessCards} />

        {/* AI Lab Preview */}
        <AiLabPreview />

        {/* Live Classes Preview */}
        <LiveClassesSection classes={liveClasses} />

        {/* Weekly Progress + Metric Cards */}
        <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
          <WeeklyProgressCard
            score={weeklyProgress.score}
            consistency={weeklyProgress.consistency}
            classPercentile={weeklyProgress.classPercentile}
          />
          <MetricCards cards={metricCards} />
        </div>

        {/* Mini Analytics */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-black text-slate-950">360° Performance Analytics</h2>
            <p className="mt-0.5 text-xs text-slate-400">Comprehensive view of your academic journey</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <CircularPerformanceChart data={circularPerformanceData} overallScore={overallScore} />
            <PerformanceTrendChart data={performanceTrend} />
          </div>
        </section>

        {/* Daily News Preview */}
        <DailyNewsPreview />

        {/* Achievements */}
        <AchievementsPanel achievements={achievements} />

      </div>
    </DashboardLayout>
  );
}
