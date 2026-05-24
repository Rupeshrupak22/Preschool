"use client";

import { FormEvent, useState } from "react";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Cpu,
  GraduationCap,
  MessageCircle,
  Mic,
  Palette,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  Zap
} from "lucide-react";

type Icon = React.ComponentType<{ className?: string }>;

const mentorStats = [
  ["35+", "Expert mentors"],
  ["12K+", "Learner sessions"],
  ["4.9/5", "Parent rating"],
  ["1:1", "Guided support"]
];

const expertise: { title: string; copy: string; icon: Icon; accent: string }[] = [
  {
    title: "Coding & AI",
    copy: "Scratch, Python, prompt thinking, AI tools, and project-based problem solving.",
    icon: Brain,
    accent: "from-cyan-400 to-blue-500"
  },
  {
    title: "Robotics & IoT",
    copy: "Arduino, sensors, automation models, smart devices, and lab practice.",
    icon: Cpu,
    accent: "from-amber-300 to-orange-500"
  },
  {
    title: "Communication",
    copy: "Public speaking, presentation confidence, pitching, and teamwork habits.",
    icon: Mic,
    accent: "from-emerald-300 to-teal-500"
  },
  {
    title: "Design & Creativity",
    copy: "Visual design, storytelling, idea boards, portfolios, and creative thinking.",
    icon: Palette,
    accent: "from-pink-400 to-fuchsia-500"
  }
];

const mentors = [
  {
    name: "Aarav Mehta",
    role: "AI & Python Mentor",
    focus: "Builds coding confidence through live challenges, AI projects, and portfolio demos.",
    tag: "AI Builder",
    initials: "AM"
  },
  {
    name: "Neha Sharma",
    role: "Robotics Lab Coach",
    focus: "Guides students through sensors, Arduino logic, prototypes, and competition builds.",
    tag: "Robotics",
    initials: "NS"
  },
  {
    name: "Kabir Rao",
    role: "Public Speaking Mentor",
    focus: "Trains students to explain ideas clearly, present confidently, and lead teams.",
    tag: "Confidence",
    initials: "KR"
  },
  {
    name: "Ira Kapoor",
    role: "Creative Tech Mentor",
    focus: "Connects design, storytelling, web pages, and student innovation projects.",
    tag: "Design",
    initials: "IK"
  }
];

const process = [
  "Skill mapping and learner profile",
  "Weekly mentor-led live class",
  "Hands-on assignments and feedback",
  "Parent progress note and next plan",
  "Project showcase and certificate readiness"
];

const support = [
  "Doubt-solving support after sessions",
  "Monthly progress dashboard for parents",
  "Class-wise curriculum alignment",
  "Small batch and 1:1 mentorship options",
  "Safe, friendly, age-appropriate teaching",
  "Project guidance for competitions and portfolios"
];

function NeonCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border border-white/14 bg-white/[0.07] p-6 shadow-[0_22px_70px_rgba(6,182,212,0.10)] backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-cyan-300/70 hover:bg-white/[0.10] hover:shadow-[0_26px_90px_rgba(34,211,238,0.22)] ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-70" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-cyan-400/12 blur-3xl transition group-hover:bg-cyan-300/22" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-12 w-full rounded-2xl border border-white/12 bg-slate-950/72 px-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-400/15"
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="h-12 w-full rounded-2xl border border-white/12 bg-slate-950/72 px-4 text-sm font-semibold text-white outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-400/15"
    />
  );
}

