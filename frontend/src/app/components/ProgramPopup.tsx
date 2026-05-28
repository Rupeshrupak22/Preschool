"use client";

import { motion } from "framer-motion";
import {
  X,
  ChevronDown,
  ChevronUp,
  Calculator,
  Sparkles,
  Video,
  Target,
  BookOpen,
  Brain,
  Palette,
  Award
} from "lucide-react";

type ProgramData = {
  title: string;
  range: string;
  icon: any;
  glow: string;
  avatar: string;
  image: string;
  subjects: string[];
  skills: string[];
  activities?: string[];
  competitive?: string[];
  classes?: { [key: string]: { subjects: string[]; skills: string[]; examPrep?: string[] } };
};

type Props = {
  program: ProgramData | null;
  onClose: () => void;
  expandedSections: string[];
  toggleSection: (section: string) => void;
};

export default function ProgramPopup({ program, onClose, expandedSections, toggleSection }: Props) {
  if (!program) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm"
      />

      {/* Popup Panel */}
      <motion.div
        initial={{ x: -500, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -500, opacity: 0 }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 200
        }}
        className="fixed left-0 top-0 z-[90] h-full w-full max-w-2xl overflow-hidden"
      >
        {/* Glass Panel */}
        <div className="relative h-full border-r-2 border-white/30 bg-white/20 backdrop-blur-3xl shadow-2xl">
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${program.glow} opacity-20`} />
          
          {/* Content */}
          <div className="relative z-10 flex h-full flex-col">
            {/* Header */}
            <div className="sticky top-0 z-20 border-b border-white/20 bg-white/30 backdrop-blur-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${program.glow.replace(/\/\d+/g, '')} shadow-lg`}>
                    <program.icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">{program.title}</h3>
                    <p className="text-sm font-semibold text-slate-600">{program.range}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/50 backdrop-blur-xl shadow-lg transition hover:bg-white/70"
                >
                  <X className="h-5 w-5 text-slate-700" />
                </motion.button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Class-wise Details */}
                {program.classes && Object.entries(program.classes).map(([className, classData], index) => (
                  <motion.div
                    key={className}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-2xl border border-white/30 bg-white/20 backdrop-blur-xl p-5 shadow-lg"
                  >
                    <div className="mb-4">
                      <h3 className="text-2xl font-black text-slate-900">{className}</h3>
                    </div>

                    {/* Subjects for this class */}
                    <div className="mb-4">
                      <h4 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-700">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        Subjects
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {classData.subjects.map((subject, idx) => (
                          <motion.span
                            key={idx}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: (index * 0.1) + (idx * 0.02) }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2 text-sm font-bold text-blue-700 shadow-sm"
                          >
                            <Calculator className="h-4 w-4" />
                            {subject}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    {/* Skills for this class */}
                    <div className="mb-4">
                      <h4 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-700">
                        <Brain className="h-5 w-5 text-purple-600" />
                        Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {classData.skills.map((skill, idx) => (
                          <motion.span
                            key={idx}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: (index * 0.1) + (idx * 0.02) }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 text-sm font-bold text-purple-700 shadow-sm"
                          >
                            <Sparkles className="h-4 w-4" />
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    {/* Exam Prep for this class (if available) */}
                    {classData.examPrep && (
                      <div>
                        <h4 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-700">
                          <Award className="h-5 w-5 text-orange-600" />
                          Exam Preparation
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {classData.examPrep.map((exam, idx) => (
                            <motion.span
                              key={idx}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: (index * 0.1) + (idx * 0.02) }}
                              whileHover={{ scale: 1.05, y: -2 }}
                              className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 px-4 py-2 text-sm font-bold text-orange-700 shadow-sm"
                            >
                              <Target className="h-4 w-4" />
                              {exam}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer CTA */}
            <div className="sticky bottom-0 z-20 border-t border-white/20 bg-white/30 backdrop-blur-xl p-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full rounded-xl bg-gradient-to-r ${program.glow.replace(/\/\d+/g, '')} px-6 py-4 font-bold text-white shadow-xl transition-shadow hover:shadow-2xl`}
              >
                Enroll in {program.title} Program
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
