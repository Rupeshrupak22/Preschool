"use client";

import DashboardLayout from "@/components/student-dashboard/DashboardLayout";
import TestResultsPanel from "@/components/student-dashboard/TestResultsPanel";
import { useDashboardData } from "@/lib/dashboard/use-dashboard-data";

export default function TestsPage() {
  const data = useDashboardData();

  return (
    <DashboardLayout activeSection="/student-dashboard/tests">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-950">Tests & Quizzes</h1>
          <p className="mt-1 text-sm text-slate-400">Your test history and upcoming assessments</p>
        </div>
        <TestResultsPanel results={data.testResults} upcoming={data.upcomingQuizzes} />
      </div>
    </DashboardLayout>
  );
}
