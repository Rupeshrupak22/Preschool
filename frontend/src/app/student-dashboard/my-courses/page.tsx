"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, Play, CheckCircle2, Lock, ArrowRight } from "lucide-react";
import DashboardLayout from "@/components/student-dashboard/DashboardLayout";

const courses = [
  {
    id: "c1", title: "Mathematics — Class 9", progress: 72, totalLessons: 48, completedLessons: 35,
    teacher: "Mr. Sharma", color: "from-blue-500 to-indigo-600", status: "active",
    topics: ["Algebra", "Geometry", "Trigonometry", "Statistics"],
  },
  {
    id: "c2", title: "Science — Class 9", progress: 58, totalLessons: 52, completedLessons: 30,
    teacher: "Ms. Priya", color: "from-emerald-500 to-teal-600", status: "active",
    topics: ["Physics", "Chemistry", "Biology", "Environmental Science"],
  },
  {
    id: "c3", title: "English — Class 9", progress: 85, totalLessons: 36, completedLessons: 31,
    teacher: "Ms. Kavya", color: "from-rose-500 to-pink-600", status: "active",
    topics: ["Grammar", "Literature", "Writing", "Comprehension"],
  },
  {
    id: "c4", title: "Computer Science", progress: 90, totalLessons: 40, completedLessons: 36,
    teacher: "Mr. Arjun", color: "from-cyan-500 to-blue-600", status: "active",
    topics: ["Python", "Data Structures", "Web Basics", "Algorithms"],
  },
  {
    id: "c5", title: "AI Basics", progress: 45, totalLessons: 30, completedLessons: 14,
    teacher: "Mr. Arjun", color: "from-purple-500 to-fuchsia-600", status: "active",
    topics: ["ML Concepts", "Neural Networks", "Data & AI", "Projects"],
  },
  {
    id: "c6", title: "Social Studies", progress: 65, totalLessons: 44, completedLessons: 29,
    teacher: "Ms. Rekha", color: "from-orange-500 to-amber-600", status: "active",
    topics: ["History", "Geography", "Civics", "Economics"],
  },
];

export default function MyCoursesPage() {
  return (
    <DashboardLayout activeSection="/student-dashboard/my-courses">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-950">My Courses</h1>
            <p className="mt-1 text-sm text-slate-400">{courses.length} active courses this semester</p>
          </div>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">
            Class 9 · Section A
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.07)]"
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${course.color} p-4 text-white`}>
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-black">
                    {course.progress}% done
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-black">{course.title}</h3>
                <p className="text-[11px] text-white/70">{course.teacher}</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/20">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    transition={{ duration: 1, delay: i * 0.08 + 0.3 }}
                    className="h-full rounded-full bg-white"
                  />
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    {course.completedLessons}/{course.totalLessons} lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {course.totalLessons - course.completedLessons} remaining
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {course.topics.map((t) => (
                    <span key={t} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                      {t}
                    </span>
                  ))}
                </div>

                <button className={`flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${course.color} py-2.5 text-xs font-black text-white shadow-sm transition hover:-translate-y-0.5`}>
                  <Play className="h-3 w-3 fill-current" /> Continue Learning
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
