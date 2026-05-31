"use client";

import { useState } from "react";
import {
  Bell,
  Search,
  Users,
  Video,
  MessageCircle,
  Calendar,
  Upload,
  MonitorPlay,
  BarChart3,
  FileText,
  CheckSquare,
  BookOpen,
  Gamepad2,
  Compass,
  Home,
  BookOpenCheck,
  Map,
  Trophy,
  Wifi,
  Copy,
  Menu,
  LogOut,
} from "lucide-react";

// ─── Mock Data ───────────────────────────────────────────────────────────────
const mockTeacher = {
  name: "Charan",
  email: "charan@gmail.com",
  uid: "charan@gmail.com",
};

const mockStats = {
  students: 0,
  liveClass: 2,
  pending: 0,
};

const mockLiveSession = {
  active: true,
  title: "Go Live: Stream on Classroom Smartboards",
  description:
    "Launch real-time interactive lectures & sync skills onto classroom devices.",
};

// ─── Types ───────────────────────────────────────────────────────────────────
type QuickAccessCard = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
};

// ─── Card Data ───────────────────────────────────────────────────────────────
const classroomCards: QuickAccessCard[] = [
  {
    icon: <Users className="h-6 w-6 text-blue-600" />,
    title: "My Students",
    subtitle: "No students linked yet",
    badge: "0 Students",
    badgeColor: "bg-blue-50 text-blue-600",
  },
  {
    icon: <Calendar className="h-6 w-6 text-blue-600" />,
    title: "Attendance Log",
    subtitle: "Mark class status",
    badge: "Attendance Page",
    badgeColor: "bg-blue-50 text-blue-600",
  },
  {
    icon: <Upload className="h-6 w-6 text-blue-600" />,
    title: "Upload Recorded Video",
    subtitle: "Publish to Class Library",
    badge: "Recorded Library",
    badgeColor: "bg-green-50 text-green-600",
  },
  {
    icon: <MonitorPlay className="h-6 w-6 text-blue-600" />,
    title: "Live Class Console",
    subtitle: "Manage pre-scheduled streams",
    badge: "Live Manager",
    badgeColor: "bg-blue-50 text-blue-600",
  },
];

const academicsCards: QuickAccessCard[] = [
  {
    icon: <BarChart3 className="h-6 w-6 text-blue-600" />,
    title: "Class Progress",
    subtitle: "Syllabus indexes",
    badge: "Visual Page",
    badgeColor: "bg-blue-50 text-blue-600",
  },
  {
    icon: <FileText className="h-6 w-6 text-green-600" />,
    title: "Assign Homework",
    subtitle: "Upload student quests",
    badge: "Worksheets Page",
    badgeColor: "bg-green-50 text-green-600",
  },
  {
    icon: <CheckSquare className="h-6 w-6 text-blue-600" />,
    title: "Homework Submissions",
    subtitle: "View & grade uploads",
    badge: "Submissions",
    badgeColor: "bg-blue-50 text-blue-600",
  },
  {
    icon: <BookOpen className="h-6 w-6 text-blue-600" />,
    title: "Upload Notes",
    subtitle: "Chapter PDFs",
    badge: "Resource Page",
    badgeColor: "bg-blue-50 text-blue-600",
  },
  {
    icon: <Gamepad2 className="h-6 w-6 text-blue-600" />,
    title: "Arcade & Quiz Console",
    subtitle: "Preview & manage 4 games",
    badge: "MCQ Injector",
    badgeColor: "bg-purple-50 text-purple-600",
  },
  {
    icon: <Compass className="h-6 w-6 text-green-600" />,
    title: "Future Skills Planner",
    subtitle: "Classroom lesson manuals",
    badge: "Superpower Hub",
    badgeColor: "bg-green-50 text-green-600",
  },
];

