import {
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  CalendarDays,
  CheckCircle2,
  Lightbulb,
  MessageCircle,
  PlayCircle,
  School,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap
} from "lucide-react";

type Icon = React.ComponentType<{ className?: string }>;

const platformCards: { title: string; copy: string; icon: Icon; tone: string }[] = [
  {
    title: "Future Skills Curriculum",
    copy: "Coding, ML, economics, communication, design thinking, and career skills mapped class-wise.",
    icon: Brain,
    tone: "from-purple-500 to-pink-500"
  },
  {
    title: "Smart Learning Dashboard",
    copy: "Subject-wise score, attendance, homework, rank, live classes, and smart improvement insights.",
    icon: BarChart3,
    tone: "from-blue-500 to-cyan-400"
  },
  {
    title: "Mentor-Led Growth",
    copy: "Expert mentors guide students with doubt sessions, project reviews, and confidence building.",
    icon: Users,
    tone: "from-emerald-400 to-teal-500"
  },
  {
    title: "School Partnership",
    copy: "Curriculum rollout, teacher support, workshops, competitions, and progress reporting for schools.",
    icon: School,
    tone: "from-amber-400 to-orange-500"
  }
];

const journey = [
  { title: "Diagnose", copy: "Student level, class, strengths, weak areas, interests, and learning habits are mapped.", icon: Target },
  { title: "Learn", copy: "Live classes, activities, projects, worksheets, and recorded sessions keep learning active.", icon: PlayCircle },
  { title: "Track", copy: "Attendance, homework, subject scores, class rank, and smart analysis stay visible in one place.", icon: Bot },
  { title: "Showcase", copy: "Students build portfolios, earn certificates, and present real outcomes confidently.", icon: Trophy }
];

const outcomes = [
  "Class-wise academic + future skills mapping",
  "Hindi, English, Math, Science, Social Science, AI and Coding reports",
  "Daily live class schedule with recorded backup",
  "Homework, doubt session, and mentor feedback tracking",
  "Parent-friendly progress dashboard and rank visibility",
  "Safe learning environment with guided improvement plans"
];

const stats = [
  ["360°", "Student tracking"],
  ["Growing", "Learning community"],
  ["Expert", "Mentors available"],
  ["Quality", "Education focus"]
];

