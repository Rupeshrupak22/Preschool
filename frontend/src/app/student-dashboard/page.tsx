"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  BarChart3,
  BookOpen,
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileQuestion,
  FileText,
  GraduationCap,
  LayoutDashboard,
  MessageCircle,
  Mic,
  PlayCircle,
  School,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type DashboardUser = {
  id?: string;
  name: string;
  email: string;
  phone?: string | null;
  classLevel?: string | null;
  schoolName?: string | null;
  role: "student" | "admin";
};

type SubjectReport = {
  subject: string;
  score: number;
  attendance: number;
  homework: number;
  trend: string;
  focus: string;
  color: string;
};

const navItems: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Overview", href: "#overview", icon: LayoutDashboard },
  { label: "Subject Report", href: "#results", icon: BarChart3 },
  { label: "Attendance", href: "#attendance", icon: CheckCircle2 },
  { label: "Live Classes", href: "#courses", icon: PlayCircle },
  { label: "Timetable", href: "#timetable", icon: CalendarDays },
  { label: "Homework", href: "#homework", icon: FileText },
  { label: "Doubts", href: "#doubts", icon: MessageCircle },
  { label: "AI Analyst", href: "#ai-analyst", icon: Bot },
  { label: "Certificates", href: "#certificates", icon: Award },
  { label: "Settings", href: "#settings", icon: ShieldCheck }
];

const subjectSets = {
  preschool: ["English Phonics", "Hindi Rhymes", "Number Skills", "EVS", "Art & Craft", "Communication"],
  primary: ["Hindi", "English", "Mathematics", "EVS", "Computer Basics", "GK", "Art", "Communication"],
  middle: ["Hindi", "English", "Mathematics", "Science", "Social Science", "AI & Coding", "Computer", "Communication"],
  high: ["Hindi", "English", "Mathematics", "Science", "Social Science", "AI & Coding", "Communication", "Career Skills"],
  senior: ["English", "Mathematics", "Physics", "Chemistry", "Computer Science", "AI & Coding", "Communication", "Career Skills"]
};

const scorePattern = [88, 82, 74, 91, 69, 86, 78, 94];
const attendancePattern = [96, 93, 88, 97, 81, 90, 86, 95];
const homeworkPattern = [92, 85, 76, 94, 71, 89, 80, 96];
const colors = [
  "from-blue-500 to-cyan-400",
  "from-rose-500 to-pink-400",
  "from-amber-500 to-yellow-300",
  "from-emerald-500 to-teal-400",
  "from-violet-500 to-fuchsia-400",
  "from-sky-500 to-indigo-400",
  "from-orange-500 to-red-400",
  "from-lime-500 to-emerald-400"
];

const timeSlots = ["09:00 AM", "10:00 AM", "11:15 AM", "12:15 PM", "02:00 PM"];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function getClassNumber(classLevel?: string | null) {
  const match = classLevel?.match(/\d+/);
  return match ? Number(match[0]) : null;
}

function getStage(classLevel?: string | null) {
  const value = (classLevel || "").toLowerCase();
  const classNumber = getClassNumber(value);
  if (value.includes("pre") || value.includes("nursery") || value.includes("kg")) return "preschool";
  if (!classNumber) return "middle";
  if (classNumber <= 5) return "primary";
  if (classNumber <= 8) return "middle";
  if (classNumber <= 10) return "high";
  return "senior";
}

function buildSubjectReports(classLevel?: string | null): SubjectReport[] {
  const stage = getStage(classLevel);
  return subjectSets[stage].map((subject, index) => ({
    subject,
    score: scorePattern[index],
    attendance: attendancePattern[index],
    homework: homeworkPattern[index],
    trend: index % 3 === 0 ? "+6%" : index % 3 === 1 ? "+3%" : "-2%",
    focus:
      scorePattern[index] < 75
        ? "Needs daily revision and extra practice"
        : scorePattern[index] < 85
          ? "Good, improve consistency"
          : "Strong performance, maintain pace",
    color: colors[index % colors.length]
  }));
}

function Pill({ children, tone = "blue" }: { children: React.ReactNode; tone?: "blue" | "green" | "amber" | "rose" }) {
  const styles = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100"
  };

  return <span className={`rounded-full border px-3 py-1 text-xs font-black ${styles[tone]}`}>{children}</span>;
}

