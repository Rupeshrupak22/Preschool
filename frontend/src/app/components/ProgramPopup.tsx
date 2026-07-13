"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, BookOpen, Lightbulb, Trophy, Layers, Sparkles, GraduationCap } from "lucide-react";

type Icon = React.ComponentType<{ className?: string }>;

interface Program {
  title: string;
  range: string;
  icon: Icon;
  glow: string;
  avatar: string;
  image: string;
  subjects: string[];
  skills: string[];
  activities?: string[];
  competitive?: string[];
  classes?: {
    [key: string]: {
      subjects: string[];
      skills: string[];
      examPrep?: string[];
    };
  };
}

interface ProgramPopupProps {
  program: Program | null;
  onClose: () => void;
  expandedSections: string[];
  toggleSection: (section: string) => void;
}

const sectionColors = [
  { bg: "from-violet-500 to-purple-600", tag: "bg-violet-100 text-violet-700 border-violet-200" },
  { bg: "from-blue-500 to-cyan-500", tag: "bg-blue-100 text-blue-700 border-blue-200" },
  { bg: "from-amber-500 to-orange-500", tag: "bg-amber-100 text-amber-700 border-amber-200" },
  { bg: "from-rose-500 to-pink-500", tag: "bg-rose-100 text-rose-700 border-rose-200" },
  { bg: "from-emerald-500 to-teal-500", tag: "bg-emerald-100 text-emerald-700 border-emerald-200" },
];

const sectionIcons = [BookOpen, Lightbulb, Sparkles, Trophy, Layers];

// SSC specific data additions
const sscExtras: Record<string, { subjects?: string[]; skills?: string[] }> = {
  "Class 1": { subjects: ["Telugu", "Hindi", "EVS"], skills: ["Handwriting", "Rhymes & Stories"] },
  "Class 2": { subjects: ["Telugu", "Hindi", "EVS"], skills: ["Handwriting", "Drawing"] },
  "Class 3": { subjects: ["Telugu", "Hindi", "EVS"], skills: ["Essay Writing", "Drawing"] },
  "Class 4": { subjects: ["Telugu", "Hindi", "EVS", "Social Studies"], skills: ["Storytelling", "Group Activities"] },
  "Class 5": { subjects: ["Telugu", "Hindi", "EVS", "Social Studies"], skills: ["Project Work", "Nature Study"] },
  "Class 6": { subjects: ["Telugu", "Hindi", "Social Studies"], skills: ["Map Reading", "Local History"] },
  "Class 7": { subjects: ["Telugu", "Hindi", "Social Studies"], skills: ["Cultural Activities", "Craft"] },
  "Class 8": { subjects: ["Telugu", "Hindi", "Social Studies"], skills: ["Essay Writing", "Quiz"] },
  "Class 9": { subjects: ["Telugu", "Hindi", "Social Studies", "Biology"], skills: ["Board Exam Pattern", "Time Management"] },
  "Class 10": { subjects: ["Telugu", "Hindi", "Social Studies", "Biology"], skills: ["Board Exam Prep", "Model Papers"] },
  "Class 11": { subjects: ["Telugu", "Sanskrit"], skills: ["State-level Competitions"] },
  "Class 12": { subjects: ["Telugu", "Sanskrit"], skills: ["State Entrance Exams", "EAMCET"] },
};

// CBSE specific data additions
const cbseExtras: Record<string, { subjects?: string[]; skills?: string[] }> = {
  "Class 1": { subjects: ["Hindi", "EVS", "Computer Science"], skills: ["NCERT Activities", "Art & Craft"] },
  "Class 2": { subjects: ["Hindi", "EVS", "Computer Science"], skills: ["NCERT Activities", "Storytelling"] },
  "Class 3": { subjects: ["Hindi", "EVS", "Computer Science"], skills: ["NCERT Projects", "Value Education"] },
  "Class 4": { subjects: ["Hindi", "EVS", "Computer Science", "GK"], skills: ["NCERT Experiments", "Olympiad Prep"] },
  "Class 5": { subjects: ["Hindi", "EVS", "Computer Science", "GK"], skills: ["NCERT Projects", "Olympiad Prep"] },
  "Class 6": { subjects: ["Hindi", "Sanskrit", "Computer Science"], skills: ["NCERT Labs", "Olympiad Training"] },
  "Class 7": { subjects: ["Hindi", "Sanskrit", "Computer Science"], skills: ["NCERT Practicals", "Olympiad Training"] },
  "Class 8": { subjects: ["Hindi", "Sanskrit", "Computer Science"], skills: ["NCERT Practicals", "NTSE Prep"] },
  "Class 9": { subjects: ["Hindi", "IT", "AI"], skills: ["NTSE", "Board Pattern Practice"] },
  "Class 10": { subjects: ["Hindi", "IT", "AI"], skills: ["NTSE", "Board Exam Strategy", "Sample Papers"] },
  "Class 11": { subjects: ["IP", "CS", "Physical Education"], skills: ["JEE/NEET Foundation", "KVPY"] },
  "Class 12": { subjects: ["IP", "CS", "Physical Education"], skills: ["JEE/NEET Intensive", "CUET Prep"] },
};