export default function OverviewPage() {
  return (
    <main className="min-h-screen overflow-hidden text-slate-950">
      {/* HERO SECTION - Matching Reference Image */}
      <section className="relative overflow-hidden px-4 py-20 md:px-6">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/overview_bg.png" 
            alt="Background" 
            className="h-full w-full object-cover"
          />
        </div>
        
        {/* Decorative stars */}
        <div className="absolute left-1/4 top-16">
          <Sparkles className="h-8 w-8 text-yellow-400 fill-yellow-400" />
        </div>
        <div className="absolute right-1/4 top-20">
          <Sparkles className="h-6 w-6 text-yellow-400 fill-yellow-400" />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/80 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-purple-600" />
            ADYAPAN Platform Overview
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl font-black leading-tight text-slate-900 md:text-6xl lg:text-7xl">
            One connected
            <br />
            system for
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              school growth
            </span>
          </h1>

          {/* Description */}
          <div className="mx-auto mt-6 max-w-3xl rounded-2xl border-2 border-white/50 bg-white/80 px-6 py-4 shadow-lg backdrop-blur-sm">
            <p className="text-lg font-semibold leading-relaxed text-slate-700 md:text-xl">
              ADYAPAN combines academics, future skills, LMS, live classes, mentors, progress tracking, AI insights, and school partnerships into one smart learning ecosystem.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/student-dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 font-bold text-white shadow-xl transition hover:scale-105"
            >
              View Student Dashboard
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="/mentors"
              className="inline-flex items-center gap-2 rounded-full border-2 border-slate-300 bg-white/80 px-8 py-4 font-bold text-slate-900 backdrop-blur transition hover:bg-white"
            >
              Explore Features
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Platform Cards Section */}
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {platformCards.map((card) => (
            <article
              key={card.title}
              className="group rounded-[24px] border-2 border-white/70 bg-white/76 p-6 shadow-[0_18px_44px_rgba(99,102,241,0.14)] backdrop-blur transition duration-300 hover:-translate-y-2 hover:border-purple-200 hover:bg-white hover:shadow-[0_26px_60px_rgba(168,85,247,0.22)]"
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.tone} text-white shadow-lg transition group-hover:scale-110`}>
                <card.icon className="h-7 w-7" />
              </div>
              <h2 className="mt-6 text-xl font-black">{card.title}</h2>
              <p className="mt-3 text-sm font-bold leading-6 text-slate-600">{card.copy}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Journey Section */}
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:px-6 lg:grid-cols-[0.86fr_1.14fr]">
        <div className="rounded-[28px] border-2 border-white/70 bg-slate-950 p-7 text-white shadow-[0_28px_80px_rgba(15,23,42,0.24)]">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200">How it works</p>
          <h2 className="mt-4 text-4xl font-black leading-tight">A complete student journey, not only a class.</h2>
          <p className="mt-5 text-base font-semibold leading-7 text-white/70">
            The platform is built to answer the most important parent and school question: what is the child learning,
            where are they improving, and what should happen next?
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {stats.map(([value, label]) => (
              <div key={label} className="rounded-2xl bg-white/10 p-4">
                <p className="text-2xl font-black">{value}</p>
                <p className="mt-1 text-xs font-bold text-white/60">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {journey.map((item, index) => (
            <article
              key={item.title}
              className="group rounded-[24px] border-2 border-white/70 bg-white/78 p-6 shadow-[0_18px_44px_rgba(37,99,235,0.12)] backdrop-blur transition hover:-translate-y-2 hover:border-blue-200 hover:bg-white"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg transition group-hover:scale-110 group-hover:bg-slate-950">
                  <item.icon className="h-6 w-6" />
                </span>
                <span className="text-4xl font-black text-blue-100">0{index + 1}</span>
              </div>
              <h3 className="mt-6 text-2xl font-black">{item.title}</h3>
              <p className="mt-3 text-sm font-bold leading-6 text-slate-600">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Outcomes Section */}
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border-2 border-white/70 bg-white/78 p-7 shadow-[0_20px_58px_rgba(99,102,241,0.14)] backdrop-blur">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-purple-700">What students get</p>
              <h2 className="mt-3 text-4xl font-black">Everything needed for daily learning clarity</h2>
            </div>
            <a href="/dashboard" className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-purple-700">
              Open LMS
            </a>
          </div>
          <div className="mt-7 grid gap-3 md:grid-cols-2">
            {outcomes.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 font-bold text-slate-700 transition hover:-translate-y-1 hover:border-emerald-200 hover:bg-emerald-50">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border-2 border-blue-300 bg-blue-100 p-7 shadow-[0_24px_70px_rgba(59,130,246,0.2)]">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="mx-auto h-72 w-auto rounded-xl object-contain"
          >
            <source src="/overview_video.mp4" type="video/mp4" />
          </video>
          <h2 className="mt-4 text-3xl font-black text-slate-900">Built around the student</h2>
          <p className="mt-3 text-sm font-bold leading-6 text-slate-700">
            Each child sees the right subjects, right reports, right classes, and right improvement plan based on their
            class and learning journey.
          </p>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="rounded-[30px] border-2 border-white/70 bg-white/80 p-7 text-center shadow-[0_24px_70px_rgba(37,99,235,0.14)] backdrop-blur md:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-rose-500 text-white shadow-lg">
            <Lightbulb className="h-8 w-8" />
          </div>
          <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-black">A modern overview for parents, students, and schools.</h2>
          <p className="mx-auto mt-4 max-w-3xl text-base font-bold leading-7 text-slate-600">
            Use this page as the quick explanation of ADYAPAN: what it does, how learning is tracked, and why it is
            different from a normal online class.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="/login" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-emerald-600">
              Join Now <Zap className="h-5 w-5" />
            </a>
            <a href="/#demo" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-slate-200 bg-white px-6 font-black text-slate-950 transition hover:-translate-y-1 hover:border-purple-200">
              Book Demo <CalendarDays className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
