"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bell,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  ClipboardList,
  Copy,
  FileImage,
  FileText,
  Gamepad2,
  HelpCircle,
  Home,
  Lock,
  LogOut,
  Map,
  MessageSquare,
  PenLine,
  PlayCircle,
  Plus,
  RefreshCw,
  Rocket,
  Search,
  TrendingUp,
  Trophy,
  Users,
  Video,
} from "lucide-react";
import { broadcastLogout, onAuthChange } from "@/lib/auth-channel";
import { useSessionHeartbeat } from "@/lib/use-session-heartbeat";
import { MessageSystem } from "@/components/MessageSystem";

type TeacherStudent = {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  classLevel?: string | null;
  schoolName?: string | null;
  createdAt?: string | null;
};

type TeacherDoubt = {
  id: string;
  studentEmail?: string | null;
  studentName?: string | null;
  classLevel?: string | null;
  subject?: string | null;
  question?: string | null;
  attachmentName?: string | null;
  attachmentType?: string | null;
  status?: string | null;
  replyText?: string | null;
  createdAt?: string | null;
  repliedAt?: string | null;
};

type TeacherHomework = {
  id: string;
  title?: string | null;
  subject?: string | null;
  classLevel?: string | null;
  dueDate?: string | null;
  priority?: string | null;
  status?: string | null;
  createdAt?: string | null;
};

type TeacherNote = {
  id: string;
  title?: string | null;
  subject?: string | null;
  classLevel?: string | null;
  fileName?: string | null;
  fileSize?: string | null;
  createdAt?: string | null;
};

type TeacherDashboard = {
  teacher: {
    id: string;
    name: string;
    email: string;
    schoolId: string;
    schoolName: string;
    subject: string;
    phone?: string | null;
    assignedClasses: string[];
    lastLoginAt?: string | null;
  };
  stats: {
    students: number;
    classes: number;
    upcomingClasses: number;
    certificates: number;
    activeLogins: number;
    homework: number;
    notes: number;
    pendingDoubts: number;
    notifications: number;
  };
  classBreakdown: Array<{ classLevel: string; total: number }>;
  students: TeacherStudent[];
  schedule: Array<Record<string, string | number | null>>;
  homework: TeacherHomework[];
  notes: TeacherNote[];
  doubts: TeacherDoubt[];
  notifications: Array<Record<string, string | number | null>>;
};

type ActiveView = "home" | "syllabus" | "roadmap" | "leaderboard" | "doubts";
type HubTab = "classroom" | "academics";
type ActionMode = "homework" | "note";

const subjects = ["Mathematics", "Science", "English"];

const syllabusBySubject = {
  Mathematics: [
    ["Arithmetic Basics", "BODMAS Foundations", "done"],
    ["BODMAS Balancer", "Equation Balancing", "active"],
    ["Fraction Arcade", "Division & Pieces", "locked"],
    ["Algebra Quest", "Find the Unknown X", "locked"],
  ],
  Science: [
    ["Plant Life", "Observation and Growth", "done"],
    ["Water Cycle", "Evaporation and Rain", "active"],
    ["Simple Machines", "Push, Pull, Lift", "locked"],
    ["Human Body", "Senses and Care", "locked"],
  ],
  English: [
    ["Phonics Warmup", "Sounds and Blends", "done"],
    ["Story Builder", "Characters and Events", "active"],
    ["Word Arcade", "Vocabulary Practice", "locked"],
    ["Speaking Circle", "Confidence Practice", "locked"],
  ],
} as const;

const roadmapItems = [
  ["Spoken English", "Build confidence, vocabulary, and grammar for fluent everyday conversations.", "done"],
  ["Puzzles", "Enhance logical reasoning, analytical skills, and pattern recognition.", "done"],
  ["Habit tracker", "Form positive daily habits, self-discipline, and track personal goals.", "active"],
  ["Basic Digital Literacy", "Foundational computer skills, internet safety, and interactive learning.", "locked"],
  ["General Knowledge", "Explore world geography, history, general science, and current events.", "locked"],
  ["Show & Tell / Storytelling", "Learn public speaking confidence, expression, and story narrative structure.", "locked"],
  ["Olympiads worksheets", "Practice worksheets tailored for Math and Olympiads.", "locked"],
] as const;

const navItems: Array<{ id: ActiveView; label: string; icon: typeof Home }> = [
  { id: "home", label: "Home", icon: Home },
  { id: "syllabus", label: "Syllabus", icon: ClipboardList },
  { id: "roadmap", label: "Career Roadmap", icon: Map },
  { id: "leaderboard", label: "Leaderboard", icon: Gamepad2 },
];

