// ============================================================
// ADYAPAN Student 360° Dashboard — Dummy Data & Types
// ============================================================

export interface Student {
  name: string;
  rollNumber: string;
  class: string;
  section: string;
  academicYear: string;
  avatar: string;
  aiInsight: string;
  rank: number;
  totalStudents: number;
}

export interface QuickAccessCard {
  id: string;
  title: string;
  stat: string;
  statLabel: string;
  icon: string;
  gradient: string;
  href: string;
  badge?: string;
}

export interface LiveClass {
  id: string;
  subject: string;
  topic: string;
  teacher: string;
  time: string;
  duration: string;
  isLive: boolean;
  color: string;
}

export interface MetricCard {
  id: string;
  title: string;
  value: string;
  trend: number;
  icon: string;
  color: string;
}

export interface SubjectPerformance {
  subject: string;
  score: number;
  grade: string;
  improvement: number;
  category: "core" | "skill" | "innovation";
}

export interface TestResult {
  id: string;
  subject: string;
  title: string;
  obtained: number;
  total: number;
  date: string;
  status: "excellent" | "good" | "average" | "needs-improvement";
}

export interface UpcomingQuiz {
  id: string;
  subject: string;
  title: string;
  date: string;
  duration: string;
}

export interface HomeworkItem {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  status: "pending" | "submitted" | "overdue";
  priority: "high" | "medium" | "low";
}

export interface NoteItem {
  id: string;
  subject: string;
  title: string;
  type: "pdf" | "note" | "video";
  uploadDate: string;
  size: string;
  bookmarked: boolean;
}

export interface SkillData {
  skill: string;
  value: number;
  fullMark: number;
}

export interface FutureSkill {
  id: string;
  title: string;
  progress: number;
  level: string;
  badges: number;
  nextMilestone: string;
  color: string;
  icon: string;
}

export interface ExtracurricularActivity {
  id: string;
  name: string;
  score: number;
  achievement: string;
  events: number;
  icon: string;
  color: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  earned: boolean;
  date?: string;
}

export interface PerformanceTrend {
  month: string;
  score: number;
  classAvg: number;
}

// ============================================================
// DATA
// ============================================================

export const studentData: Student = {
  name: "Aarav Sharma",
  rollNumber: "ADY-2024-0042",
  class: "Class 9",
  section: "Section A",
  academicYear: "2025–26",
  avatar: "AS",
  aiInsight: "You improved 12% in consistency this month. Keep it up!",
  rank: 4,
  totalStudents: 38,
};

export const quickAccessCards: QuickAccessCard[] = [
  {
    id: "attendance",
    title: "Attendance",
    stat: "94%",
    statLabel: "This Month",
    icon: "calendar-check",
    gradient: "from-emerald-500 to-teal-600",
    href: "/student-dashboard/attendance",
  },
  {
    id: "homework",
    title: "Homework",
    stat: "3",
    statLabel: "Pending",
    icon: "book-open",
    gradient: "from-orange-500 to-amber-600",
    href: "/student-dashboard/homework",
    badge: "3",
  },
  {
    id: "live-classes",
    title: "Live Classes",
    stat: "2",
    statLabel: "Today",
    icon: "video",
    gradient: "from-rose-500 to-pink-600",
    href: "/student-dashboard/live-classes",
    badge: "LIVE",
  },
  {
    id: "notes",
    title: "Notes & PDFs",
    stat: "128",
    statLabel: "Files",
    icon: "file-text",
    gradient: "from-blue-500 to-indigo-600",
    href: "/student-dashboard/notes",
  },
  {
    id: "gamified",
    title: "Gamified",
    stat: "3",
    statLabel: "Games",
    icon: "gamepad-2",
    gradient: "from-purple-500 to-violet-600",
    href: "/student-dashboard/gamified",
    badge: "NEW",
  },
  {
    id: "doubt-section",
    title: "Doubt Section",
    stat: "Ask",
    statLabel: "Mentors",
    icon: "help-circle",
    gradient: "from-orange-500 to-pink-500",
    href: "/student-dashboard/homework",
  },
  {
    id: "recorded-classes",
    title: "Recorded Classes",
    stat: "42",
    statLabel: "Videos",
    icon: "play-circle",
    gradient: "from-cyan-500 to-teal-500",
    href: "/student-dashboard/recorded-classes",
  },
  {
    id: "skills",
    title: "Skill Progress",
    stat: "68%",
    statLabel: "Overall",
    icon: "zap",
    gradient: "from-fuchsia-500 to-purple-600",
    href: "/student-dashboard/skill-progress",
  },
];

