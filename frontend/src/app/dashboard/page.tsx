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
    <main className="min-h-screen bg-[#f4f8ff] text-slate-950" />
  );
}