function initials(name?: string | null) {
  return String(name || "T").trim().charAt(0).toUpperCase() || "T";
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function relativeTime(value?: string | number | null) {
  if (!value) return "Just now";
  const time = new Date(String(value)).getTime();
  if (Number.isNaN(time)) return String(value);
  const diff = Math.max(0, Date.now() - time);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} mins ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return new Date(time).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function cleanText(value: unknown, fallback = "") {
  return String(value ?? fallback).trim();
}

export default function TeacherDashboardPage() {
  const [dashboard, setDashboard] = useState<TeacherDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [activeView, setActiveView] = useState<ActiveView>("home");
  const [hubTab, setHubTab] = useState<HubTab>("classroom");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [subject, setSubject] = useState<keyof typeof syllabusBySubject>("Mathematics");
  const [actionMode, setActionMode] = useState<ActionMode>("homework");
  const [submitting, setSubmitting] = useState(false);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    subject: "Mathematics",
    title: "",
    description: "",
    classLevel: "",
    dueDate: "",
    priority: "medium",
    fileName: "",
    fileSize: "",
  });

  async function loadDashboard() {
    setLoading(true);
    setStatus("");
    const response = await fetch("/api/teacher/dashboard", { cache: "no-store" });
    const data = await response.json().catch(() => ({}));

    if (response.status === 401) {
      window.location.href = "/teacher/login";
      return;
    }

    if (!response.ok) {
      setStatus(data.error ?? "Dashboard could not be loaded.");
      setLoading(false);
      return;
    }

    setDashboard(data);
    setLoading(false);
  }

  async function logout() {
    await fetch("/api/teacher/logout", { method: "POST" });
    broadcastLogout();
    window.location.href = "/teacher/login";
  }

  async function submitTeacherAction() {
    if (!form.title.trim()) {
      setStatus("Title required.");
      return;
    }

    setSubmitting(true);
    setStatus("");
    const response = await fetch("/api/teacher/classroom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: actionMode,
        subject: form.subject,
        title: form.title,
        description: form.description,
        classLevel: form.classLevel,
        dueDate: form.dueDate,
        priority: form.priority,
        fileName: form.fileName,
        fileSize: form.fileSize,
      }),
    });
    const data = await response.json().catch(() => ({}));
    setSubmitting(false);

    if (!response.ok) {
      setStatus(data.error ?? "Action failed.");
      return;
    }

    setStatus(`${actionMode === "homework" ? "Homework" : "Note"} sent to ${data.result?.notified ?? 0} student(s).`);
    setForm((current) => ({ ...current, title: "", description: "", dueDate: "", fileName: "", fileSize: "" }));
    await loadDashboard();
  }

  async function replyToDoubt(doubtId: string) {
    const replyText = replyDrafts[doubtId]?.trim();
    if (!replyText) {
      setStatus("Reply required.");
      return;
    }

    setSubmitting(true);
    const response = await fetch("/api/teacher/classroom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reply-doubt", doubtId, replyText }),
    });
    const data = await response.json().catch(() => ({}));
    setSubmitting(false);

    if (!response.ok) {
      setStatus(data.error ?? "Reply failed.");
      return;
    }

    setReplyDrafts((current) => ({ ...current, [doubtId]: "" }));
    setStatus("Doubt solved and student notified.");
    await loadDashboard();
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  useSessionHeartbeat({ checkUrl: "/api/teacher/me", loginUrl: "/teacher/login", enabled: !!dashboard });

  useEffect(() => {
    const cleanup = onAuthChange((message) => {
      if (message.type === "logout") window.location.href = "/teacher/login";
    });
    return cleanup;
  }, []);

  const filteredStudents = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!dashboard) return [];
    if (!text) return dashboard.students;
    return dashboard.students.filter((student) =>
      [student.name, student.email, student.phone, student.classLevel]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(text)
    );
  }, [dashboard, query]);

  const classOptions = useMemo(() => {
    if (!dashboard) return [];
    return Array.from(
      new Set([
        ...dashboard.teacher.assignedClasses,
        ...dashboard.classBreakdown.map((item) => item.classLevel),
        ...dashboard.students.map((student) => cleanText(student.classLevel)).filter(Boolean),
      ])
    );
  }, [dashboard]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#eef4ff]">
        <div className="rounded-[28px] bg-white px-8 py-7 text-center shadow-xl shadow-blue-100">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-4 text-sm font-black text-slate-700">Loading teacher dashboard...</p>
        </div>
      </main>
    );
  }

  if (!dashboard) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#eef4ff]">
        <div className="mx-5 max-w-md rounded-[28px] bg-white p-8 text-center shadow-xl shadow-blue-100">
          <p className="text-base font-black text-slate-900">{status || "Dashboard not available."}</p>
          <a href="/teacher/login" className="mt-5 inline-flex rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white">
            Back to Login
          </a>
        </div>
      </main>
    );
  }

  const pendingDoubts = dashboard.doubts.filter((doubt) => doubt.status !== "solved");
  const solvedDoubts = dashboard.doubts.filter((doubt) => doubt.status === "solved");
  const studentPreview = dashboard.students.slice(0, 3).map((student) => student.name).filter(Boolean).join(", ");

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <div className="mx-auto min-h-screen max-w-[560px] overflow-hidden bg-[linear-gradient(180deg,#eef5ff_0%,#e9eeff_48%,#fff2f8_100%)] shadow-2xl shadow-slate-200 lg:my-6 lg:rounded-[32px]">
        {drawerOpen && (
          <TeacherDrawer
            dashboard={dashboard}
            onClose={() => setDrawerOpen(false)}
            onLogout={logout}
            setActiveView={(view) => {
              setActiveView(view);
              setDrawerOpen(false);
            }}
          />
        )}

        {activeView === "home" && (
          <HomeView
            dashboard={dashboard}
            hubTab={hubTab}
            setHubTab={setHubTab}
            query={query}
            setQuery={setQuery}
            onOpenDrawer={() => setDrawerOpen(true)}
            setActiveView={setActiveView}
            actionMode={actionMode}
            setActionMode={setActionMode}
            form={form}
            setForm={(patch) => setForm((current) => ({ ...current, ...patch }))}
            classOptions={classOptions}
            submitting={submitting}
            onSubmitAction={submitTeacherAction}
            status={status}
            studentPreview={studentPreview}
            pendingDoubts={pendingDoubts}
          />
        )}

        {activeView === "syllabus" && (
          <SyllabusView subject={subject} setSubject={setSubject} items={syllabusBySubject[subject]} />
        )}

        {activeView === "roadmap" && <RoadmapView />}

        {activeView === "leaderboard" && <LeaderboardView students={filteredStudents} />}

        {activeView === "doubts" && (
          <DoubtsView
            doubts={dashboard.doubts}
            pendingDoubts={pendingDoubts}
            solvedDoubts={solvedDoubts}
            replyDrafts={replyDrafts}
            setReplyDrafts={setReplyDrafts}
            onReply={replyToDoubt}
            submitting={submitting}
            status={status}
            setActiveView={setActiveView}
          />
        )}

        {activeView !== "doubts" && <BottomNav activeView={activeView} setActiveView={setActiveView} />}
      </div>

      {/* Messaging System */}
      <MessageSystem
        userEmail={dashboard.teacher.email}
        userRole="teacher"
        recipients={[
          { label: "All Admins", value: "all-admins" },
          { label: "All Principals", value: "all-principals" },
          { label: "All Students", value: "all-students" },
          ...dashboard.students.map((s) => ({
            label: `${s.name} (Student)`,
            value: `student:${s.email}`,
          })),
        ]}
      />
    </main>
  );
}