export const liveClasses: LiveClass[] = [
  {
    id: "lc1",
    subject: "Mathematics",
    topic: "Quadratic Equations",
    teacher: "Mr. Sharma",
    time: "10:30 AM",
    duration: "45 min",
    isLive: true,
    color: "blue",
  },
  {
    id: "lc2",
    subject: "Science",
    topic: "Newton's Laws of Motion",
    teacher: "Ms. Priya",
    time: "12:00 PM",
    duration: "50 min",
    isLive: false,
    color: "emerald",
  },
  {
    id: "lc3",
    subject: "AI Basics",
    topic: "Introduction to Neural Networks",
    teacher: "Mr. Arjun",
    time: "2:30 PM",
    duration: "40 min",
    isLive: false,
    color: "purple",
  },
  {
    id: "lc4",
    subject: "English",
    topic: "Creative Writing Workshop",
    teacher: "Ms. Kavya",
    time: "4:00 PM",
    duration: "45 min",
    isLive: false,
    color: "rose",
  },
];

export const metricCards: MetricCard[] = [
  { id: "overall",  title: "Overall Score", value: "82%",    trend: 5, icon: "trending-up",  color: "blue" },
  { id: "test-avg", title: "Test Average",  value: "78/100", trend: 3, icon: "bar-chart-2",  color: "purple" },
  { id: "attendance",title: "Attendance",   value: "94%",    trend: 2, icon: "calendar",     color: "emerald" },
  { id: "rank",     title: "Class Rank",    value: "#4",     trend: 2, icon: "trophy",       color: "rose" },
];

export const subjectPerformance: SubjectPerformance[] = [
  { subject: "Mathematics", score: 88, grade: "A+", improvement: 12, category: "core" },
  { subject: "Science", score: 76, grade: "B+", improvement: 5, category: "core" },
  { subject: "English", score: 91, grade: "A+", improvement: 8, category: "core" },
  { subject: "Social Studies", score: 83, grade: "A", improvement: 6, category: "core" },
  { subject: "Hindi", score: 79, grade: "B+", improvement: 4, category: "core" },
  { subject: "Computer Science", score: 95, grade: "A+", improvement: 15, category: "skill" },
  { subject: "AI Basics", score: 89, grade: "A+", improvement: 20, category: "skill" },
];

export const testResults: TestResult[] = [
  { id: "t1", subject: "Mathematics", title: "Unit Test 3 — Algebra", obtained: 44, total: 50, date: "May 18, 2026", status: "excellent" },
  { id: "t2", subject: "Science", title: "Mid-Term Assessment", obtained: 38, total: 50, date: "May 12, 2026", status: "good" },
  { id: "t3", subject: "Computer Science", title: "Practical Exam", obtained: 48, total: 50, date: "May 8, 2026", status: "excellent" },
  { id: "t4", subject: "English", title: "Grammar & Comprehension", obtained: 36, total: 50, date: "May 2, 2026", status: "good" },
  { id: "t5", subject: "AI Basics", title: "Concept Quiz", obtained: 28, total: 40, date: "Apr 28, 2026", status: "average" },
];

export const upcomingQuizzes: UpcomingQuiz[] = [
  { id: "uq1", subject: "Mathematics", title: "Trigonometry Quiz", date: "May 27, 2026", duration: "30 min" },
  { id: "uq2", subject: "Science", title: "Chapter 8 — Light", date: "May 29, 2026", duration: "45 min" },
];

export const homeworkItems: HomeworkItem[] = [
  { id: "hw1", subject: "Mathematics", title: "Exercise 5.3 — Quadratic Equations", dueDate: "May 25, 2026", status: "pending", priority: "high" },
  { id: "hw2", subject: "Science", title: "Lab Report — Refraction Experiment", dueDate: "May 26, 2026", status: "pending", priority: "medium" },
  { id: "hw3", subject: "English", title: "Essay: My Future Career", dueDate: "May 22, 2026", status: "overdue", priority: "high" },
  { id: "hw4", subject: "Computer Science", title: "Python Program — Fibonacci Series", dueDate: "May 20, 2026", status: "submitted", priority: "low" },
  { id: "hw5", subject: "AI Basics", title: "Research: Applications of AI in Healthcare", dueDate: "May 28, 2026", status: "pending", priority: "medium" },
  { id: "hw6", subject: "Robotics", title: "Circuit Design Diagram", dueDate: "May 19, 2026", status: "submitted", priority: "low" },
];

export const notesLibrary: NoteItem[] = [
  { id: "n1", subject: "Mathematics", title: "Quadratic Equations — Complete Notes", type: "pdf", uploadDate: "May 20, 2026", size: "2.4 MB", bookmarked: true },
  { id: "n2", subject: "Science", title: "Newton's Laws — Illustrated Guide", type: "pdf", uploadDate: "May 18, 2026", size: "3.1 MB", bookmarked: false },
  { id: "n3", subject: "Computer Science", title: "Python Basics Cheatsheet", type: "note", uploadDate: "May 15, 2026", size: "0.8 MB", bookmarked: true },
  { id: "n4", subject: "AI Basics", title: "Neural Networks Explained", type: "pdf", uploadDate: "May 12, 2026", size: "4.2 MB", bookmarked: false },
  { id: "n5", subject: "English", title: "Creative Writing Tips", type: "note", uploadDate: "May 10, 2026", size: "1.1 MB", bookmarked: true },
  { id: "n6", subject: "Robotics", title: "Arduino Programming Guide", type: "pdf", uploadDate: "May 8, 2026", size: "5.6 MB", bookmarked: false },
];