// ─── Bottom / Sidebar Nav Items ──────────────────────────────────────────────
const navItems = [
  { id: "home" as const, icon: Home, label: "Home" },
  { id: "syllabus" as const, icon: BookOpenCheck, label: "Syllabus" },
  { id: "career" as const, icon: Map, label: "Career Roadmap" },
  { id: "leaderboard" as const, icon: Trophy, label: "Leaderboard" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function TeacherDashboardPreview() {
  const [activeTab, setActiveTab] = useState<"classroom" | "academics">("classroom");
  const [activeNav, setActiveNav] = useState<string>("home");

  const cards = activeTab === "classroom" ? classroomCards : academicsCards;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50/40">
      {/* ─── Desktop Sidebar ──────────────────────────────────────────── */}
      <aside className="hidden lg:flex lg:w-64 xl:w-72 flex-col fixed inset-y-0 left-0 z-30 border-r border-gray-100 bg-white/80 backdrop-blur-md">
        {/* Sidebar Header */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-sm">
            A
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">ADYAPAN</p>
            <p className="text-[11px] text-gray-500">Educator Portal</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                activeNav === item.id
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-400 text-sm font-bold text-white">
              {mockTeacher.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{mockTeacher.name}</p>
              <p className="text-[11px] text-gray-500 truncate">{mockTeacher.email}</p>
            </div>
            <button className="text-gray-400 hover:text-red-500 transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Main Content ─────────────────────────────────────────────── */}
      <main className="flex-1 lg:ml-64 xl:ml-72 pb-20 lg:pb-8">
        {/* ─── Top Header ───────────────────────────────────────────────── */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="px-4 py-4 md:px-8 lg:px-10">
            <div className="flex items-center justify-between">
              {/* Left: Greeting */}
              <div className="flex items-center gap-3">
                {/* Mobile avatar */}
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-400 text-lg font-bold text-white shadow-md lg:hidden">
                  {mockTeacher.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-gray-500">{getGreeting()},</p>
                  <h1 className="text-lg font-bold text-gray-900 md:text-xl">{mockTeacher.name}</h1>
                </div>
              </div>

              {/* Right: UID + Bell */}
              <div className="flex items-center gap-3">
                {/* UID Badge - hidden on small mobile */}
                <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600 ring-1 ring-gray-100">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400">Your UID</span>
                  <span className="font-semibold text-gray-800">{mockTeacher.uid}</span>
                  <Copy className="h-3 w-3 text-gray-400 cursor-pointer hover:text-blue-500" />
                </div>
                <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-100 hover:bg-gray-100 transition-colors">
                  <Bell className="h-5 w-5 text-orange-400" />
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                </button>
              </div>
            </div>

            {/* Subtitle row */}
            <div className="mt-2 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Educator Portal
                </p>
                <p className="text-sm font-semibold text-gray-700">Supervision Control Center</p>
              </div>
              {/* UID on mobile */}
              <div className="flex sm:hidden items-center gap-1 rounded-full bg-gray-50 px-2.5 py-1.5 text-[11px] font-medium text-gray-600 ring-1 ring-gray-100">
                <span className="font-semibold text-gray-800 truncate max-w-[120px]">{mockTeacher.uid}</span>
                <Copy className="h-3 w-3 text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* ─── Page Content ─────────────────────────────────────────────── */}
        <div className="px-4 py-5 md:px-8 lg:px-10 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students, classes, homework, doubts..."
              className="h-12 w-full rounded-2xl border-0 bg-white pl-12 pr-4 text-sm text-gray-700 shadow-sm ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-shadow"
            />
          </div>

          {/* Live Session Banner */}
          {mockLiveSession.active && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-5 md:p-6 text-white shadow-lg shadow-blue-200/40">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
                  <Wifi className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      Smartboard Live
                    </span>
                    <span className="text-xs text-blue-100">Interactive Presenter</span>
                  </div>
                  <h3 className="mt-2 text-base font-bold leading-snug md:text-lg">
                    {mockLiveSession.title}
                  </h3>
                  <p className="mt-1 text-sm text-blue-100 max-w-lg">{mockLiveSession.description}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button className="flex items-center gap-2 rounded-full bg-gray-900/80 px-5 py-2.5 text-xs font-semibold text-white hover:bg-gray-900 transition-colors">
                      <span className="h-2 w-2 rounded-full bg-white" />
                      End Session
                    </button>
                    <button className="flex items-center gap-2 rounded-full bg-red-500 px-5 py-2.5 text-xs font-semibold text-white hover:bg-red-600 transition-colors">
                      <span className="h-2 w-2 rounded-full bg-white" />
                      Push Quiz
                    </button>
                  </div>
                </div>
              </div>
              {/* Decorative chevron */}
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hidden md:block">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 24l8-8-8-8" />
                </svg>
              </div>
            </div>
          )}

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 lg:max-w-2xl">
            <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-white p-4 md:p-5 shadow-sm ring-1 ring-gray-100">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-500" />
                <span className="text-2xl font-bold text-gray-900 md:text-3xl">{mockStats.students}</span>
              </div>
              <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                Students
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-white p-4 md:p-5 shadow-sm ring-1 ring-gray-100">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold text-gray-900 md:text-3xl">{mockStats.liveClass}</span>
              </div>
              <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                Live Class
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-white p-4 md:p-5 shadow-sm ring-1 ring-gray-100">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold text-gray-900 md:text-3xl">{mockStats.pending}</span>
              </div>
              <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                Pending
              </span>
            </div>
          </div>

          {/* Supervision Quick Access Hub */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 md:text-xl">Supervision Quick Access Hub</h2>

            {/* Tabs */}
            <div className="mt-3 flex gap-2 max-w-md">
              <button
                onClick={() => setActiveTab("classroom")}
                className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-all ${
                  activeTab === "classroom"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
                }`}
              >
                Classroom
              </button>
              <button
                onClick={() => setActiveTab("academics")}
                className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-all ${
                  activeTab === "academics"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
                }`}
              >
                Academics
              </button>
            </div>

            {/* Cards Grid — 2 cols on mobile, 3 on tablet, 4 on desktop */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
              {cards.map((card) => (
                <button
                  key={card.title}
                  className="group flex flex-col items-start rounded-2xl bg-white p-4 md:p-5 text-left shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md hover:ring-blue-200 hover:-translate-y-0.5"
                >
                  <div className="flex w-full items-start justify-between">
                    <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors">
                      {card.icon}
                    </div>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap ${card.badgeColor}`}
                    >
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-gray-900 md:text-base">{card.title}</h3>
                  <p className="mt-0.5 text-xs text-gray-500 md:text-sm">{card.subtitle}</p>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* ─── Solve Doubts FAB ───────────────────────────────────────────── */}
      <div className="fixed bottom-24 right-4 z-50 lg:bottom-8 lg:right-8">
        <button className="flex items-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-300/40 transition-transform hover:scale-105 hover:bg-blue-800">
          <MessageCircle className="h-4 w-4" />
          Solve Doubts
        </button>
      </div>

      {/* ─── Mobile Bottom Navigation ───────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white/95 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-around py-2.5 px-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                activeNav === item.id ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
