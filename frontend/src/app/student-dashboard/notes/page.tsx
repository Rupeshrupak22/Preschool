"use client";

import DashboardLayout from "@/components/student-dashboard/DashboardLayout";
import NotesLibrary from "@/components/student-dashboard/NotesLibrary";
import { notesLibrary } from "@/lib/dashboard/dashboard-data";

export default function NotesPage() {
  return (
    <DashboardLayout activeSection="/student-dashboard/notes">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-950">Notes & PDFs</h1>
          <p className="mt-1 text-sm text-slate-400">All your study materials in one place</p>
        </div>
        <NotesLibrary notes={notesLibrary} />
      </div>
    </DashboardLayout>
  );
}