export const skillsData: SkillData[] = [
  { skill: "Communication", value: 85, fullMark: 100 },
  { skill: "Coding", value: 92, fullMark: 100 },
  { skill: "Leadership", value: 78, fullMark: 100 },
  { skill: "Creativity", value: 88, fullMark: 100 },
  { skill: "Critical Thinking", value: 82, fullMark: 100 },
  { skill: "Collaboration", value: 90, fullMark: 100 },
];

export const futureSkills: FutureSkill[] = [
  { id: "fs1", title: "AI Skills", progress: 72, level: "Intermediate", badges: 3, nextMilestone: "Complete ML Module", color: "purple", icon: "brain" },
  { id: "fs2", title: "Coding", progress: 88, level: "Advanced", badges: 5, nextMilestone: "Build Full-Stack App", color: "blue", icon: "code-2" },
  { id: "fs3", title: "Entrepreneurship", progress: 45, level: "Beginner", badges: 1, nextMilestone: "Pitch Your Idea", color: "orange", icon: "rocket" },
  { id: "fs4", title: "Financial Literacy", progress: 60, level: "Intermediate", badges: 2, nextMilestone: "Investment Basics", color: "emerald", icon: "trending-up" },
  { id: "fs5", title: "Public Speaking", progress: 80, level: "Advanced", badges: 4, nextMilestone: "TEDx Style Talk", color: "rose", icon: "mic" },
  { id: "fs6", title: "Leadership", progress: 68, level: "Intermediate", badges: 2, nextMilestone: "Lead a Team Project", color: "yellow", icon: "users" },
  { id: "fs7", title: "Creativity", progress: 90, level: "Expert", badges: 6, nextMilestone: "Design Portfolio", color: "fuchsia", icon: "palette" },
  { id: "fs8", title: "Innovation", progress: 55, level: "Intermediate", badges: 2, nextMilestone: "Innovation Challenge", color: "cyan", icon: "lightbulb" },
];

export const extracurricular: ExtracurricularActivity[] = [
  { id: "ec1", name: "Debate Club", score: 92, achievement: "District Champion", events: 8, icon: "message-square", color: "blue" },
  { id: "ec2", name: "Robotics Team", score: 88, achievement: "State Finalist", events: 6, icon: "cpu", color: "purple" },
  { id: "ec3", name: "Sports", score: 75, achievement: "School Captain", events: 12, icon: "activity", color: "emerald" },
  { id: "ec4", name: "Music", score: 82, achievement: "Annual Concert Lead", events: 5, icon: "music", color: "rose" },
  { id: "ec5", name: "Innovation Lab", score: 95, achievement: "Best Project Award", events: 4, icon: "lightbulb", color: "yellow" },
];

export const achievements: Achievement[] = [
  { id: "ach1", title: "Top Coder", description: "Completed 50+ coding challenges", icon: "code-2", color: "blue", earned: true, date: "May 2026" },
  { id: "ach2", title: "Consistency King", description: "30-day learning streak", icon: "flame", color: "orange", earned: true, date: "Apr 2026" },
  { id: "ach3", title: "Science Star", description: "90%+ in Science for 3 months", icon: "star", color: "yellow", earned: true, date: "Mar 2026" },
  { id: "ach4", title: "Debate Champion", description: "Won district debate competition", icon: "trophy", color: "purple", earned: true, date: "Feb 2026" },
  { id: "ach5", title: "AI Pioneer", description: "Completed AI Basics certification", icon: "brain", color: "fuchsia", earned: true, date: "Jan 2026" },
  { id: "ach6", title: "Perfect Attendance", description: "100% attendance for a month", icon: "calendar-check", color: "emerald", earned: false },
  { id: "ach7", title: "Innovation Award", description: "Best project in Innovation Lab", icon: "lightbulb", color: "cyan", earned: false },
  { id: "ach8", title: "Leadership Badge", description: "Lead 3 successful team projects", icon: "users", color: "rose", earned: false },
];

export const performanceTrend: PerformanceTrend[] = [
  { month: "Jan", score: 68, classAvg: 65 },
  { month: "Feb", score: 72, classAvg: 66 },
  { month: "Mar", score: 75, classAvg: 67 },
  { month: "Apr", score: 79, classAvg: 68 },
  { month: "May", score: 82, classAvg: 69 },
  { month: "Jun", score: 85, classAvg: 70 },
];

export const circularPerformanceData = [
  { name: "Excellent (≥85%)", value: 7, color: "#10b981" },
  { name: "Good (70–84%)", value: 4, color: "#f59e0b" },
  { name: "Needs Work (<70%)", value: 2, color: "#ef4444" },
];

export const weeklyProgress = {
  score: 78,
  consistency: 84,
  streak: 14,
  classPercentile: 64,
};
