"use client";

import { useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  Code2,
  Cpu,
  GraduationCap,
  Laptop,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
  Volume2,
  VolumeX,
  Wifi,
  Zap
} from "lucide-react";

type Icon = React.ComponentType<{ className?: string }>;

const skillTiles: { label: string; icon: Icon; color: string }[] = [
  { label: "Robotics", icon: Cpu, color: "from-orange-500 to-red-500" },
  { label: "Coding", icon: Laptop, color: "from-blue-500 to-indigo-600" },
  { label: "IoT", icon: Wifi, color: "from-green-500 to-emerald-600" },
  { label: "Electronics", icon: Zap, color: "from-yellow-500 to-orange-500" },
  { label: "AI/ML", icon: Brain, color: "from-purple-500 to-pink-500" },
  { label: "Programming", icon: Code2, color: "from-cyan-500 to-blue-600" }
];

const overviewCards: { title: string; copy: string; icon: Icon; gradient: string }[] = [
  { title: "Progress Tracking", copy: "Real-time monitoring of student performance with detailed analytics", icon: BarChart3, gradient: "from-blue-500 to-cyan-500" },
  { title: "AI-Powered Tools", copy: "Smart recommendations and automated tasks for better learning", icon: Brain, gradient: "from-purple-500 to-pink-500" },
  { title: "Curriculum Management", copy: "Organized and structured learning paths for every class", icon: BookOpen, gradient: "from-orange-500 to-red-500" },
  { title: "Collaborative Learning", copy: "Interactive tools for group activities and peer learning", icon: GraduationCap, gradient: "from-green-500 to-emerald-500" }
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

const examCards: { title: string; copy: string; icon: Icon; tags: string[]; gradient: string }[] = [
  {
    title: "Multiple Formats",
    copy: "Support for MCQs, essays, coding challenges, and descriptive questions.",
    icon: BookOpen,
    tags: ["MCQs", "Essays", "Coding", "True/False"],
    gradient: "from-blue-600 to-indigo-600"
  },
  {
    title: "Auto Evaluation",
    copy: "Instant grading and detailed feedback with AI-powered analysis.",
    icon: BarChart3,
    tags: ["Instant Grading", "AI Analysis", "Reports"],
    gradient: "from-purple-600 to-pink-600"
  },
  {
    title: "Secure Platform",
    copy: "Protected exam environment with anti-cheating and monitoring measures.",
    icon: ShieldCheck,
    tags: ["Anti-Cheating", "Secure Browser", "Time Limits"],
    gradient: "from-emerald-600 to-cyan-600"
  }
];

export default function LMSPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  function goTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function toggleMute() {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  }

  return (
    <main className="lms-dashboard-page relative min-h-screen text-gray-900">
      {/* Video Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <video autoPlay muted loop playsInline className="h-full w-full object-cover">
          <source src="/lms-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-white/20" />
      </div>

      {/* Content */}
      <div className="relative z-10">

        {/* Hero */}
        <section className="px-4 pb-20 pt-10 md:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-start gap-14 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/5 bg-transparent backdrop-blur-sm p-8">
                <div className="lms-tilt mb-8 inline-flex items-center gap-3 rounded-full border border-white/50 bg-white/50 backdrop-blur-xl px-5 py-2.5 text-sm font-black text-blue-900 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
                  <Sparkles className="h-5 w-5 text-cyan-600" />
                  AI-Powered Education Platform
                </div>
                <h1 className="lms-text-white text-5xl font-black leading-tight tracking-tight md:text-7xl">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Adyapan</span> LMS
                </h1>
                <p className="lms-text-white mt-6 max-w-xl text-lg font-bold leading-relaxed">
                  AI-powered Learning Management System enriched with dynamic features to enhance teaching efficiency and student engagement for Classes 5–12.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <button
                    onClick={() => goTo("overview")}
                    className="lms-tilt-btn inline-flex h-14 items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 font-black text-white shadow-[0_14px_30px_rgba(6,182,212,0.4)]"
                  >
                    Explore Features <ArrowRight className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => goTo("exam-software")}
                    className="lms-tilt-btn inline-flex h-14 items-center gap-3 rounded-2xl border border-white/50 bg-white/40 backdrop-blur-xl px-8 font-black text-gray-900 shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
                  >
                    Exam Software
                  </button>
                </div>

                {/* Skill Tiles */}
                <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3" style={{ perspective: '1000px' }}>
                  {skillTiles.map((tile) => (
                    <div
                      key={tile.label}
                      className="lms-tilt group flex h-14 items-center gap-3 rounded-xl border border-white/40 bg-white/40 backdrop-blur-xl px-4 font-bold text-gray-900 shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${tile.color} shadow-lg`}>
                        <tile.icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm">{tile.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero Video */}
              <div className="relative flex justify-center">
                <div className="lms-tilt absolute -left-6 -top-6 z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-[0_12px_30px_rgba(6,182,212,0.4)]">
                  <Users className="h-8 w-8" />
                </div>
                <div className="lms-tilt relative overflow-hidden rounded-3xl border-4 border-white/80 shadow-[0_30px_80px_rgba(0,0,0,0.15)] inline-block">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    controls
                    playsInline
                    className="block max-h-[600px] w-auto max-w-full"
                  >
                    <source src="/lms-vid.mp4" type="video/mp4" />
                  </video>
                  {/* Mute/Unmute Button */}
                  <button
                    onClick={toggleMute}
                    className="absolute bottom-12 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
                    aria-label={isMuted ? "Unmute video" : "Mute video"}
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </button>
                </div>
                <div className="lms-tilt absolute -bottom-5 -right-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-[0_12px_30px_rgba(168,85,247,0.4)]">
                  <GraduationCap className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sticky Nav */}
        <div className="sticky top-24 z-40 mx-4 md:mx-auto md:max-w-3xl">
          <div className="flex gap-2 rounded-2xl border border-white/50 bg-white/40 backdrop-blur-xl p-2 shadow-[0_12px_40px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.9)]" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.3) 100%)' }}>
            {[
              ["Overview", "overview"],
              ["Student Features", "student-features"],
              ["Teacher Features", "teacher-features"],
              ["Exam Software", "exam-software"]
            ].map(([label, id], index) => (
              <button
                key={id}
                onClick={() => goTo(id)}
                className={`lms-tilt-btn h-12 flex-1 rounded-xl text-xs font-black sm:text-sm ${
                  index === 0 ? "bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-md" : "text-gray-900 hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-700 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview */}
        <section id="overview" className="px-4 py-20 md:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="text-center rounded-2xl bg-white/45 backdrop-blur-xl p-8 mb-14 border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.3) 100%)' }}>
              <h2 className="text-3xl font-black text-gray-900 md:text-5xl drop-shadow-sm">Comprehensive Digital Platform</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg font-semibold text-gray-900">
                Class management, curriculum delivery, assessments, progress tracking, and teacher support — all in one.
              </p>
            </div>
            <div className="mt-0 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" style={{ perspective: '1200px' }}>
              {overviewCards.map((card) => (
                <div key={card.title} className="lms-tilt group rounded-2xl border border-white/50 bg-white/40 backdrop-blur-xl p-6 shadow-[0_12px_35px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.3) 100%)' }}>
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
                    <card.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mt-5 text-lg font-black text-gray-900">{card.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-900">{card.copy}</p>
                </div>
              ))}
            </div>
            <div className="lms-tilt mt-14 rounded-3xl bg-gradient-to-r from-cyan-600 to-blue-700 p-10 text-center text-white shadow-[0_20px_60px_rgba(6,182,212,0.3)]">
              <Rocket className="mx-auto h-14 w-14" />
              <h3 className="mt-5 text-3xl font-black">Transform Education</h3>
              <p className="mx-auto mt-4 max-w-lg text-lg text-white/90">
                Empowering educators and engaging students through innovative AI-powered technology.
              </p>
            </div>
          </div>
        </section>

        {/* Student Features */}
        <section id="student-features" className="px-4 py-20 md:px-6">
          <div className="lms-tilt mx-auto max-w-6xl rounded-3xl border border-white/50 bg-white/40 backdrop-blur-xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] md:p-12" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.3) 100%)' }}>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 md:text-4xl">Student Features</h2>
              <p className="mt-3 text-gray-800">Personalized learning experiences and cutting-edge tools</p>
            </div>
            <div className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {studentFeatures.map((feature) => (
                <div
                  key={feature}
                  className="lms-tilt-feature flex items-center gap-3 rounded-xl border border-white/50 bg-white/45 backdrop-blur-lg px-4 py-3.5 font-bold text-gray-900 shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)] hover:border-blue-300 hover:bg-white/60"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-600" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Teacher Features */}
        <section id="teacher-features" className="px-4 py-20 md:px-6">
          <div className="lms-tilt mx-auto max-w-6xl rounded-3xl border border-white/50 bg-white/40 backdrop-blur-xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] md:p-12" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.3) 100%)' }}>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 md:text-4xl">Teacher Features</h2>
              <p className="mt-3 text-gray-800">AI-powered tools and comprehensive classroom management</p>
            </div>
            <div className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {teacherFeatures.map((feature) => (
                <div
                  key={feature}
                  className="lms-tilt-feature flex items-center gap-3 rounded-xl border border-white/50 bg-white/45 backdrop-blur-lg px-4 py-3.5 font-bold text-gray-900 shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)] hover:border-purple-300 hover:bg-white/60"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-purple-600" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Exam Software */}
        <section id="exam-software" className="px-4 py-20 md:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="text-center rounded-2xl bg-white/45 backdrop-blur-xl p-8 mb-14 border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.3) 100%)' }}>
              <h2 className="text-3xl font-black text-gray-900 md:text-5xl drop-shadow-sm">Online Exam Software</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg font-semibold text-gray-900">
                Create & conduct any type of exam with our powerful AI-driven platform
              </p>
            </div>
            <div className="mt-0 grid gap-6 lg:grid-cols-3" style={{ perspective: '1200px' }}>
              {examCards.map((card) => (
                <div
                  key={card.title}
                  className="lms-tilt group overflow-hidden rounded-2xl border border-white/50 bg-white/40 backdrop-blur-xl shadow-[0_12px_35px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.3) 100%)' }}
                >
                  <div className={`bg-gradient-to-r ${card.gradient} p-6`}>
                    <card.icon className="h-10 w-10 text-white drop-shadow-md" />
                    <h3 className="mt-4 text-xl font-black text-white drop-shadow-md">{card.title}</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-sm leading-6 font-semibold text-gray-900">{card.copy}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {card.tags.map((tag) => (
                        <span key={tag} className="lms-tilt-feature rounded-full border border-gray-200 bg-white/70 backdrop-blur-lg px-3 py-1 text-xs font-bold text-gray-800 shadow-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="lms-tilt mt-14 grid gap-6 rounded-2xl border border-white/50 bg-white/40 backdrop-blur-xl p-8 text-center shadow-[0_12px_35px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] sm:grid-cols-4" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.3) 100%)' }}>
              {[
                ["100%", "Real-time Monitoring"],
                ["Instant", "Auto Grading"],
                ["20+", "Question Types"],
                ["15+", "Security Features"]
              ].map(([value, label]) => (
                <div key={label}>
                  <p className="text-3xl font-black text-gray-900">{value}</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom spacing */}
        <div className="h-20" />
      </div>
    </main>
  );
}
