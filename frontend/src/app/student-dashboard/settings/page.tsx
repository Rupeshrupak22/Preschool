"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Lock, Camera, ChevronRight, Check, RefreshCw, Eye, EyeOff } from "lucide-react";
import DashboardLayout from "@/components/student-dashboard/DashboardLayout";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Profile fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [classLevel, setClassLevel] = useState("");

  // Notification toggles
  const [liveReminders, setLiveReminders] = useState(true);
  const [homeworkAlerts, setHomeworkAlerts] = useState(true);
  const [testNotifs, setTestNotifs] = useState(true);
  const [achievementAlerts, setAchievementAlerts] = useState(false);

  // Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  useEffect(() => {
    // Fetch from /api/auth/me for basic info
    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setName(data.user.name || "");
          setEmail(data.user.email || "");
          setPhone(data.user.phone || "");
          setRollNumber(data.user.id || "");
          setClassLevel(data.user.class_level || data.user.class_name || data.user.classLevel || "");
          if (data.user.avatar_url || data.user.avatarUrl) {
            setAvatarUrl(data.user.avatar_url || data.user.avatarUrl);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Also fetch from student dashboard API for avatarUrl
    fetch("/api/student-dashboard", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.dashboard?.studentData?.avatarUrl) {
          setAvatarUrl(data.dashboard.studentData.avatarUrl);
        }
      })
      .catch(() => {});
  }, []);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Show preview instead of uploading immediately
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPreviewFile(file);
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
  }

  async function confirmAvatarUpload() {
    if (!previewFile) return;
    setAvatarUploading(true);
    // Upload directly to settings API as multipart (stores as base64 in DB)
    const fd = new FormData();
    fd.append("file", previewFile);
    const res = await fetch("/api/student-dashboard/settings", { method: "POST", body: fd });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.avatarUrl) {
      setAvatarUrl(data.avatarUrl);
      setStatus("Photo uploaded!");
      setTimeout(() => setStatus(""), 3000);
    } else {
      setStatus("Upload failed. Try a smaller image.");
      setTimeout(() => setStatus(""), 3000);
    }
    setAvatarUploading(false);
    setPreviewUrl(null);
    setPreviewFile(null);
  }

  function cancelPreview() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPreviewFile(null);
  }

  async function saveProfile() {
    setSaving(true);
    setStatus("");
    const res = await fetch("/api/student-dashboard/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "profile", name, phone }),
    });
    setSaving(false);
    if (res.ok) { setStatus("Profile saved!"); setTimeout(() => setStatus(""), 3000); }
    else { setStatus("Failed to save."); }
  }

  async function saveNotifications() {
    setSaving(true);
    setStatus("");
    await fetch("/api/student-dashboard/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "notifications", liveReminders, homeworkAlerts, testNotifs, achievementAlerts }),
    });
    setSaving(false);
    setStatus("Notification preferences saved!");
    setTimeout(() => setStatus(""), 3000);
  }

  async function changePassword() {
    if (!currentPassword || !newPassword) { setStatus("Both fields required."); return; }
    if (newPassword !== confirmPassword) { setStatus("Passwords don't match."); return; }
    if (newPassword.length < 6) { setStatus("Password must be 6+ characters."); return; }
    setSaving(true);
    setStatus("");
    const res = await fetch("/api/student-dashboard/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "password", currentPassword, newPassword }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (res.ok) {
      setStatus("Password changed!");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      setTimeout(() => setStatus(""), 3000);
    } else {
      setStatus(data.error || "Password change failed.");
    }
  }

  if (loading) {
    return (
      <DashboardLayout activeSection="/student-dashboard/settings">
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeSection="/student-dashboard/settings">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-950">Settings</h1>
          <p className="mt-1 text-sm text-slate-400">Manage your account and preferences</p>
        </div>

        {status && (
          <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-sm font-bold text-blue-700 flex items-center gap-2">
            <Check className="h-4 w-4" /> {status}
          </div>
        )}

        {/* Photo Preview & Adjustment Modal */}
        {previewUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
              <h3 className="text-base font-black text-slate-900 mb-4">Adjust Your Photo</h3>
              
              {/* Preview circle */}
              <div className="mx-auto mb-4 h-48 w-48 overflow-hidden rounded-full border-4 border-blue-200 bg-slate-100">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  style={{
                    transform: `scale(${zoom}) translate(${offsetX}px, ${offsetY}px)`,
                  }}
                />
              </div>

              {/* Zoom control */}
              <div className="mb-3">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Zoom</label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="mt-1 w-full h-2 rounded-full appearance-none bg-slate-200 cursor-pointer accent-blue-600"
                />
              </div>

              {/* Position controls */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Move X</label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={offsetX}
                    onChange={(e) => setOffsetX(Number(e.target.value))}
                    className="mt-1 w-full h-2 rounded-full appearance-none bg-slate-200 cursor-pointer accent-blue-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Move Y</label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={offsetY}
                    onChange={(e) => setOffsetY(Number(e.target.value))}
                    className="mt-1 w-full h-2 rounded-full appearance-none bg-slate-200 cursor-pointer accent-blue-600"
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mb-4 text-center">This is how your photo will appear on the dashboard</p>

              {/* Actions */}
              <div className="flex gap-3">
                <button onClick={cancelPreview} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
                  Cancel
                </button>
                <button onClick={confirmAvatarUpload} disabled={avatarUploading} className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition disabled:opacity-60">
                  {avatarUploading ? "Uploading..." : "Confirm & Upload"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
          {/* Sidebar nav */}
          <div className="flex flex-col gap-1 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm h-fit">
            {[
              { id: "profile", label: "Profile", icon: User, color: "bg-blue-50 text-blue-600" },
              { id: "notifications", label: "Notifications", icon: Bell, color: "bg-purple-50 text-purple-600" },
              { id: "security", label: "Security", icon: Lock, color: "bg-rose-50 text-rose-600" },
            ].map((s) => (
              <button key={s.id} onClick={() => setActiveSection(s.id)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${activeSection === s.id ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}>
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${s.color}`}>
                  <s.icon className="h-3.5 w-3.5" />
                </div>
                {s.label}
                <ChevronRight className="ml-auto h-3.5 w-3.5 text-slate-300" />
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="space-y-5">
            {/* Profile Section */}
            {activeSection === "profile" && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600`}>
                    <User className="h-4 w-4" />
                  </div>
                  <h2 className="text-sm font-black text-slate-950">Profile</h2>
                </div>

                {/* Avatar upload */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="relative">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="h-20 w-20 rounded-full object-cover border-2 border-blue-200" key={avatarUrl} />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-2xl font-black text-white">
                        {name ? name.charAt(0).toUpperCase() : "S"}
                      </div>
                    )}
                    {/* Only show camera if no avatar uploaded yet */}
                    {!avatarUrl && (
                      <label className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition">
                        <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" className="hidden" onChange={handleAvatarUpload} />
                        {avatarUploading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
                      </label>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{name || "Student"}</p>
                    <p className="text-xs text-slate-500">{email}</p>
                    {avatarUrl ? (
                      <p className="text-xs text-emerald-600 mt-1 font-semibold">✓ Photo uploaded. Contact teacher to change.</p>
                    ) : (
                      <p className="text-xs text-slate-400 mt-1">Click camera icon to upload photo (one-time)</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-slate-400 uppercase">Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-950 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-slate-400 uppercase">Roll Number</label>
                    <input type="text" value={rollNumber} readOnly className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-500 outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-slate-400 uppercase">Class</label>
                    <input type="text" value={classLevel} readOnly className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-500 outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-slate-400 uppercase">Email</label>
                    <input type="email" value={email} readOnly className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-500 outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-slate-400 uppercase">Phone</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-950 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                  </div>
                </div>
                <button onClick={saveProfile} disabled={saving} className="mt-5 rounded-xl bg-slate-950 px-5 py-2.5 text-xs font-black text-white hover:bg-blue-700 transition disabled:opacity-60">
                  {saving ? "Saving..." : "Save Profile"}
                </button>
              </motion.div>
            )}

            {/* Notifications Section */}
            {activeSection === "notifications" && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600"><Bell className="h-4 w-4" /></div>
                  <h2 className="text-sm font-black text-slate-950">Notifications</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <ToggleRow label="Live Class Reminders" enabled={liveReminders} onChange={setLiveReminders} />
                  <ToggleRow label="Homework Due Alerts" enabled={homeworkAlerts} onChange={setHomeworkAlerts} />
                  <ToggleRow label="Test Notifications" enabled={testNotifs} onChange={setTestNotifs} />
                  <ToggleRow label="Achievement Alerts" enabled={achievementAlerts} onChange={setAchievementAlerts} />
                </div>
                <button onClick={saveNotifications} disabled={saving} className="mt-5 rounded-xl bg-slate-950 px-5 py-2.5 text-xs font-black text-white hover:bg-blue-700 transition disabled:opacity-60">
                  {saving ? "Saving..." : "Save Notifications"}
                </button>
              </motion.div>
            )}

            {/* Security Section */}
            {activeSection === "security" && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-600"><Lock className="h-4 w-4" /></div>
                  <h2 className="text-sm font-black text-slate-950">Change Password</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 max-w-lg">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-[11px] font-bold text-slate-400 uppercase">Current Password</label>
                    <div className="relative">
                      <input type={showCurrentPw ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 pr-10 text-sm font-semibold outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                      <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                        {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-slate-400 uppercase">New Password</label>
                    <div className="relative">
                      <input type={showNewPw ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 pr-10 text-sm font-semibold outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                      <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                        {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-slate-400 uppercase">Confirm Password</label>
                    <div className="relative">
                      <input type={showConfirmPw ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 pr-10 text-sm font-semibold outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                      <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                        {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                <button onClick={changePassword} disabled={saving} className="mt-5 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-black text-white hover:bg-rose-700 transition disabled:opacity-60">
                  {saving ? "Changing..." : "Change Password"}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ToggleRow({ label, enabled, onChange }: { label: string; enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <button onClick={() => onChange(!enabled)} className={`relative h-6 w-11 rounded-full transition ${enabled ? "bg-emerald-500" : "bg-slate-300"}`}>
        <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}