export default function MentorsPage() {
  const [status, setStatus] = useState("");

  async function submitMentorRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Submitting mentor request...");

    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "demo",
        name: body.name,
        email: body.email,
        phone: body.phone,
        classLevel: body.classLevel,
        interest: body.interest,
        message: `Mentor page request: ${body.goal || ""}`.trim()
      })
    });

    const data = await response.json();
    setStatus(response.ok ? "Mentor request received. ADYAPAN team will contact you soon." : data.error);
    if (response.ok) event.currentTarget.reset();
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.22),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(217,70,239,0.20),transparent_28%),linear-gradient(180deg,#020617,#08111f_48%,#020617)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:44px_44px] opacity-45" />

      <section className="relative px-4 pb-16 pt-12 md:px-6">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.88fr_1.12fr]">
          <div>
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-black text-cyan-100 shadow-[0_0_34px_rgba(34,211,238,0.18)]">
              <Sparkles className="h-5 w-5 text-cyan-300" />
              ADYAPAN Mentor Network
            </div>
            <h1 className="max-w-3xl text-5xl font-black leading-[0.98] tracking-tight md:text-7xl">
              Real mentors for{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">
                future-ready
              </span>{" "}
              learners.
            </h1>
            <p className="mt-7 max-w-2xl text-lg font-semibold leading-8 text-slate-300 md:text-xl">
              Students learn faster when they are guided by people who explain clearly, review work honestly, and
              motivate them to build real projects. ADYAPAN mentors combine classroom warmth with modern tech expertise.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#mentor-form"
                className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-cyan-300 px-7 font-black text-slate-950 shadow-[0_0_38px_rgba(34,211,238,0.34)] transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_0_52px_rgba(34,211,238,0.46)]"
              >
                Book Mentor Call <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="tel:+919000000000"
                className="inline-flex h-14 items-center justify-center gap-3 rounded-full border border-white/16 bg-white/8 px-7 font-black text-white transition hover:-translate-y-1 hover:border-fuchsia-300/70 hover:bg-fuchsia-400/14 hover:shadow-[0_0_38px_rgba(217,70,239,0.24)]"
              >
                <MessageCircle className="h-5 w-5" /> Talk to Counsellor
              </a>
            </div>

            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              {mentorStats.map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/12 bg-white/[0.07] p-4 transition hover:-translate-y-1 hover:border-cyan-300/60 hover:bg-white/[0.10]"
                >
                  <p className="text-3xl font-black text-cyan-200">{value}</p>
                  <p className="mt-1 text-sm font-bold text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rounded-[34px] bg-gradient-to-r from-cyan-400/26 via-fuchsia-400/20 to-amber-300/22 blur-2xl" />
            <div className="relative overflow-hidden rounded-[34px] border border-white/16 bg-white/[0.06] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.34)]">
              <img
                src="/assets/mentors-group.png"
                alt="ADYAPAN mentors in a modern technology classroom"
                className="aspect-[16/9] w-full rounded-[26px] object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6 grid gap-3 rounded-3xl border border-white/16 bg-slate-950/64 p-4 backdrop-blur-xl sm:grid-cols-3">
                {[
                  ["Live", "Mentor sessions"],
                  ["Review", "Every project"],
                  ["Guide", "Parent updates"]
                ].map(([value, label]) => (
                  <div key={label}>
                    <p className="text-lg font-black text-white">{value}</p>
                    <p className="text-xs font-bold text-slate-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-4 py-14 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-300">Expertise</p>
              <h2 className="mt-3 text-3xl font-black md:text-5xl">Mentors for every future skill</h2>
            </div>
            <p className="max-w-xl text-base font-semibold leading-7 text-slate-400">
              Every track is designed around clarity, practice, feedback, and student confidence.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {expertise.map((item) => (
              <NeonCard key={item.title}>
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.18)] transition group-hover:scale-110`}>
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-xl font-black">{item.title}</h3>
                <p className="mt-3 min-h-24 text-sm font-semibold leading-6 text-slate-400 transition group-hover:text-slate-200">
                  {item.copy}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-cyan-200">
                  Explore track <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </NeonCard>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-4 py-14 md:px-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.75fr_1fr]">
          <NeonCard className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-fuchsia-300">Mentor promise</p>
            <h2 className="mt-4 text-3xl font-black leading-tight md:text-4xl">
              Not just classes. A guided learning relationship.
            </h2>
            <p className="mt-5 text-base font-semibold leading-7 text-slate-400">
              Our mentors keep students accountable with friendly nudges, project reviews, personal feedback, and
              achievable next steps after every session.
            </p>
            <div className="mt-7 grid gap-3">
              {support.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
                  <p className="text-sm font-bold leading-6 text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </NeonCard>

          <div className="grid gap-5 sm:grid-cols-2">
            {mentors.map((mentor, index) => (
              <NeonCard key={mentor.name}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/30 bg-gradient-to-br from-slate-800 to-slate-950 text-lg font-black text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.16)]">
                      {mentor.initials}
                    </div>
                    <div>
                      <h3 className="text-xl font-black">{mentor.name}</h3>
                      <p className="mt-1 text-sm font-bold text-cyan-200">{mentor.role}</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-black text-slate-300">
                    {mentor.tag}
                  </span>
                </div>
                <p className="mt-5 text-sm font-semibold leading-6 text-slate-400">{mentor.focus}</p>
                <div className="mt-6 flex items-center gap-1 text-amber-300">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star key={`${mentor.name}-${starIndex}`} className="h-4 w-4 fill-current" />
                  ))}
                  <span className="ml-2 text-xs font-black text-slate-400">Verified mentor</span>
                </div>
                <div className={`mt-5 h-1.5 rounded-full bg-gradient-to-r ${
                  index % 2 === 0 ? "from-cyan-300 to-fuchsia-400" : "from-amber-300 to-emerald-300"
                }`} />
              </NeonCard>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-4 py-14 md:px-6">
        <div className="mx-auto max-w-7xl rounded-[34px] border border-white/14 bg-white/[0.06] p-6 shadow-[0_26px_90px_rgba(2,6,23,0.34)] backdrop-blur-xl md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-200">Learning flow</p>
              <h2 className="mt-3 text-3xl font-black md:text-5xl">How mentorship works</h2>
              <p className="mt-5 text-base font-semibold leading-7 text-slate-400">
                The student never feels lost. Every step has a purpose, a mentor check, and a visible outcome.
              </p>
            </div>
            <div className="grid gap-4">
              {process.map((step, index) => (
                <div
                  key={step}
                  className="group grid gap-4 rounded-3xl border border-white/12 bg-slate-950/58 p-4 transition hover:-translate-y-1 hover:border-amber-200/60 hover:bg-slate-900/80 sm:grid-cols-[4rem_1fr]"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-200 text-lg font-black text-slate-950 shadow-[0_0_32px_rgba(253,230,138,0.25)] transition group-hover:scale-110">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-xl font-black">{step}</h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-400">
                      Mentor gives a clear action, checks the work, and helps the learner move to the next milestone.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-4 py-14 md:px-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          {[
            { title: "For Students", icon: GraduationCap, copy: "Personal doubt support, projects, confidence, and skill growth." },
            { title: "For Parents", icon: ShieldCheck, copy: "Progress clarity, safe learning, mentor feedback, and monthly updates." },
            { title: "For Schools", icon: Trophy, copy: "Trained mentors, workshops, competitions, and future skills lab support." }
          ].map((item) => (
            <NeonCard key={item.title}>
              <item.icon className="h-10 w-10 text-cyan-200" />
              <h3 className="mt-6 text-2xl font-black">{item.title}</h3>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-400">{item.copy}</p>
            </NeonCard>
          ))}
        </div>
      </section>

      <section id="mentor-form" className="relative px-4 py-16 md:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-300">Book mentor guidance</p>
            <h2 className="mt-3 text-4xl font-black leading-tight md:text-5xl">
              Find the right mentor for your child.
            </h2>
            <p className="mt-5 text-base font-semibold leading-7 text-slate-400">
              Share class, interest, and goal. Our team will suggest the right mentor track, session format, and next
              learning plan.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { label: "Fast matching", icon: Zap },
                { label: "Safe mentors", icon: ShieldCheck },
                { label: "Project roadmap", icon: Target },
                { label: "Live support", icon: Users }
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/12 bg-white/[0.07] p-4">
                  <item.icon className="h-7 w-7 text-fuchsia-300" />
                  <p className="mt-3 font-black">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={submitMentorRequest}
            className="rounded-[34px] border border-white/14 bg-white/[0.08] p-6 shadow-[0_26px_90px_rgba(34,211,238,0.10)] backdrop-blur-xl md:p-8"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-black text-slate-200">
                Parent / Student Name
                <Field name="name" placeholder="Enter full name" required />
              </label>
              <label className="grid gap-2 text-sm font-black text-slate-200">
                Email
                <Field name="email" type="email" placeholder="name@example.com" required />
              </label>
              <label className="grid gap-2 text-sm font-black text-slate-200">
                Phone
                <Field name="phone" placeholder="10 digit phone number" required />
              </label>
              <label className="grid gap-2 text-sm font-black text-slate-200">
                Class
                <Select name="classLevel" required defaultValue="">
                  <option value="" disabled>
                    Select class
                  </option>
                  <option>Pre School</option>
                  <option>Class 1-5</option>
                  <option>Class 6-8</option>
                  <option>Class 9-12</option>
                </Select>
              </label>
              <label className="grid gap-2 text-sm font-black text-slate-200 md:col-span-2">
                Interest
                <Select name="interest" required defaultValue="">
                  <option value="" disabled>
                    Select mentor track
                  </option>
                  <option>Coding & AI</option>
                  <option>Robotics & IoT</option>
                  <option>Public Speaking</option>
                  <option>Design & Creativity</option>
                  <option>School Partnership</option>
                </Select>
              </label>
              <label className="grid gap-2 text-sm font-black text-slate-200 md:col-span-2">
                Goal
                <Field name="goal" placeholder="Example: improve coding, build robotics project, speaking confidence" />
              </label>
            </div>
            <button className="mt-6 inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-200 font-black text-slate-950 shadow-[0_0_42px_rgba(34,211,238,0.24)] transition hover:-translate-y-1 hover:shadow-[0_0_58px_rgba(217,70,239,0.30)]">
              Request Mentor Match <ArrowRight className="h-5 w-5" />
            </button>
          </form>
        </div>
      </section>

      {status && (
        <button
          onClick={() => setStatus("")}
          className="fixed bottom-6 left-1/2 z-[120] max-w-[92vw] -translate-x-1/2 rounded-2xl border border-cyan-300/30 bg-slate-950 px-5 py-3 text-sm font-black text-cyan-100 shadow-[0_0_36px_rgba(34,211,238,0.22)]"
        >
          {status}
        </button>
      )}
    </main>
  );
}
