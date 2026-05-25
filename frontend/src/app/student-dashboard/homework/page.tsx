"use client";

import DashboardLayout from "@/components/student-dashboard/DashboardLayout";
import HomeworkSection from "@/components/student-dashboard/HomeworkSection";
import SubjectPerformanceTable from "@/components/student-dashboard/SubjectPerformanceTable";
import { useDashboardData } from "@/lib/dashboard/use-dashboard-data";

export default function HomeworkPage() {
  const data = useDashboardData();

  return (
    <DashboardLayout activeSection="/student-dashboard/homework">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-black text-slate-950">Homework</h1>
          <p className="mt-1 text-sm text-slate-400">Track all your assignments and submissions</p>
        </div>
        <HomeworkSection items={data.homeworkItems} />
        <SubjectPerformanceTable subjects={data.subjectPerformance} />
      </div>
    </DashboardLayout>
  );
}