function Card({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section
      id={id}
      className={`scroll-mt-28 rounded-[24px] border border-blue-100 bg-white/95 p-5 shadow-[0_18px_55px_rgba(37,99,235,0.12)] backdrop-blur md:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    classLevel: "",
    schoolName: ""
  });

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => response.json().then((data) => ({ ok: response.ok, data })))
      .then(({ ok, data }) => {
        if (!ok || !data.user) {
          router.replace("/login");
          return;
        }

        if (data.user.role === "admin") {
          router.replace("/admin");
          return;
        }

        setUser(data.user);
        setProfile({
          name: data.user.name ?? "",
          phone: data.user.phone ?? "",
          classLevel: data.user.classLevel ?? "",
          schoolName: data.user.schoolName ?? ""
        });
      })
      .catch(() => router.replace("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const reports = useMemo(() => buildSubjectReports(profile.classLevel || user?.classLevel), [profile.classLevel, user?.classLevel]);
  const averageScore = Math.round(reports.reduce((sum, item) => sum + item.score, 0) / reports.length);
  const averageAttendance = Math.round(reports.reduce((sum, item) => sum + item.attendance, 0) / reports.length);
  const weakest = reports.reduce((low, item) => (item.score < low.score ? item : low), reports[0]);
  const strongest = reports.reduce((high, item) => (item.score > high.score ? item : high), reports[0]);
  const classLabel = profile.classLevel || user?.classLevel || "Class 8";
  const initial = user?.name?.trim()?.[0]?.toUpperCase() || "A";

  const timetable = days.map((day, dayIndex) => ({
    day,
    sessions: timeSlots.map((time, slotIndex) => {
      const subject = reports[(dayIndex + slotIndex) % reports.length].subject;
      return { time, subject, mode: slotIndex === 2 ? "Live" : slotIndex === 4 ? "Recorded" : "Class" };
    })
  }));

  const liveSessions = reports.slice(0, 4).map((report, index) => ({
    subject: report.subject,
    mentor: ["Aarav Sir", "Neha Ma'am", "Kabir Sir", "Ira Ma'am"][index],
    time: ["Today 4:00 PM", "Today 5:00 PM", "Tomorrow 4:30 PM", "Friday 5:30 PM"][index],
    status: index === 0 ? "Live now" : index === 1 ? "Upcoming" : "Recorded available"
  }));

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center px-4 text-slate-950">
        <div className="rounded-2xl border border-blue-100 bg-white px-6 py-5 text-sm font-black shadow-glass">
          Opening your 360 dashboard...
        </div>
      </main>
    );
  }

  if (!user) return <main className="min-h-screen" />;

  return (
    <main className="min-h-screen px-4 pb-12 pt-7 text-slate-950 md:px-6">
      <div className="mx-auto grid max-w-[1500px] gap-6 xl:grid-cols-[280px_1fr]">
        <aside className="xl:sticky xl:top-24 xl:h-[calc(100vh-112px)]">
          <div className="rounded-[28px] border border-blue-100 bg-white/95 p-4 shadow-[0_22px_60px_rgba(37,99,235,0.14)]">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-950 p-4 text-white">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-rose-500 text-xl font-black text-slate-950">
                {initial}
              </div>
              <div className="min-w-0">
                <p className="truncate text-lg font-black">{user.name}</p>
                <p className="truncate text-xs font-bold text-white/60">{classLabel}</p>
              </div>
            </div>
            <nav className="mt-4 grid gap-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black text-slate-700 transition hover:-translate-y-0.5 hover:bg-blue-600 hover:text-white hover:shadow-[0_12px_28px_rgba(37,99,235,0.24)]"
                >
                  <item.icon className="h-5 w-5 text-blue-700 transition group-hover:text-white" />
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <div className="space-y-6">
          <Card id="overview" className="overflow-hidden">
            <div className="grid gap-6 lg:grid-cols-[1fr_390px]">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <Pill tone="blue">Student 360 Track Board</Pill>
                  <Pill tone="green">Active learner</Pill>
                  <Pill tone="amber">Rank #7 / 42</Pill>
                </div>
                <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
                  Welcome, {user.name}
                </h1>
                <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-slate-600 md:text-lg">
                  Full academic, skill, attendance, live class, homework, doubt and AI improvement tracking for {classLabel}.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    ["Overall Score", `${averageScore}%`, BarChart3, "text-blue-700"],
                    ["Attendance", `${averageAttendance}%`, CheckCircle2, "text-emerald-700"],
                    ["Class Rank", "#7", Trophy, "text-amber-600"],
                    ["Open Doubts", "3", MessageCircle, "text-rose-600"]
                  ].map(([label, value, Icon, color]) => (
                    <div key={label as string} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-blue-300">
                      <Icon className={`h-7 w-7 ${color}`} />
                      <p className="mt-4 text-3xl font-black">{value as string}</p>
                      <p className="mt-1 text-sm font-bold text-slate-500">{label as string}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[24px] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-700 p-5 text-white shadow-[0_24px_60px_rgba(15,23,42,0.22)]">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/12 text-3xl font-black">
                    {initial}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-2xl font-black">{user.name}</p>
                    <p className="mt-1 text-sm font-semibold text-white/70">{user.email}</p>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-white/10 p-3">
                    <p className="font-bold text-white/60">Class</p>
                    <p className="mt-1 font-black">{classLabel}</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-3">
                    <p className="font-bold text-white/60">School</p>
                    <p className="mt-1 truncate font-black">{profile.schoolName || "ADYAPAN School"}</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-3">
                    <p className="font-bold text-white/60">Mobile</p>
                    <p className="mt-1 font-black">{profile.phone || "Not added"}</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-3">
                    <p className="font-bold text-white/60">Curriculum</p>
                    <p className="mt-1 font-black">School + Future Skills</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <Card id="results">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-700">Subject-wise report</p>
                  <h2 className="mt-1 text-3xl font-black">Academic + skill performance</h2>
                </div>
                <Pill tone="green">Auto subjects for {classLabel}</Pill>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {reports.map((report) => (
                  <article key={report.subject} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_16px_34px_rgba(37,99,235,0.12)]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-black">{report.subject}</h3>
                        <p className="mt-1 text-xs font-bold text-slate-500">{report.focus}</p>
                      </div>
                      <span className="rounded-full bg-slate-950 px-3 py-1 text-sm font-black text-white">{report.score}%</span>
                    </div>
                    <div className="mt-4 h-3 rounded-full bg-slate-100">
                      <div className={`h-full rounded-full bg-gradient-to-r ${report.color}`} style={{ width: `${report.score}%` }} />
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-black">
                      <div className="rounded-xl bg-slate-50 p-2">Att. {report.attendance}%</div>
                      <div className="rounded-xl bg-slate-50 p-2">HW {report.homework}%</div>
                      <div className={`rounded-xl p-2 ${report.trend.startsWith("-") ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
                        {report.trend}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </Card>

            <div className="space-y-6">
              <Card id="ai-analyst">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
                    <Bot className="h-7 w-7" />
                  </span>
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-700">AI analyst</p>
                    <h2 className="text-2xl font-black">Improvement plan</h2>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl bg-rose-50 p-4">
                    <p className="text-sm font-black text-rose-700">Needs more effort</p>
                    <p className="mt-1 text-xl font-black">{weakest.subject}</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                      Practice 20 minutes daily, solve 10 questions, and attend the next doubt session.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-sm font-black text-emerald-700">Strong area</p>
                    <p className="mt-1 text-xl font-black">{strongest.subject}</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                      Keep this momentum and use it for class rank improvement.
                    </p>
                  </div>
                  {["Revise weak subject before live class", "Complete pending homework first", "Ask mentor for concept doubt", "Watch missed recorded session"].map((item) => (
                    <div key={item} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm font-bold">
                      <Sparkles className="h-5 w-5 shrink-0 text-blue-700" />
                      {item}
                    </div>
                  ))}
                </div>
              </Card>

              <Card id="attendance">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">Attendance</p>
                <h2 className="mt-1 text-2xl font-black">Overall {averageAttendance}%</h2>
                <div className="mt-5 space-y-3">
                  {reports.slice(0, 5).map((report) => (
                    <div key={report.subject}>
                      <div className="flex justify-between text-sm font-black">
                        <span>{report.subject}</span>
                        <span>{report.attendance}%</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${report.attendance}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
            <Card id="courses">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-rose-700">Live and recorded classes</p>
                  <h2 className="mt-1 text-3xl font-black">Class sessions</h2>
                </div>
                <Pill tone="rose">Click live link to start</Pill>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {liveSessions.map((session) => (
                  <article key={session.subject} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-rose-300">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-black">{session.subject}</h3>
                        <p className="mt-1 text-sm font-bold text-slate-500">{session.mentor} • {session.time}</p>
                      </div>
                      <Pill tone={session.status === "Live now" ? "green" : session.status === "Upcoming" ? "amber" : "blue"}>
                        {session.status}
                      </Pill>
                    </div>
                    <button
                      onClick={() => setStatus(session.status === "Recorded available" ? `${session.subject} recording opened.` : `${session.subject} live class starting...`)}
                      className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 font-black text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
                    >
                      <PlayCircle className="h-5 w-5" />
                      {session.status === "Recorded available" ? "Watch Recording" : "Start Class"}
                    </button>
                  </article>
                ))}
              </div>
            </Card>

            <Card id="certificates">
              <div className="flex items-center gap-3">
                <Award className="h-9 w-9 text-amber-500" />
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-700">Certificates</p>
                  <h2 className="text-2xl font-black">Achievements</h2>
                </div>
              </div>
              <div className="mt-5 rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-4">
                <p className="font-black">Future Skills Starter</p>
                <p className="mt-2 text-sm font-semibold text-slate-600">Complete 80% score and 85% attendance to unlock certificate.</p>
                <button
                  onClick={() => setStatus("Certificate will unlock after eligibility is complete.")}
                  className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-amber-500 px-4 text-sm font-black text-white"
                >
                  <Download className="h-4 w-4" /> Download
                </button>
              </div>
            </Card>
          </div>

          <Card id="timetable">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-700">Monday to Friday</p>
            <h2 className="mt-1 text-3xl font-black">Subject-wise class timetable</h2>
            <div className="mt-6 overflow-x-auto">
              <div className="min-w-[820px] overflow-hidden rounded-2xl border border-slate-200">
                {timetable.map((dayPlan, index) => (
                  <div key={dayPlan.day} className={`grid grid-cols-[140px_repeat(5,1fr)] ${index !== timetable.length - 1 ? "border-b border-slate-200" : ""}`}>
                    <div className="bg-slate-950 p-4 font-black text-white">{dayPlan.day}</div>
                    {dayPlan.sessions.map((session) => (
                      <div key={`${dayPlan.day}-${session.time}`} className="border-l border-slate-200 bg-white p-4">
                        <p className="text-xs font-black text-slate-400">{session.time}</p>
                        <p className="mt-1 font-black">{session.subject}</p>
                        <p className="mt-1 text-xs font-bold text-blue-700">{session.mode}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <div className="grid gap-6 xl:grid-cols-2">
            <Card id="homework">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-700">Homework</p>
              <h2 className="mt-1 text-3xl font-black">Pending and submitted work</h2>
              <div className="mt-6 space-y-3">
                {reports.slice(0, 5).map((report, index) => (
                  <div key={report.subject} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4">
                    <div>
                      <p className="font-black">{report.subject}</p>
                      <p className="mt-1 text-sm font-bold text-slate-500">{index % 2 === 0 ? "Worksheet due today" : "Submitted for review"}</p>
                    </div>
                    <Pill tone={index % 2 === 0 ? "amber" : "green"}>{index % 2 === 0 ? "Pending" : "Done"}</Pill>
                  </div>
                ))}
              </div>
            </Card>

            <Card id="doubts">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-rose-700">Doubt session</p>
              <h2 className="mt-1 text-3xl font-black">Ask mentor support</h2>
              <div className="mt-6 grid gap-3">
                {[
                  [`${weakest.subject} concept doubt`, "Open"],
                  ["Homework clarification", "In review"],
                  ["Project idea feedback", "Resolved"]
                ].map(([title, state]) => (
                  <div key={title} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
                    <FileQuestion className="h-7 w-7 text-rose-600" />
                    <div className="flex-1">
                      <p className="font-black">{title}</p>
                      <p className="mt-1 text-sm font-bold text-slate-500">Mentor response tracked here</p>
                    </div>
                    <Pill tone={state === "Resolved" ? "green" : "rose"}>{state}</Pill>
                  </div>
                ))}
                <a href="/mentors" className="inline-flex h-12 items-center justify-center rounded-xl bg-rose-600 font-black text-white transition hover:-translate-y-1 hover:bg-slate-950">
                  Book Doubt Session
                </a>
              </div>
            </Card>
          </div>

          <Card id="settings">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-700">Settings and safety</p>
              <h2 className="mt-1 text-3xl font-black">Learning controls</h2>
              <div className="mt-6 grid gap-3">
                {[
                  ["Account Security", "Password, session and login protection.", ShieldCheck],
                  ["Parent Updates", "Weekly report and attendance alerts.", Users],
                  ["School Curriculum", "Academic plus future-skills mapping.", School],
                  ["Goal Tracking", "Rank, score and project milestones.", Target]
                ].map(([title, copy, Icon]) => (
                  <div key={title as string} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                    <Icon className="h-6 w-6 shrink-0 text-blue-700" />
                    <div>
                      <p className="font-black">{title as string}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-600">{copy as string}</p>
                    </div>
                  </div>
                ))}
              </div>
          </Card>
        </div>
      </div>

      {status && (
        <button onClick={() => setStatus("")} className="fixed bottom-6 left-1/2 z-50 max-w-[92vw] -translate-x-1/2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-2xl">
          {status}
        </button>
      )}
    </main>
  );
}