function TeacherDrawer({
  dashboard,
  onClose,
  onLogout,
  setActiveView,
}: {
  dashboard: TeacherDashboard;
  onClose: () => void;
  onLogout: () => void;
  setActiveView: (view: ActiveView) => void;
}) {
  const menu = [
    { label: "Supervision Hub", icon: Home, view: "home" as ActiveView },
    { label: "Syllabus Pathway", icon: ClipboardList, view: "syllabus" as ActiveView },
    { label: "Career Roadmap", icon: Map, view: "roadmap" as ActiveView },
    { label: "Leaderboard Rankings", icon: Gamepad2, view: "leaderboard" as ActiveView },
    { label: "Class Progress Metrics", icon: TrendingUp, view: "home" as ActiveView },
    { label: "Feedback", icon: MessageSquare, view: "doubts" as ActiveView },
  ];

  return (
    <div className="fixed inset-0 z-50 mx-auto max-w-[560px]">
      <button aria-label="Close drawer" className="absolute inset-0 bg-black/55" onClick={onClose} />
      <aside className="absolute left-0 top-0 h-full w-[78%] min-w-[310px] max-w-[430px] overflow-hidden bg-[#edf4ff] shadow-2xl">
        <div className="rounded-br-[38px] bg-[#126bef] px-8 pb-9 pt-8 text-white">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-[4px] border-white bg-orange-400 text-3xl font-black shadow-lg">
            {initials(dashboard.teacher.name)}
          </div>
          <div className="mt-6 flex items-end justify-between gap-4">
            <div className="min-w-0">
              <h2 className="truncate text-3xl font-black">{dashboard.teacher.name}</h2>
              <p className="truncate text-lg font-semibold text-blue-100">{dashboard.teacher.email}</p>
            </div>
            <ChevronIcon />
          </div>
        </div>

        <div className="px-6 py-7">
          <div className="rounded-[24px] bg-white px-5 py-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between text-sm font-black">
              <span className="text-blue-950">Class Average</span>
              <span className="text-slate-400">Level 3.4</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-[68%] bg-slate-400" />
            </div>
          </div>

          <div className="mt-7 space-y-4">
            {menu.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveView(item.view)}
                className="flex h-[70px] w-full items-center gap-5 rounded-[22px] bg-white px-6 text-left text-lg font-black text-slate-950 shadow-sm transition active:scale-[0.99]"
              >
                <item.icon className="h-6 w-6 text-blue-600" />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-white px-8 py-7">
          <button onClick={onLogout} className="flex items-center gap-4 text-xl font-black text-rose-500">
            <LogOut className="h-6 w-6" />
            Switch Profile / Logout
          </button>
        </div>
      </aside>
    </div>
  );
}

