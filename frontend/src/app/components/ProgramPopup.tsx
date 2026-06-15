"use client";

import { motion } from "framer-motion";
import { X, ChevronDown, ChevronUp } from "lucide-react";

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

export default function ProgramPopup({
  program,
  onClose,
  expandedSections,
  toggleSection,
}: ProgramPopupProps) {
  if (!program) return null;

  const IconComponent = program.icon;

  return (
    <motion.div
      key="program-popup"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100">
            <IconComponent className="h-7 w-7 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">{program.title}</h2>
            <p className="text-sm font-semibold text-slate-500">{program.range}</p>
          </div>
        </div>

        {/* Subjects Section */}
        <CollapsibleSection
          title="Subjects"
          sectionKey="subjects"
          expanded={expandedSections.includes("subjects")}
          onToggle={() => toggleSection("subjects")}
        >
          <div className="flex flex-wrap gap-2">
            {program.subjects.map((subject) => (
              <span
                key={subject}
                className="rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700"
              >
                {subject}
              </span>
            ))}
          </div>
        </CollapsibleSection>

        {/* Skills Section */}
        <CollapsibleSection
          title="Skills"
          sectionKey="skills"
          expanded={expandedSections.includes("skills")}
          onToggle={() => toggleSection("skills")}
        >
          <div className="flex flex-wrap gap-2">
            {program.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </CollapsibleSection>

        {/* Activities Section */}
        {program.activities && program.activities.length > 0 && (
          <CollapsibleSection
            title="Activities"
            sectionKey="activities"
            expanded={expandedSections.includes("activities")}
            onToggle={() => toggleSection("activities")}
          >
            <div className="flex flex-wrap gap-2">
              {program.activities.map((activity) => (
                <span
                  key={activity}
                  className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700"
                >
                  {activity}
                </span>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Competitive Exams Section */}
        {program.competitive && program.competitive.length > 0 && (
          <CollapsibleSection
            title="Competitive Exams"
            sectionKey="competitive"
            expanded={expandedSections.includes("competitive")}
            onToggle={() => toggleSection("competitive")}
          >
            <div className="flex flex-wrap gap-2">
              {program.competitive.map((exam) => (
                <span
                  key={exam}
                  className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700"
                >
                  {exam}
                </span>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Class-wise Breakdown */}
        {program.classes && (
          <CollapsibleSection
            title="Class-wise Breakdown"
            sectionKey="classes"
            expanded={expandedSections.includes("classes")}
            onToggle={() => toggleSection("classes")}
          >
            <div className="space-y-4">
              {Object.entries(program.classes).map(([className, data]) => (
                <div
                  key={className}
                  className="rounded-xl border border-slate-100 bg-slate-50/50 p-4"
                >
                  <h4 className="mb-2 text-sm font-bold text-slate-800">
                    {className}
                  </h4>
                  <div className="mb-2">
                    <p className="mb-1 text-xs font-semibold text-slate-500">Subjects</p>
                    <div className="flex flex-wrap gap-1.5">
                      {data.subjects.map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-semibold text-purple-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mb-2">
                    <p className="mb-1 text-xs font-semibold text-slate-500">Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {data.skills.map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  {data.examPrep && data.examPrep.length > 0 && (
                    <div>
                      <p className="mb-1 text-xs font-semibold text-slate-500">Exam Prep</p>
                      <div className="flex flex-wrap gap-1.5">
                        {data.examPrep.map((e) => (
                          <span
                            key={e}
                            className="rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700"
                          >
                            {e}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}
      </motion.div>
    </motion.div>
  );
}

function CollapsibleSection({
  title,
  sectionKey,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  sectionKey: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 rounded-2xl border border-slate-100 bg-slate-50/40">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-sm font-bold text-slate-800">{title}</span>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        )}
      </button>
      {expanded && <div className="px-5 pb-4">{children}</div>}
    </div>
  );
}
