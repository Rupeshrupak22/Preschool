"use client";

import { motion } from "framer-motion";
import { User, Bell, Lock, Palette, Globe, ChevronRight } from "lucide-react";
import DashboardLayout from "@/components/student-dashboard/DashboardLayout";

const settingsSections = [
  {
    title: "Profile",
    icon: User,
    color: "bg-blue-50 text-blue-600",
    fields: [
      { label: "Full Name",     value: "Aarav Sharma",       type: "text" },
      { label: "Roll Number",   value: "ADY-2024-0042",      type: "text",  readonly: true },
      { label: "Class",         value: "Class 9 · Section A",type: "text",  readonly: true },
      { label: "Email",         value: "aarav@example.com",  type: "email" },
      { label: "Phone",         value: "+91 98765 43210",    type: "tel" },
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    color: "bg-purple-50 text-purple-600",
    fields: [
      { label: "Live Class Reminders", value: "Enabled",  type: "toggle" },
      { label: "Homework Due Alerts",  value: "Enabled",  type: "toggle" },
      { label: "Test Notifications",   value: "Enabled",  type: "toggle" },
      { label: "Achievement Alerts",   value: "Disabled", type: "toggle" },
    ],
  },
  {
    title: "Security",
    icon: Lock,
    color: "bg-rose-50 text-rose-600",
    fields: [
      { label: "Current Password", value: "••••••••", type: "password" },
      { label: "New Password",     value: "",         type: "password" },
      { label: "Confirm Password", value: "",         type: "password" },
    ],
  },
];

export default function SettingsPage() {
  return (
    <DashboardLayout activeSection="/student-dashboard/settings">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-950">Settings</h1>
          <p className="mt-1 text-sm text-slate-400">Manage your account and preferences</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
          {/* Sidebar nav */}
          <div className="flex flex-col gap-1 rounded-2xl border border-slate-100 bg-white p-3 shadow-[0_4px_16px_rgba(15,23,42,0.06)] h-fit">
            {settingsSections.map((s) => (
              <button
                key={s.title}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
              >
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${s.color}`}>
                  <s.icon className="h-3.5 w-3.5" />
                </div>
                {s.title}
                <ChevronRight className="ml-auto h-3.5 w-3.5 text-slate-300" />
              </button>
            ))}
          </div>

          {/* Forms */}
          <div className="space-y-5">
            {settingsSections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.06)]"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${section.color}`}>
                    <section.icon className="h-4 w-4" />
                  </div>
                  <h2 className="text-sm font-black text-slate-950">{section.title}</h2>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {section.fields.map((field) => (
                    <div key={field.label}>
                      <label className="mb-1 block text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                        {field.label}
                      </label>
                      {field.type === "toggle" ? (
                        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                          <span className="text-sm font-semibold text-slate-700">{field.value}</span>
                          <div className={`h-5 w-9 rounded-full transition ${field.value === "Enabled" ? "bg-emerald-500" : "bg-slate-300"}`}>
                            <div className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${field.value === "Enabled" ? "translate-x-4" : "translate-x-0"}`} />
                          </div>
                        </div>
                      ) : (
                        <input
                          type={field.type}
                          defaultValue={field.value}
                          readOnly={"readonly" in field}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-950 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-400"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <button className="mt-4 rounded-xl bg-slate-950 px-4 py-2 text-xs font-black text-white transition hover:bg-blue-700">
                  Save {section.title}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
