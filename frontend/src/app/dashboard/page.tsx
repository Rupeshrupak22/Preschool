"use client";

import { FormEvent, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  Code2,
  Cpu,
  GraduationCap,
  Laptop,
  MessageCircle,
  Rocket,
  ShieldCheck,
  Target,
  Users,
  Wifi,
  Zap
} from "lucide-react";

type Icon = React.ComponentType<{ className?: string }>;

const skillTiles: { label: string; icon: Icon }[] = [
  { label: "Robotics", icon: Cpu },
  { label: "Coding", icon: Laptop },
  { label: "IoT", icon: Wifi },
  { label: "Electronics", icon: Zap },
  { label: "AI/ML", icon: Brain },
  { label: "Programming", icon: Code2 }
];

const overviewCards: { title: string; copy: string; icon: Icon }[] = [
  {
    title: "Progress Tracking",
    copy: "Real-time monitoring of student performance",
    icon: BarChart3
  },
  {
    title: "AI-Powered Tools",
    copy: "Smart recommendations and automated tasks",
    icon: Brain
  },
  {
    title: "Curriculum Management",
    copy: "Organized and structured learning paths",
    icon: BookOpen
  },
  {
    title: "Collaborative Learning",
    copy: "Interactive tools for group activities",
    icon: GraduationCap
  }
];

const studentFeatures = [
  "Personalized Learning Path",
  "Interactive Quizzes & Games",
  "Doubt Solver (AI Chatbot)",
  "AI Notes & Summaries",
  "Practice Question Bank",
  "Exam Preparation Mode",
  "Study Planner & Reminders",
  "Progress Reports & Report Cards",
  "Project & Idea Suggestions",
  "Language Translation & Simplification",
  "Gamification & Leaderboards",
  "Collaborative Tools",
  "AI Voice Narration",
  "Adaptive Revision Plans",
  "E-Library Access"
];

const teacherFeatures = [
  "AI Lesson Plan Generator",
  "Unit Plan Creation",
  "Exam & Question Paper Generator",
  "AI Quiz Maker",
  "Automatic PPT Maker",
  "Assignment & Worksheet Generator",
  "Auto-Grading System",
  "Homework Allocation",
  "Content Recommendation",
  "Progress Dashboard",
  "AI Teaching Assistant (Chatbot)",
  "Curriculum Mapping",
  "Plagiarism Check & Report",
  "Parent Communication Tools",
  "AI Notes Generator"
];

const examCards: {
  title: string;
  copy: string;
  icon: Icon;
  tags: string[];
}[] = [
  {
    title: "Multiple Formats",
    copy:
      "Support for MCQs, essays, coding challenges, and descriptive questions.",
    icon: BookOpen,
    tags: ["MCQs", "Essays", "Coding", "True/False"]
  },
  {
    title: "Auto Evaluation",
    copy:
      "Instant grading and detailed feedback with AI-powered analysis.",
    icon: BarChart3,
    tags: ["Instant Grading", "AI Analysis", "Reports"]
  },
  {
    title: "Secure Platform",
    copy:
      "Protected exam environment with anti-cheating and monitoring measures.",
    icon: ShieldCheck,
    tags: ["Anti-Cheating", "Secure Browser", "Time Limits"]
  }
];

function SectionShell({
  id,
  title,
  subtitle,
  children,
  accent = "right"
}: {
  id: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  accent?: "left" | "right";
}) {
  return (
    <section id={id} className="px-4 py-16 md:px-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-blue-100 bg-white p-8 shadow-[0_22px_70px_rgba(15,23,42,0.10)] md:p-12">
        <div
          className={`absolute top-0 h-32 w-32 bg-blue-100 ${
            accent === "left"
              ? "left-0 rounded-br-full"
              : "right-0 rounded-bl-full"
          }`}
        />
        <div className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-black text-slate-950 md:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              {subtitle}
            </p>
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}

function FeaturePill({
  label,
  active
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex min-h-14 items-center gap-3 rounded-xl border px-4 font-semibold text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-500 hover:bg-blue-600 hover:text-white ${
        active
          ? "border-cyan-500 bg-cyan-50 ring-1 ring-cyan-500/25"
          : "border-slate-200 bg-white"
      }`}
    >
      <span
        className={`h-3 w-3 rounded-full ${
          active ? "bg-cyan-600" : "bg-blue-700"
        }`}
      />
      {label}
    </div>
  );
}

export default function LMSPage() {
  const [status, setStatus] = useState("");

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Overview", href: "#overview" },
    { label: "Students", href: "#student-features" },
    { label: "Teachers", href: "#teacher-features" },
    { label: "Exam", href: "#exam-software" },
    { label: "Demo", href: "#demo" }
  ];

  function goTo(id: string) {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function submitDemo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("Submitting demo request...");

    try {
      const form = new FormData(event.currentTarget);

      const body = Object.fromEntries(form.entries());

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "school",
          name: body.name,
          email: body.email,
          phone: body.phone,
          school: body.school,
          city: body.city,
          message: `${body.schedule || ""} ${
            body.message || ""
          }`.trim()
        })
      });

      const data = await response.json();

      setStatus(
        response.ok
          ? "Demo request submitted. ADYAPAN team will contact you."
          : data.error || "Something went wrong"
      );

      if (response.ok) {
        event.currentTarget.reset();
      }
    } catch (error) {
      setStatus("Network error");
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-slate-950">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-blue-100 bg-white/95 shadow-[0_12px_35px_rgba(37,99,235,0.10)] backdrop-blur-xl">
        <div className="mx-auto flex h-[86px] max-w-7xl items-center justify-between gap-6 px-5 md:px-10">
          <a
            href="/"
            className="flex items-center gap-3"
            aria-label="ADYAPAN School home"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 via-cyan-600 to-blue-950 text-sm font-black lowercase text-white shadow-[0_10px_24px_rgba(13,148,136,0.22)]">
              ady.
            </span>

            <span className="leading-none">
              <span className="block text-3xl font-black tracking-tight text-slate-950">
                Adyapan
              </span>

              <span className="ml-1 block text-[10px] font-black uppercase tracking-[0.42em] text-slate-500">
                School
              </span>
            </span>
          </a>

          <div className="hidden items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-2 shadow-[0_10px_35px_rgba(37,99,235,0.12)] md:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-full px-5 py-3 text-base font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>

          <a
            href="#demo"
            className="hidden rounded-full bg-blue-700 px-5 py-3 text-sm font-black text-white shadow-[0_12px_24px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 hover:bg-slate-950 sm:inline-flex"
          >
            Book Demo
          </a>
        </div>
      </nav>
    </main>
  );
}