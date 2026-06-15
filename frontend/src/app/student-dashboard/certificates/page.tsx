"use client";

import { motion } from "framer-motion";
import { Award, Download, QrCode, ExternalLink, CheckCircle2 } from "lucide-react";
import DashboardLayout from "@/components/student-dashboard/DashboardLayout";

const certificates = [
  {
    id: "cert1",
    course: "Python Programming Fundamentals",
    issuedDate: "March 15, 2026",
    credentialId: "ADY-2026-PY-0042",
    status: "active",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "cert2",
    course: "AI & Machine Learning Basics",
    issuedDate: "January 20, 2026",
    credentialId: "ADY-2026-AI-0031",
    status: "active",
    color: "from-purple-500 to-fuchsia-600",
  },
  {
    id: "cert3",
    course: "Public Speaking & Communication",
    issuedDate: "February 10, 2026",
    credentialId: "ADY-2026-PS-0018",
    status: "active",
    color: "from-rose-500 to-pink-600",
  },
  {
    id: "cert4",
    course: "Robotics & Arduino Basics",
    issuedDate: "December 5, 2025",
    credentialId: "ADY-2025-RB-0009",
    status: "active",
    color: "from-orange-500 to-amber-600",
  },
  {
    id: "cert5",
    course: "Design Thinking Workshop",
    issuedDate: "November 22, 2025",
    credentialId: "ADY-2025-DT-0055",
    status: "active",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "cert6",
    course: "Financial Literacy for Students",
    issuedDate: "October 8, 2025",
    credentialId: "ADY-2025-FL-0027",
    status: "active",
    color: "from-cyan-500 to-sky-600",
  },
  {
    id: "cert7",
    course: "Innovation & Entrepreneurship",
    issuedDate: "September 14, 2025",
    credentialId: "ADY-2025-IE-0013",
    status: "active",
    color: "from-yellow-500 to-orange-500",
  },
];

export default function CertificatesPage() {
  return (
    <DashboardLayout activeSection="/student-dashboard/certificates">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-950">Certificates</h1>
            <p className="mt-1 text-sm text-slate-400">{certificates.length} certificates earned</p>
          </div>
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-black text-yellow-700">
            {certificates.length} Earned
          </span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {certificates.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.07)]"
            >
              {/* Certificate Header */}
              <div className={`bg-gradient-to-br ${cert.color} p-5 text-white`}>
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                    <Award className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-black">
                    <CheckCircle2 className="h-3 w-3" /> Verified
                  </div>
                </div>
                <h3 className="mt-3 text-sm font-black leading-snug">{cert.course}</h3>
                <p className="mt-1 text-[11px] text-white/70">Issued: {cert.issuedDate}</p>
              </div>

              {/* Certificate Body */}
              <div className="p-4">
                <div className="mb-3 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                  <QrCode className="h-4 w-4 shrink-0 text-slate-400" />
                  <span className="truncate text-[11px] font-black text-slate-600">{cert.credentialId}</span>
                </div>

                <div className="flex gap-2">
                  <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-black text-slate-600 transition hover:border-blue-300 hover:text-blue-600">
                    <ExternalLink className="h-3 w-3" /> Verify
                  </button>
                  <button className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r ${cert.color} py-2 text-xs font-black text-white shadow-sm transition hover:-translate-y-0.5`}>
                    <Download className="h-3 w-3" /> Download
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