export default function ProgramPopup({
  program,
  onClose,
}: ProgramPopupProps) {
  const [activeBoard, setActiveBoard] = useState<"ssc" | "cbse">("cbse");

  if (!program) return null;

  const IconComponent = program.icon;

  // Get board-specific extras for subjects/skills
  const getBoardData = (className: string, baseSubjects: string[], baseSkills: string[]) => {
    const extras = activeBoard === "ssc" ? sscExtras[className] : cbseExtras[className];
    const subjects = [...baseSubjects, ...(extras?.subjects || [])];
    const skills = [...baseSkills, ...(extras?.skills || [])];
    return { subjects, skills };
  };

  // Build sections with board-specific data
  const boardLabel = activeBoard === "ssc" ? "SSC" : "CBSE";
  const baseSubjects = program.subjects || [];
  const baseSkills = program.skills || [];

  const sections: { title: string; items: string[] }[] = [];
  if (baseSubjects.length) sections.push({ title: `Subjects (${boardLabel})`, items: baseSubjects });
  if (baseSkills.length) sections.push({ title: "Skills", items: baseSkills });
  if (program.activities?.length) sections.push({ title: "Activities", items: program.activities });
  if (program.competitive?.length) sections.push({ title: "Competitive Exams", items: program.competitive });

  return (
    <motion.div
      key="program-popup"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Popup Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-x-hidden overflow-y-auto rounded-3xl border border-white/15 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky header */}
        <div className="sticky top-0 z-20 border-b border-white/10 bg-slate-900/95 px-6 py-4 backdrop-blur-sm sm:px-8 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-500/20">
                <IconComponent className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white sm:text-2xl">{program.title}</h2>
                <p className="text-xs font-semibold text-white/50">{program.range}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all duration-200 hover:bg-red-500 hover:text-white hover:scale-110"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Board Toggle - SSC / CBSE */}
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/5 p-1.5">
            <button
              onClick={() => setActiveBoard("ssc")}
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-200 ${
                activeBoard === "ssc"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              🏫 SSC Board
            </button>
            <button
              onClick={() => setActiveBoard("cbse")}
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-200 ${
                activeBoard === "cbse"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              📘 CBSE Board
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="px-6 py-6 sm:px-8 sm:py-8">
          {/* Fun intro */}
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 px-4 py-3">
            <GraduationCap className="h-5 w-5 text-purple-400 flex-shrink-0" />
            <p className="text-sm font-medium text-white/80">
              Viewing <span className="font-bold text-purple-300">{activeBoard.toUpperCase()}</span> curriculum for <span className="font-bold text-cyan-300">{program.title}</span> 🚀
            </p>
          </div>

          {/* Sections - full width */}
          <div className="space-y-5">
            {sections.map((section, idx) => {
              const color = sectionColors[idx % sectionColors.length];
              const SectionIcon = sectionIcons[idx % sectionIcons.length];
              return (
                <div
                  key={section.title}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div className={`pointer-events-none absolute -right-4 -top-4 h-14 w-14 rounded-full bg-gradient-to-br ${color.bg} opacity-20 blur-xl`} />

                  <div className="relative">
                    <div className="mb-4 flex items-center gap-2">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${color.bg} shadow-sm`}>
                        <SectionIcon className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-base font-bold text-white">{section.title}</h3>
                      <span className="ml-auto rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-white/50">{section.items.length} items</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {section.items.map((item) => (
                        <span
                          key={item}
                          className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 hover:scale-105 hover:shadow-md cursor-default ${color.tag}`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Class-wise Breakdown with board-specific data */}
          {program.classes && Object.keys(program.classes).length > 0 && (
            <div className="mt-8">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 shadow-sm">
                  <Layers className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-base font-bold text-white">Class-wise Breakdown</h3>
                <span className="ml-2 rounded-full bg-gradient-to-r from-orange-500/20 to-blue-500/20 border border-white/10 px-2.5 py-0.5 text-[10px] font-bold text-white/70">
                  {activeBoard.toUpperCase()}
                </span>
              </div>

              <div className="space-y-3">
                {Object.entries(program.classes).map(([className, data], idx) => {
                  const color = sectionColors[idx % sectionColors.length];
                  const boardData = getBoardData(className, data.subjects, data.skills);
                  return (
                    <div
                      key={className}
                      className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 transition-colors duration-200 hover:bg-white/8"
                    >
                      <div className={`pointer-events-none absolute -right-3 -top-3 h-10 w-10 rounded-full bg-gradient-to-br ${color.bg} opacity-15 blur-xl`} />

                      <div className="relative">
                        <h4 className={`mb-3 text-sm font-black bg-gradient-to-r ${color.bg} bg-clip-text text-transparent`}>
                          📚 {className}
                        </h4>

                        <div className="flex flex-wrap gap-x-6 gap-y-3">
                          <div className="flex-1 min-w-[140px]">
                            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-white/40">Subjects</p>
                            <div className="flex flex-wrap gap-1.5">
                              {boardData.subjects.map((s) => (
                                <span key={s} className="rounded-full border border-purple-400/30 bg-purple-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-purple-300">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex-1 min-w-[140px]">
                            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-white/40">Skills</p>
                            <div className="flex flex-wrap gap-1.5">
                              {boardData.skills.map((s) => (
                                <span key={s} className="rounded-full border border-blue-400/30 bg-blue-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-blue-300">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>

                          {data.examPrep && data.examPrep.length > 0 && (
                            <div className="flex-1 min-w-[140px]">
                              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-white/40">Exam Prep</p>
                              <div className="flex flex-wrap gap-1.5">
                                {data.examPrep.map((e) => (
                                  <span key={e} className="rounded-full border border-rose-400/30 bg-rose-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-rose-300">
                                    {e}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-8 rounded-xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-white/10 px-5 py-4 text-center">
            <p className="text-sm font-bold text-white/70">
              Ready to start your {activeBoard.toUpperCase()} learning journey? ✨
            </p>
            <p className="mt-1 text-xs text-white/50">
              Contact us to enroll in {program.title} ({activeBoard.toUpperCase()} Board) today!
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