function HomeView({
  dashboard,
  hubTab,
  setHubTab,
  query,
  setQuery,
  onOpenDrawer,
  setActiveView,
  actionMode,
  setActionMode,
  form,
  setForm,
  classOptions,
  submitting,
  onSubmitAction,
  status,
  studentPreview,
  pendingDoubts,
}: {
  dashboard: TeacherDashboard;
  hubTab: HubTab;
  setHubTab: (tab: HubTab) => void;
  query: string;
  setQuery: (value: string) => void;
  onOpenDrawer: () => void;
  setActiveView: (view: ActiveView) => void;
  actionMode: ActionMode;
  setActionMode: (mode: ActionMode) => void;
  form: {
    subject: string;
    title: string;
    description: string;
    classLevel: string;
    dueDate: string;
    priority: string;
    fileName: string;
    fileSize: string;
  };
  setForm: (patch: Partial<typeof form>) => void;
  classOptions: string[];
  submitting: boolean;
  onSubmitAction: () => void;
  status: string;
  studentPreview: string;
  pendingDoubts: TeacherDoubt[];
}) {
  return (
    <div className="min-h-screen pb-28">
      <section className="px-7 pb-5 pt-8">
        <div className="flex items-center justify-between">
          <button onClick={onOpenDrawer} className="flex items-center gap-4 text-left">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-white bg-orange-400 text-2xl font-black text-white shadow-lg">
              {initials(dashboard.teacher.name)}
            </div>
            <div>
              <p className="text-sm font-black text-blue-800">{getGreeting()},</p>
              <h1 className="text-2xl font-black leading-tight text-blue-950">{dashboard.teacher.name}</h1>
            </div>
          </button>
          <button className="relative flex h-14 w-14 items-center justify-center rounded-full border border-blue-100 bg-blue-50 shadow-sm">
            <Bell className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            {dashboard.stats.notifications > 0 && <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-red-500" />}
          </button>
        </div>

        <div className="mt-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">Educator Portal</p>
            <h2 className="text-xl font-black leading-tight text-blue-950">Supervision Control Center</h2>
          </div>
          <div className="min-w-[180px] rounded-[18px] border border-blue-200 bg-blue-50/80 px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-wider text-blue-950">Your UID</p>
            <div className="flex items-center gap-2">
              <p className="max-w-[140px] truncate text-sm font-black text-blue-950">{dashboard.teacher.email}</p>
              <Copy className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-7">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 text-blue-600" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-[64px] w-full rounded-[28px] border border-blue-200 bg-white pl-16 pr-5 text-lg font-semibold text-slate-800 shadow-lg shadow-blue-100 outline-none"
            placeholder="Search students, classes, homework, doubts..."
          />
        </div>

        <div className="mt-5 grid grid-cols-3 rounded-[30px] bg-white px-4 py-6 shadow-lg shadow-blue-100">
          <StatCell icon={Users} value={dashboard.stats.students} label="Students" />
          <StatCell icon={Calendar} value={dashboard.stats.upcomingClasses} label="Live Class" bordered />
          <StatCell icon={MessageSquare} value={dashboard.stats.pendingDoubts} label="Pending" />
        </div>

        <h3 className="mt-5 text-2xl font-black text-slate-950">Supervision Quick Access Hub</h3>
        <div className="mt-3 grid grid-cols-2 gap-3 rounded-[28px]">
          <button
            onClick={() => setHubTab("classroom")}
            className={`h-14 rounded-[24px] text-lg font-black shadow-sm transition ${hubTab === "classroom" ? "bg-blue-600 text-white" : "bg-white text-slate-950"}`}
          >
            Classroom
          </button>
          <button
            onClick={() => setHubTab("academics")}
            className={`h-14 rounded-[24px] text-lg font-black shadow-sm transition ${hubTab === "academics" ? "bg-blue-600 text-white" : "bg-white text-slate-950"}`}
          >
            Academics
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          {hubTab === "classroom" ? (
            <>
              <HubCard icon={Users} badge={`${dashboard.stats.students} Students`} title="My Students" subtitle={studentPreview ? `${studentPreview} +${Math.max(0, dashboard.stats.students - 3)}` : "No students linked"} />
              <HubCard icon={Calendar} badge="Attendance Page" title="Attendance Log" subtitle="Mark class status" />
              <HubCard icon={Video} badge="Recorded Library" title="Upload Recorded Video" subtitle="Publish to Class Library" />
              <HubCard icon={PlayCircle} badge="Live Manager" title="Live Class Console" subtitle="Manage pre-scheduled streams" />
            </>
          ) : (
            <>
              <HubCard icon={TrendingUp} badge="Visual Page" title="Class Progress" subtitle="Syllabus indexes" />
              <HubCard icon={CheckCircle2} badge="Worksheets Page" title="Assign Homework" subtitle="Upload student quests" />
              <HubCard icon={ClipboardList} badge="Submissions" title="Homework Submissions" subtitle="View & grade uploads" />
              <HubCard icon={FileText} badge="Resource Page" title="Upload Notes" subtitle="Chapter PDFs" />
              <HubCard icon={Gamepad2} badge="MCQ Injector" title="Arcade & Quiz Console" subtitle="Preview & manage 4 games" />
              <HubCard icon={Rocket} badge="Superpower Hub" title="Future Skills Planner" subtitle="Classroom lesson manuals" />
            </>
          )}
        </div>

        {hubTab === "academics" && (
          <TeacherActionForm
            mode={actionMode}
            setMode={setActionMode}
            form={form}
            setForm={setForm}
            classOptions={classOptions}
            submitting={submitting}
            onSubmit={onSubmitAction}
            status={status}
          />
        )}
      </section>

      <button
        onClick={() => setActiveView("doubts")}
        className="fixed bottom-24 right-[max(1.75rem,calc((100vw-560px)/2+1.75rem))] z-20 flex h-[78px] items-center gap-3 rounded-[22px] bg-blue-600 px-7 text-xl font-black text-white shadow-xl shadow-blue-300"
      >
        <MessageSquare className="h-7 w-7" />
        Solve Doubts
        {pendingDoubts.length > 0 && <span className="absolute -top-2 left-10 flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-sm">{pendingDoubts.length}</span>}
      </button>
    </div>
  );
}

function StatCell({ icon: Icon, value, label, bordered = false }: { icon: typeof Users; value: number; label: string; bordered?: boolean }) {
  return (
    <div className={`text-center ${bordered ? "border-x border-slate-200" : ""}`}>
      <div className="flex items-center justify-center gap-2">
        <Icon className="h-7 w-7 text-blue-600" />
        <span className="text-3xl font-black text-blue-950">{value}</span>
      </div>
      <p className="mt-1 text-[12px] font-black uppercase tracking-wider text-slate-600">{label}</p>
    </div>
  );
}

function HubCard({ icon: Icon, badge, title, subtitle }: { icon: typeof Users; badge: string; title: string; subtitle: string }) {
  return (
    <div className="min-h-[170px] rounded-[28px] bg-white p-5 shadow-lg shadow-blue-100">
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-100 bg-blue-50">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-black text-blue-600">{badge}</span>
      </div>
      <div className="mt-12">
        <h4 className="text-xl font-black leading-tight text-slate-950">{title}</h4>
        <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

function TeacherActionForm({
  mode,
  setMode,
  form,
  setForm,
  classOptions,
  submitting,
  onSubmit,
  status,
}: {
  mode: ActionMode;
  setMode: (mode: ActionMode) => void;
  form: {
    subject: string;
    title: string;
    description: string;
    classLevel: string;
    dueDate: string;
    priority: string;
    fileName: string;
    fileSize: string;
  };
  setForm: (patch: Partial<typeof form>) => void;
  classOptions: string[];
  submitting: boolean;
  onSubmit: () => void;
  status: string;
}) {
  return (
    <div className="mt-5 rounded-[28px] bg-white p-5 shadow-lg shadow-blue-100">
      <div className="grid grid-cols-2 gap-2 rounded-[20px] bg-slate-100 p-1">
        <button onClick={() => setMode("homework")} className={`h-11 rounded-[16px] text-sm font-black ${mode === "homework" ? "bg-blue-600 text-white" : "text-slate-600"}`}>
          Homework
        </button>
        <button onClick={() => setMode("note")} className={`h-11 rounded-[16px] text-sm font-black ${mode === "note" ? "bg-blue-600 text-white" : "text-slate-600"}`}>
          Notes
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        <input className="h-12 rounded-[18px] border border-slate-200 px-4 text-sm font-bold outline-none" value={form.title} onChange={(event) => setForm({ title: event.target.value })} placeholder={mode === "homework" ? "Homework title" : "Chapter title"} />
        <div className="grid grid-cols-2 gap-3">
          <select className="h-12 rounded-[18px] border border-slate-200 px-3 text-sm font-bold outline-none" value={form.subject} onChange={(event) => setForm({ subject: event.target.value })}>
            {subjects.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="h-12 rounded-[18px] border border-slate-200 px-3 text-sm font-bold outline-none" value={form.classLevel} onChange={(event) => setForm({ classLevel: event.target.value })}>
            <option value="">All classes</option>
            {classOptions.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        {mode === "homework" ? (
          <input className="h-12 rounded-[18px] border border-slate-200 px-4 text-sm font-bold outline-none" value={form.dueDate} onChange={(event) => setForm({ dueDate: event.target.value })} placeholder="Due date: 2026-06-05" />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <input className="h-12 rounded-[18px] border border-slate-200 px-4 text-sm font-bold outline-none" value={form.fileName} onChange={(event) => setForm({ fileName: event.target.value })} placeholder="File name" />
            <input className="h-12 rounded-[18px] border border-slate-200 px-4 text-sm font-bold outline-none" value={form.fileSize} onChange={(event) => setForm({ fileSize: event.target.value })} placeholder="Size" />
          </div>
        )}
        <textarea className="min-h-24 rounded-[18px] border border-slate-200 px-4 py-3 text-sm font-semibold outline-none" value={form.description} onChange={(event) => setForm({ description: event.target.value })} placeholder="Description" />
        <button onClick={onSubmit} disabled={submitting} className="h-14 rounded-[20px] bg-blue-600 text-base font-black text-white shadow-lg shadow-blue-200 disabled:opacity-60">
          {submitting ? "Sending..." : mode === "homework" ? "Send Homework" : "Upload Notes"}
        </button>
        {status && <p className="text-center text-xs font-black text-blue-700">{status}</p>}
      </div>
    </div>
  );
}

function SyllabusView({
  subject,
  setSubject,
  items,
}: {
  subject: keyof typeof syllabusBySubject;
  setSubject: (subject: keyof typeof syllabusBySubject) => void;
  items: readonly (readonly [string, string, string])[];
}) {
  return (
    <section className="min-h-screen pb-28">
      <div className="bg-white px-7 py-5">
        <div className="grid grid-cols-3 gap-5">
          {subjects.map((item) => (
            <button
              key={item}
              onClick={() => setSubject(item as keyof typeof syllabusBySubject)}
              className={`h-14 rounded-[24px] text-lg font-black ${subject === item ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : item === "Science" ? "border border-emerald-200 bg-emerald-50 text-emerald-600" : "border border-purple-200 bg-purple-50 text-purple-500"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <Timeline items={items} compact />
      <FloatingAction icon={Plus} label="Add Chapter" />
    </section>
  );
}

function RoadmapView() {
  return (
    <section className="min-h-screen px-6 pb-28 pt-10">
      <h1 className="text-2xl font-black leading-tight text-slate-950">Future Skills Curriculum Pathway</h1>
      <p className="mt-1 text-base font-semibold text-slate-500">Prepare students with essential, modern future-ready career skills.</p>
      <div className="mt-6">
        <Timeline items={roadmapItems} />
      </div>
      <FloatingAction icon={Rocket} label="Manage Skills" />
    </section>
  );
}

function Timeline({ items, compact = false }: { items: readonly (readonly [string, string, string])[]; compact?: boolean }) {
  return (
    <div className={compact ? "px-7 pt-6" : ""}>
      <div className="relative pl-10">
        <div className="absolute bottom-6 left-[15px] top-4 w-[3px] rounded-full bg-slate-200" />
        {items.map(([title, subtitle, state], index) => (
          <div key={title} className="relative mb-4">
            <div className={`absolute -left-10 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white shadow-sm ${state === "done" ? "border-emerald-200 text-emerald-500" : state === "active" ? "border-blue-200 text-blue-500" : "border-slate-200 text-slate-400"}`}>
              {state === "done" ? <Check className="h-5 w-5" /> : state === "active" ? <PlayCircle className="h-5 w-5 fill-blue-500 text-blue-500" /> : <Lock className="h-4 w-4" />}
            </div>
            {index > 0 && <div className={`absolute -left-[25px] -top-4 h-9 w-[3px] ${state === "done" ? "bg-emerald-400" : state === "active" ? "bg-blue-500" : "bg-slate-200"}`} />}
            <div className={`rounded-[18px] border px-4 py-4 shadow-sm ${state === "done" ? "border-emerald-200 bg-emerald-50/40" : state === "active" ? "border-blue-100 bg-white/70" : "border-slate-200 bg-white/55"}`}>
              <h3 className={`text-xl font-black leading-tight ${state === "locked" ? "text-slate-500" : "text-slate-950"}`}>{title}</h3>
              <p className="mt-1 text-base font-semibold leading-snug text-slate-500">{subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeaderboardView({ students }: { students: TeacherStudent[] }) {
  const names = students.length ? students.map((student) => cleanText(student.name, "Student")) : ["Gulshan Sharma", "Rohan Das", "Priya Patel", "Anya Verma", "Kabir Gupta", "Amit Roy"];
  const arenas = [
    ["Quiz Arena", "blue", [names[0], names[1] || names[0], names[2] || names[0]]],
    ["Cognitive Arena", "yellow", [names[0], names[3] || names[1] || names[0], names[4] || names[2] || names[0]]],
    ["Syntax Block", "purple", [names[2] || names[0], names[0], names[1] || names[0]]],
    ["Word Unscramble", "emerald", [names[0], names[5] || names[1] || names[0], names[1] || names[0]]],
  ] as const;

  return (
    <section className="min-h-screen px-6 pb-28 pt-10">
      <h1 className="text-[34px] font-black leading-tight text-slate-950">Student Leaderboard Standings</h1>
      <div className="mt-8 space-y-6">
        {arenas.map(([title, color, arenaNames]) => (
          <LeaderboardCard key={title} title={title} color={color} names={[...arenaNames]} />
        ))}
      </div>
    </section>
  );
}

function LeaderboardCard({ title, color, names }: { title: string; color: "blue" | "yellow" | "purple" | "emerald"; names: string[] }) {
  const styles = {
    blue: "border-blue-500 bg-blue-50/45 text-blue-600",
    yellow: "border-yellow-400 bg-yellow-50/45 text-yellow-500",
    purple: "border-purple-500 bg-purple-50/45 text-purple-500",
    emerald: "border-emerald-500 bg-emerald-50/45 text-emerald-500",
  };

  return (
    <div className={`rounded-[22px] border-2 p-6 ${styles[color]}`}>
      <h2 className="text-2xl font-black text-slate-950">{title}</h2>
      <div className="mt-5 space-y-3">
        {names.map((name, index) => (
          <div key={`${title}-${name}-${index}`} className="grid grid-cols-[44px_1fr_auto] items-center gap-1 text-lg font-black">
            <span>{index + 1}{index === 0 ? "st" : index === 1 ? "nd" : "rd"}</span>
            <span className="text-slate-950">{name}</span>
            <span className="text-base text-slate-500">Level {Math.max(5 - index, 3)} {index === 0 ? "(Complete)" : "Finished"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DoubtsView({
  doubts,
  pendingDoubts,
  solvedDoubts,
  replyDrafts,
  setReplyDrafts,
  onReply,
  submitting,
  status,
  setActiveView,
}: {
  doubts: TeacherDoubt[];
  pendingDoubts: TeacherDoubt[];
  solvedDoubts: TeacherDoubt[];
  replyDrafts: Record<string, string>;
  setReplyDrafts: (value: Record<string, string>) => void;
  onReply: (doubtId: string) => void;
  submitting: boolean;
  status: string;
  setActiveView: (view: ActiveView) => void;
}) {
  const [filter, setFilter] = useState<"all" | "pending" | "solved">("all");
  const visible = filter === "pending" ? pendingDoubts : filter === "solved" ? solvedDoubts : doubts;

  return (
    <section className="min-h-screen bg-[linear-gradient(180deg,#f4f8ff_0%,#e9eeff_56%,#fff2f8_100%)] pb-12">
      <div className="flex h-[88px] items-center gap-5 bg-white px-7">
        <button onClick={() => setActiveView("home")} className="rounded-full p-1">
          <ArrowLeft className="h-9 w-9 text-slate-950" />
        </button>
        <h1 className="text-[26px] font-black text-slate-950">Student Doubts Solver</h1>
      </div>

      <div className="px-6 py-5">
        <div className="grid grid-cols-3 rounded-[24px] bg-white/75 p-2 shadow-sm">
          <DoubtTab active={filter === "all"} label="All Doubts" count={doubts.length} onClick={() => setFilter("all")} />
          <DoubtTab active={filter === "pending"} label="Pending" count={pendingDoubts.length} dot onClick={() => setFilter("pending")} />
          <DoubtTab active={filter === "solved"} label="Solved" count={solvedDoubts.length} onClick={() => setFilter("solved")} />
        </div>

        {status && <p className="mt-3 text-center text-xs font-black text-blue-700">{status}</p>}

        <div className="mt-5 space-y-5">
          {visible.length ? (
            visible.map((doubt) => (
              <DoubtCard
                key={doubt.id}
                doubt={doubt}
                reply={replyDrafts[doubt.id] ?? ""}
                setReply={(reply) => setReplyDrafts({ ...replyDrafts, [doubt.id]: reply })}
                onReply={() => onReply(doubt.id)}
                submitting={submitting}
              />
            ))
          ) : (
            <div className="rounded-[28px] bg-white px-6 py-12 text-center shadow-sm">
              <HelpCircle className="mx-auto h-10 w-10 text-blue-500" />
              <p className="mt-3 text-lg font-black text-slate-900">No doubts found</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function DoubtTab({ active, label, count, dot, onClick }: { active: boolean; label: string; count: number; dot?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex h-12 items-center justify-center gap-2 rounded-[20px] text-sm font-black ${active ? "bg-white text-indigo-500 shadow" : "text-slate-500"}`}>
      {label}
      <span className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs ${active ? "bg-indigo-500 text-white" : "bg-slate-200 text-slate-500"}`}>{count}</span>
      {dot && <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />}
    </button>
  );
}

function DoubtCard({
  doubt,
  reply,
  setReply,
  onReply,
  submitting,
}: {
  doubt: TeacherDoubt;
  reply: string;
  setReply: (value: string) => void;
  onReply: () => void;
  submitting: boolean;
}) {
  const solved = doubt.status === "solved";
  return (
    <article className="rounded-[28px] bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${solved ? "bg-emerald-50 text-emerald-500" : "bg-yellow-50 text-yellow-500"}`}>
            {solved ? <CheckCircle2 className="h-5 w-5 fill-emerald-500 text-emerald-500" /> : <HelpCircle className="h-5 w-5" />}
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-950">{doubt.studentName || "Student"}</h2>
            <p className="text-sm font-semibold text-slate-500">
              {doubt.classLevel || "Class"} | Subject: {doubt.subject || "General"} | {solved ? `Solved ${relativeTime(doubt.repliedAt)}` : relativeTime(doubt.createdAt)}
            </p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-black ${solved ? "bg-emerald-50 text-emerald-600" : "bg-yellow-50 text-yellow-600"}`}>
          {solved ? "Solved" : "Pending"}
        </span>
      </div>

      <p className="mt-5 whitespace-pre-wrap text-lg font-medium leading-relaxed text-slate-900">{doubt.question || "No question text."}</p>

      {doubt.attachmentName && (
        <div className="mt-4 flex h-14 items-center justify-between rounded-[16px] border border-slate-200 bg-slate-50 px-4">
          <div className="flex min-w-0 items-center gap-3">
            <FileImage className="h-6 w-6 text-sky-500" />
            <span className="truncate text-base font-black text-slate-700">{doubt.attachmentName}</span>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500">IMAGE</span>
        </div>
      )}

      {solved ? (
        <div className="mt-4 rounded-[18px] border border-sky-200 bg-sky-50 px-5 py-4">
          <p className="flex items-center gap-2 text-base font-black text-blue-700">
            <CheckCircle2 className="h-5 w-5" />
            Solved Explanation:
          </p>
          <p className="mt-2 whitespace-pre-wrap text-base font-semibold leading-relaxed text-blue-800">{doubt.replyText || "Marked solved."}</p>
        </div>
      ) : (
        <div className="mt-5">
          <textarea
            value={reply}
            onChange={(event) => setReply(event.target.value)}
            className="mb-3 min-h-24 w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-400"
            placeholder="Write explanation..."
          />
          <button onClick={onReply} disabled={submitting} className="flex h-16 w-full items-center justify-center gap-3 rounded-[18px] bg-blue-600 text-lg font-black text-white shadow-lg shadow-blue-200 disabled:opacity-60">
            <PenLine className="h-5 w-5" />
            Reply / Explain
          </button>
        </div>
      )}
    </article>
  );
}

function FloatingAction({ icon: Icon, label }: { icon: typeof Plus; label: string }) {
  return (
    <button className="fixed bottom-24 right-[max(1.5rem,calc((100vw-560px)/2+1.5rem))] z-20 flex h-[76px] items-center gap-4 rounded-[22px] bg-blue-600 px-7 text-xl font-black text-white shadow-xl shadow-blue-300">
      <Icon className="h-7 w-7" />
      {label}
    </button>
  );
}

function BottomNav({ activeView, setActiveView }: { activeView: ActiveView; setActiveView: (view: ActiveView) => void }) {
  return (
    <nav className="fixed bottom-0 left-1/2 z-30 grid h-[86px] w-full max-w-[560px] -translate-x-1/2 grid-cols-4 border-t border-slate-100 bg-white">
      {navItems.map((item) => {
        const active = activeView === item.id;
        return (
          <button key={item.id} onClick={() => setActiveView(item.id)} className={`flex flex-col items-center justify-center gap-1 text-sm font-black ${active ? "text-blue-600" : "text-slate-500"}`}>
            <item.icon className={`h-7 w-7 ${active ? "fill-blue-50" : ""}`} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function ChevronIcon() {
  return (
    <span className="relative block h-8 w-8">
      <span className="absolute left-3 top-1 h-5 w-5 rotate-45 border-r-2 border-t-2 border-blue-100" />
    </span>
  );
}
