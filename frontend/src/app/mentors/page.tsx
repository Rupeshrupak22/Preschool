"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  Code2,
  Cpu,
  GraduationCap,
  LineChart,
  Lock,
  Radio,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wifi,
  Zap,
  Star,
  Award,
  Rocket
} from "lucide-react";

export default function MentorsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-24 pb-20">
        {/* Video Background */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/mentor_bg.mp4" type="video/mp4" />
          </video>
          {/* Subtle overlay for text readability - very light */}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
                Where Learning
                <br />
                <span className="text-yellow-300">Feels Fun Again</span>
              </h1>

              <p className="mt-6 text-xl text-purple-100">
                Learning that feels exciting, personal, and interactive for every student — making education more engaging, creative, and enjoyable every day.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-purple-600 shadow-2xl transition"
                >
                  <Rocket className="h-5 w-5" />
                  Start Free Trial
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-sm transition"
                >
                  <Calendar className="h-5 w-5" />
                  Book a Demo
                </motion.button>
              </div>

              <div className="mt-8 flex items-center gap-8">
                <div>
                  <p className="text-3xl font-black text-white">500+</p>
                  <p className="text-sm text-purple-200">Schools Trust Us</p>
                </div>
                <div className="h-12 w-px bg-white/30" />
                <div>
                  <p className="text-3xl font-black text-white">25K+</p>
                  <p className="text-sm text-purple-200">Happy Students</p>
                </div>
                <div className="h-12 w-px bg-white/30" />
                <div>
                  <p className="text-3xl font-black text-white">98%</p>
                  <p className="text-sm text-purple-200">Satisfaction Rate</p>
                </div>
              </div>
            </motion.div>

            {/* Right - Empty space for cleaner look */}
            <div className="relative hidden lg:block">
              <div className="relative h-[500px]">
                {/* Cards removed for cleaner design */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUBJECTS SECTION */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-black text-gray-900 sm:text-5xl">
              Master Future-Ready Skills
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Learn from expert faculties in cutting-edge technologies
            </p>
          </motion.div>

          <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {[
              { name: "Robotics", icon: Cpu, color: "from-blue-500 to-cyan-500" },
              { name: "Coding", icon: Code2, color: "from-green-500 to-emerald-500" },
              { name: "IoT", icon: Wifi, color: "from-cyan-500 to-blue-500" },
              { name: "Electronics", icon: Radio, color: "from-orange-500 to-red-500" },
              { name: "AI/ML", icon: Brain, color: "from-purple-500 to-pink-500" },
              { name: "Programming", icon: Code2, color: "from-pink-500 to-rose-500" },
            ].map((subject, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -10 }}
                className="group cursor-pointer"
              >
                <div className={`flex h-32 flex-col items-center justify-center rounded-2xl bg-gradient-to-br ${subject.color} p-6 shadow-lg transition-shadow group-hover:shadow-2xl`}>
                  <subject.icon className="h-12 w-12 text-white" />
                  <p className="mt-3 text-sm font-bold text-white">{subject.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-black text-gray-900 sm:text-5xl">
              Why Schools Love <span className="text-purple-600">ADYAPAN LMS</span>
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Target, title: "Comprehensive Platform", desc: "All-in-one solution for modern education", color: "blue" },
              { icon: LineChart, title: "Real-time Analytics", desc: "Track progress with powerful insights", color: "green" },
              { icon: Brain, title: "AI-Powered Learning", desc: "Personalized education for every student", color: "purple" },
              { icon: BookOpen, title: "Smart Curriculum", desc: "Organized and structured content", color: "orange" },
              { icon: Users, title: "Collaborative Tools", desc: "Foster teamwork and engagement", color: "pink" },
              { icon: Shield, title: "Secure & Reliable", desc: "Enterprise-grade security", color: "cyan" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group rounded-2xl border-2 border-gray-100 bg-white p-8 shadow-lg transition-all hover:border-purple-200 hover:shadow-2xl"
              >
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 shadow-lg`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOR STUDENTS & TEACHERS */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Students */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-white p-10 shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-gray-900">For Students</h3>
                  <p className="text-gray-600">Learn, grow, and achieve more</p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {[
                  "Personalized Learning Paths",
                  "Interactive Quizzes & Games",
                  "AI Smart Chatbot Assistant",
                  "Gamified Progress Reports",
                  "Unlimited Practice Questions",
                  "Digital Library Access",
                  "Smart Study Planner"
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-green-500" />
                    <p className="font-semibold text-gray-700">{feature}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Teachers */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-white p-10 shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-gray-900">For Teachers</h3>
                  <p className="text-gray-600">Teach smarter, not harder</p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {[
                  "AI Lesson Plan Generator",
                  "Auto Question Paper Maker",
                  "Instant Auto-Grading",
                  "Assignment Management",
                  "Real-time Progress Tracking",
                  "AI Teaching Assistant",
                  "Parent Communication Hub"
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-green-500" />
                    <p className="font-semibold text-gray-700">{feature}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* EXAM SYSTEM */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-black text-white sm:text-5xl">
              Advanced Online Exam System
            </h2>
            <p className="mt-4 text-xl text-purple-100">
              Conduct secure, AI-powered exams with instant results
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: BookOpen, title: "Multiple Formats", desc: "MCQs, Essays, Coding & More" },
              { icon: Zap, title: "Auto Evaluation", desc: "Instant Grading & Feedback" },
              { icon: Lock, title: "Secure Platform", desc: "Anti-Cheating Technology" },
              { icon: Brain, title: "AI Proctoring", desc: "Smart Monitoring System" },
              { icon: Target, title: "Auto Grading", desc: "Save Hours of Work" },
              { icon: LineChart, title: "Instant Reports", desc: "Real-time Analytics" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <feature.icon className="h-12 w-12 text-yellow-300" />
                <h3 className="mt-4 text-xl font-bold text-white">{feature.title}</h3>
                <p className="mt-2 text-purple-100">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: "100%", label: "Student Monitoring" },
              { value: "Instant", label: "Auto Grading" },
              { value: "20+", label: "Question Types" },
              { value: "15+", label: "Security Features" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-5xl font-black text-white">{stat.value}</p>
                <p className="mt-2 text-purple-200">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
