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
  { title: "Progress Tracking", copy: "Real-time monitoring of student performance", icon: BarChart3 },
  { title: "AI-Powered Tools", copy: "Smart recommendations and automated tasks", icon: Brain },
  { title: "Curriculum Management", copy: "Organized and structured learning paths", icon: BookOpen },
  { title: "Collaborative Learning", copy: "Interactive tools for group activities", icon: GraduationCap }
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

const examCards: { title: string; copy: string; icon: Icon; tags: string[] }[] = [
  {
    title: "Multiple Formats",
    copy: "Support for MCQs, essays, coding challenges, and descriptive questions.",
    icon: BookOpen,
    tags: ["MCQs", "Essays", "Coding", "True/False"]
  },
  {
    title: "Auto Evaluation",
    copy: "Instant grading and detailed feedback with AI-powered analysis.",
    icon: BarChart3,
    tags: ["Instant Grading", "AI Analysis", "Reports"]
  },
  {
    title: "Secure Platform",
    copy: "Protected exam environment with anti-cheating and monitoring measures.",
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
            accent === "left" ? "left-0 rounded-br-full" : "right-0 rounded-bl-full"
          }`}
        />
        <div className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-black text-slate-950 md:text-4xl">{title}</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}

function FeaturePill({ label, active }: { label: string; active?: boolean }) {
  return (
    <div
      className={`flex min-h-14 items-center gap-3 rounded-xl border px-4 font-semibold text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-500 hover:bg-blue-600 hover:text-white ${
        active ? "border-cyan-500 bg-cyan-50 ring-1 ring-cyan-500/25" : "border-slate-200 bg-white"
      }`}
    >
      <span className={`h-3 w-3 rounded-full ${active ? "bg-cyan-600" : "bg-blue-700"}`} />
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
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function submitDemo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Submitting demo request...");
    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "school",
        name: body.name,
        email: body.email,
        phone: body.phone,
        school: body.school,
        city: body.city,
        message: `${body.schedule || ""} ${body.message || ""}`.trim()
      })
    });
    const data = await response.json();
    setStatus(response.ok ? "Demo request submitted. ADYAPAN team will contact you." : data.error);
    if (response.ok) event.currentTarget.reset();
  }

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-slate-950">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-blue-100 bg-white/95 shadow-[0_12px_35px_rgba(37,99,235,0.10)] backdrop-blur-xl">
        <div className="mx-auto flex h-[86px] max-w-7xl items-center justify-between gap-6 px-5 md:px-10">
          <a href="/" className="flex items-center gap-3" aria-label="ADYAPAN School home">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 via-cyan-600 to-blue-950 text-sm font-black lowercase text-white shadow-[0_10px_24px_rgba(13,148,136,0.22)]">
              ady.
            </span>
            <span className="leading-none">
              <span className="block text-3xl font-black tracking-tight text-slate-950">Adyapan</span>
              <span className="ml-1 block text-[10px] font-black uppercase tracking-[0.42em] text-slate-500">School</span>
            </span>
          </a>
          <div className="hidden items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-2 shadow-[0_10px_35px_rgba(37,99,235,0.12)] md:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-full px-5 py-3 text-base font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:text-white hover:shadow-[0_12px_24px_rgba(37,99,235,0.24)]"
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

      <section className="relative overflow-hidden px-4 pb-14 pt-32 md:px-6">
        <div className="absolute -left-28 -top-36 h-80 w-80 rounded-full bg-gradient-to-br from-blue-700 to-cyan-700 opacity-80" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1fr]">
          <div>
            <a href="/" className="mb-10 inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 text-sm font-bold text-blue-950 shadow">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-white">A</span>
              ADYAPAN LMS
            </a>
            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              <span className="text-cyan-700">Adyapan</span> LMS
            </h1>
            <p className="mt-7 max-w-3xl text-2xl font-medium leading-[1.6] text-slate-600">
              <span className="font-black text-blue-950">AI-powered Learning Management System</span> enriched with
              dynamic features to enhance teaching efficiency and{" "}
              <span className="font-black text-cyan-700">student engagement</span>
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href="#demo"
                className="inline-flex h-14 items-center justify-center gap-3 rounded-xl bg-cyan-600 px-8 font-black text-white shadow-[0_14px_30px_rgba(13,148,136,0.24)] transition hover:-translate-y-1 hover:bg-blue-700"
              >
                <Target className="h-5 w-5" /> Book Demo <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="tel:+919000000000"
                className="inline-flex h-14 items-center justify-center gap-3 rounded-xl bg-blue-700 px-8 font-black text-white shadow-[0_14px_30px_rgba(37,99,235,0.22)] transition hover:-translate-y-1 hover:bg-slate-950"
              >
                <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
              </a>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:max-w-3xl lg:grid-cols-3">
              {skillTiles.map((tile) => (
                <div
                  key={tile.label}
                  className="group flex h-16 items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 font-bold text-slate-700 shadow-sm transition hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-700 hover:text-white"
                >
                  <tile.icon className="h-6 w-6 text-cyan-700 transition group-hover:text-white" />
                  {tile.label}
                </div>
              ))}
            </div>
            <p className="mt-8 max-w-3xl text-lg font-bold leading-8 text-slate-600">
              Learn from expert faculties of Robotics, Arduino, IoT, Coding, Electronics, AI and modern classroom tools.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-8 -top-7 z-10 flex h-14 w-14 items-center justify-center rounded-xl bg-white text-cyan-700 shadow-xl">
              <Users className="h-7 w-7" />
            </div>
            <div className="overflow-hidden rounded-[28px] border-[8px] border-blue-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80"
                alt="Students collaborating on ADYAPAN LMS"
                className="h-[380px] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-5 flex h-14 w-14 items-center justify-center rounded-xl bg-white text-blue-950 shadow-xl">
              <GraduationCap className="h-7 w-7" />
            </div>
          </div>
        </div>
      </section>

      <div className="sticky top-0 z-40 mx-auto flex max-w-3xl gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_14px_34px_rgba(15,23,42,0.10)]">
        {[
          ["Overview", "overview"],
          ["Student Features", "student-features"],
          ["Teacher Features", "teacher-features"],
          ["Exam Software", "exam-software"]
        ].map(([label, id], index) => (
          <button
            key={id}
            onClick={() => goTo(id)}
            className={`h-12 flex-1 rounded-xl text-sm font-black transition hover:bg-blue-700 hover:text-white ${
              index === 0 ? "bg-cyan-600 text-white" : "text-slate-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <SectionShell
        id="overview"
        title="Comprehensive Digital Platform"
        subtitle="ADYAPAN LMS provides schools with class management, curriculum delivery, online/offline assessments, student progress tracking, and teacher support in one integrated platform."
        accent="left"
      >
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
          <div className="grid gap-5 sm:grid-cols-2">
            {overviewCards.map((card) => (
              <div key={card.title} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-700 hover:text-white">
                <card.icon className="h-8 w-8 text-cyan-700 transition group-hover:text-white" />
                <h3 className="mt-5 font-black">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 transition group-hover:text-white/90">{card.copy}</p>
              </div>
            ))}
          </div>
          <div className="rounded-[24px] bg-gradient-to-br from-blue-100 to-white p-8">
            <div className="rounded-2xl bg-white p-10 text-center shadow">
              <Rocket className="mx-auto h-16 w-16 text-blue-950" />
              <h3 className="mt-7 text-2xl font-black">Transform Education</h3>
              <p className="mt-4 leading-7 text-slate-600">
                Empowering educators and engaging students through innovative technology.
              </p>
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        id="student-features"
        title="Student Features"
        subtitle="Empowering students with personalized learning experiences and cutting-edge educational tools."
      >
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {studentFeatures.map((feature, index) => (
            <FeaturePill key={feature} label={feature} active={index === 8} />
          ))}
        </div>
      </SectionShell>

      <SectionShell
        id="teacher-features"
        title="Teacher Features"
        subtitle="Streamlining teaching workflows with AI-powered tools and comprehensive classroom management."
        accent="left"
      >
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {teacherFeatures.map((feature, index) => (
            <FeaturePill key={feature} label={feature} active={index === 10} />
          ))}
        </div>
      </SectionShell>

      <SectionShell
        id="exam-software"
        title="Create & Conduct Any type of Exam with"
        subtitle="ONLINE EXAM SOFTWARE"
      >
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 p-8 text-center">
          <p className="text-lg font-black">Question Preview</p>
          <div className="mx-auto mt-5 max-w-md rounded-xl border border-slate-200 bg-white p-6 font-mono text-sm shadow">
            <p className="font-bold text-slate-700">1x - 2x - 1 at x = 3</p>
            <hr className="my-4" />
            <p className="text-cyan-700">Evaluate at x = 3: f(3) = 1(3) - 2(3) - 1 = -4</p>
          </div>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {examCards.map((card, index) => (
            <div
              key={card.title}
              className={`group rounded-2xl border bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-700 hover:text-white ${
                index === 1 ? "border-blue-300 ring-1 ring-blue-200" : "border-slate-200"
              }`}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white text-cyan-700 transition group-hover:border-white/25 group-hover:bg-white/15 group-hover:text-white">
                <card.icon className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-xl font-black">{card.title}</h3>
              <p className="mt-4 min-h-14 text-sm leading-6 text-slate-600 transition group-hover:text-white/90">{card.copy}</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {card.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 transition group-hover:bg-white/15 group-hover:text-white">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-6 text-center sm:grid-cols-4">
          {[
            ["100%", "Real-time Monitoring"],
            ["Instant", "Auto Grading"],
            ["20+", "Question Types"],
            ["15+", "Security Features"]
          ].map(([value, label]) => (
            <div key={label}>
              <p className="text-2xl font-black text-cyan-700">{value}</p>
              <p className="text-sm text-slate-600">{label}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      <section id="demo" className="relative mt-10 bg-gradient-to-br from-blue-800 via-slate-950 to-cyan-700 px-4 py-16 text-white md:px-6">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-black text-blue-100">Book Your Free Demo</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/85">
            Experience the future of education. Schedule a personalized demo tailored to your school needs.
          </p>
          <form onSubmit={submitDemo} className="mt-8 rounded-3xl border border-white/18 bg-white/10 p-6 text-left shadow-2xl backdrop-blur md:p-8">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold">
                Full Name *
                <input name="name" required placeholder="John Doe" className="h-12 rounded-lg border border-white/10 bg-blue-950/60 px-4 text-white outline-none placeholder:text-white/40" />
              </label>
              <label className="grid gap-2 text-sm font-bold">
                Email Address *
                <input name="email" type="email" required placeholder="john@example.com" className="h-12 rounded-lg border border-white/10 bg-blue-950/60 px-4 text-white outline-none placeholder:text-white/40" />
              </label>
              <label className="grid gap-2 text-sm font-bold md:col-span-2">
                Phone Number *
                <input name="phone" required placeholder="Enter 10 digit phone number" className="h-12 rounded-lg border border-white/10 bg-blue-950/60 px-4 text-white outline-none placeholder:text-white/40" />
              </label>
              <label className="grid gap-2 text-sm font-bold">
                School Name *
                <input name="school" required placeholder="Springfield High School" className="h-12 rounded-lg border border-white/10 bg-blue-950/60 px-4 text-white outline-none placeholder:text-white/40" />
              </label>
              <label className="grid gap-2 text-sm font-bold">
                City *
                <input name="city" required placeholder="Jaipur" className="h-12 rounded-lg border border-white/10 bg-blue-950/60 px-4 text-white outline-none placeholder:text-white/40" />
              </label>
              <label className="grid gap-2 text-sm font-bold md:col-span-2">
                Schedule Call For *
                <select name="schedule" required className="h-12 rounded-lg border border-white/10 bg-blue-950/60 px-4 text-white outline-none">
                  <option value="">Select Option</option>
                  <option>School LMS Demo</option>
                  <option>Robotics & AI Lab</option>
                  <option>Exam Software</option>
                  <option>Teacher Training</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold md:col-span-2">
                Additional Message
                <textarea name="message" rows={4} placeholder="Tell us about your requirements..." className="rounded-lg border border-white/10 bg-blue-950/60 px-4 py-3 text-white outline-none placeholder:text-white/40" />
              </label>
            </div>
            <button className="mt-6 h-14 w-full rounded-xl bg-cyan-600 font-black text-white transition hover:bg-white hover:text-blue-950">
              Submit Demo Request <ArrowRight className="ml-2 inline h-4 w-4" />
            </button>
          </form>
        </div>
      </section>


      {status && (
        <button
          onClick={() => setStatus("")}
          className="fixed bottom-6 left-1/2 z-50 max-w-[92vw] -translate-x-1/2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-950 shadow-2xl"
        >
          {status}
        </button>
      )}
    </main>
  );
}






