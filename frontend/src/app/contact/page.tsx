"use client";

import { useState } from "react";
import { ArrowRight, Clock3, Instagram, Linkedin, Mail, MapPin, MessageSquare, PhoneCall, Sparkles } from "lucide-react";

export default function ContactPage() {
  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState(false);
  const [attempted, setAttempted] = useState(false);

  async function submitContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);

    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());

    // Check required fields
    const name = (body.name as string)?.trim();
    const email = (body.email as string)?.trim();
    const interest = (body.interest as string)?.trim();
    const message = (body.message as string)?.trim();

    if (!name || !email || !interest || !message) {
      setStatus("Please fill in all required fields.");
      return;
    }

    setStatus("Submitting...");

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, type: "demo" })
    });
    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error || "Please check the form and try again.");
      return;
    }

    setStatus("");
    setSuccess(true);
    setAttempted(false);
    event.currentTarget.reset();
  }

  return (
    <main className="relative min-h-screen">
      {/* Full page background image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/contactus.jpeg')" }}
      />
      <div className="fixed inset-0 bg-black/20" />

      {/* Content overlay */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="px-6 pb-8 pt-16 md:px-10 lg:px-16 lg:pt-20">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-4xl font-black leading-tight tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] md:text-5xl lg:text-6xl">
              Get in touch with <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">our team</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-relaxed text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] md:text-lg">
              Have a question about our courses, classes, or school support? Reach out - our team responds within 24 hours.
            </p>
          </div>
        </section>

        {/* Two Column Layout - Company Information & Personal Information */}
        <section className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-16 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">

            {/* Left Column - Company Information Box (Glossy Translucent) */}
            <div className="rounded-3xl border border-white/20 bg-black/20 p-8 shadow-2xl backdrop-blur-sm md:p-10">
              {/* Adyapan Branding - Cool 2D Style with Pop-up Effect */}
              <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/80 via-indigo-600/80 to-purple-700/80 p-8 shadow-lg backdrop-blur-sm transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-indigo-300/40">
                {/* Decorative background shapes */}
                <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-sm" />
                <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-purple-400/20 blur-md" />
                <div className="absolute right-12 top-4 h-3 w-3 rounded-full bg-yellow-300 animate-pulse" />
                <div className="absolute left-8 bottom-6 h-2 w-2 rounded-full bg-cyan-300 animate-pulse" />
                <div className="absolute right-6 bottom-12 h-2.5 w-2.5 rounded-full bg-pink-300 animate-pulse" />
                {/* Floating geometric shapes */}
                <div className="absolute left-4 top-12 h-6 w-6 rotate-45 rounded-sm border-2 border-white/20 transition-transform duration-700 hover:rotate-90" />
                <div className="absolute bottom-8 right-16 h-4 w-4 rotate-12 rounded-full border-2 border-white/15" />

                <div className="relative flex flex-col items-center text-center">
                  <div className="flex h-24 w-24 items-center justify-center transition-transform duration-500 hover:scale-110 hover:-translate-y-1">
                    <img
                      src="/ady-logo.png"
                      alt="ADYAPAN"
                      className="h-24 w-24 rounded-full object-cover shadow-xl"
                    />
                  </div>
                  <h3 className="mt-4 text-2xl font-black text-white animate-[fadeInUp_0.6s_ease-out_both]">
                    Adyapan <span className="text-cyan-300">School</span>
                  </h3>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-white/85 animate-[fadeInUp_0.8s_ease-out_both]">
                    Empowering young minds through innovative education, personalized learning paths, and dedicated mentorship.
                  </p>
                  <div className="mt-5 flex items-center gap-3 animate-[fadeInUp_1s_ease-out_both]">
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm transition-transform duration-300 hover:scale-110 hover:bg-white/30">🚀 AI Learning</span>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm transition-transform duration-300 hover:scale-110 hover:bg-white/30">🎓 Mentorship</span>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm transition-transform duration-300 hover:scale-110 hover:bg-white/30">💡 Innovation</span>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">Company <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">information</span></h2>
              <p className="mt-4 text-base font-medium text-white/80 leading-relaxed">
                Connect with ADYAPAN School - where education meets innovation. We&apos;re here to support your learning journey.
              </p>

              <div className="mt-10 space-y-6">
                {/* Phone */}
                <a href="tel:+918179124566" className="flex items-start gap-4 group">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm transition-all duration-300 shadow-sm group-hover:bg-green-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-green-500/30 group-hover:scale-110">
                    <PhoneCall className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wide text-white/60 transition-colors duration-300 group-hover:text-green-300">Phone</h3>
                    <p className="mt-1 text-lg font-bold text-white transition-colors duration-300 group-hover:text-green-200">+91 81791 24566</p>
                  </div>
                </a>

                {/* Email */}
                <a href="mailto:support@adyapan.com" className="flex items-start gap-4 group">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm transition-all duration-300 shadow-sm group-hover:bg-red-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-red-500/30 group-hover:scale-110">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wide text-white/60 transition-colors duration-300 group-hover:text-red-300">Email</h3>
                    <p className="mt-1 text-lg font-bold text-white transition-colors duration-300 group-hover:text-red-200">support@adyapan.com</p>
                  </div>
                </a>

                {/* Address */}
                <a
                  href="https://www.google.com/maps?um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KdkGZDKLl8s7MSJtLa_4zSEV&daddr=Sattva+Magnus,+behind+Reliance+Bazaar+Shaikpet,+Sabza+Colony,+Ambedkar+Nagar,+Toli+Chowki,+Hyderabad,+Telangana+500008"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-4 group"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm transition-all duration-300 shadow-sm group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/30 group-hover:scale-110">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wide text-white/60 transition-colors duration-300 group-hover:text-blue-300">Address</h3>
                    <p className="mt-1 text-base font-bold text-white transition-colors duration-300 group-hover:text-blue-200">ADYAPAN EDUTECH PRIVATE LIMITED</p>
                    <p className="text-sm text-white/70 transition-colors duration-300 group-hover:text-blue-200/80">Sattva Magnus, behind Reliance Bazaar Shaikpet,</p>
                    <p className="text-sm text-white/70 transition-colors duration-300 group-hover:text-blue-200/80">Sabza Colony, Ambedkar Nagar, Toli Chowki,</p>
                    <p className="text-sm text-white/70 transition-colors duration-300 group-hover:text-blue-200/80">Hyderabad, Telangana 500008</p>
                  </div>
                </a>

                {/* Hours */}
                <div className="flex items-start gap-4 group">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm transition-all duration-300 shadow-sm group-hover:bg-purple-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-purple-500/30 group-hover:scale-110">
                    <Clock3 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wide text-white/60 transition-colors duration-300 group-hover:text-purple-300">Visit Us</h3>
                    <p className="mt-1 text-lg font-bold text-white transition-colors duration-300 group-hover:text-purple-200">Mon-Sat, 11 AM - 8 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Personal Information Form Box (Glossy Translucent) */}
            <div className="rounded-3xl border border-white/20 bg-black/20 p-8 shadow-2xl backdrop-blur-sm md:p-10">
              <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">Personal <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">information</span></h2>
              <p className="mt-4 text-base font-medium text-white/80 leading-relaxed">
                Fill out the form below and we&apos;ll get back to you as soon as possible.
              </p>

              <form id="contact-form" onSubmit={submitContact} className="mt-8 space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-bold tracking-wide text-white/90">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    className={`mt-2 block w-full rounded-lg border px-4 py-3 text-white placeholder-white/50 shadow-sm backdrop-blur-sm transition focus:outline-none focus:ring-2 ${attempted ? "invalid:border-red-500 invalid:ring-red-500/50" : ""} border-white/20 bg-white/10 focus:border-blue-400 focus:ring-blue-400/50`}
                    required
                  />
                  {attempted && (
                    <p className="mt-1 hidden text-xs text-red-400 peer-invalid:block" />
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-bold tracking-wide text-white/90">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@email.com"
                    className={`mt-2 block w-full rounded-lg border px-4 py-3 text-white placeholder-white/50 shadow-sm backdrop-blur-sm transition focus:outline-none focus:ring-2 ${attempted ? "invalid:border-red-500 invalid:ring-red-500/50" : ""} border-white/20 bg-white/10 focus:border-blue-400 focus:ring-blue-400/50`}
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-bold tracking-wide text-white/90">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    className="mt-2 block w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 shadow-sm backdrop-blur-sm transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  />
                </div>

                {/* Reason */}
                <div>
                  <label htmlFor="interest" className="block text-sm font-bold tracking-wide text-white/90">
                    Reason
                  </label>
                  <select
                    id="interest"
                    name="interest"
                    required
                    defaultValue=""
                    className={`mt-2 block w-full rounded-lg border px-4 py-3 text-white shadow-sm backdrop-blur-sm transition focus:outline-none focus:ring-2 ${attempted ? "invalid:border-red-500 invalid:ring-red-500/50" : ""} border-white/20 bg-white/10 focus:border-blue-400 focus:ring-blue-400/50`}
                  >
                    <option value="" disabled className="text-gray-900">
                      Select a reason
                    </option>
                    <option value="Admission enquiry (Class 1-5)" className="text-gray-900">Admission enquiry (Class 1-5)</option>
                    <option value="Admission enquiry (Class 6-8)" className="text-gray-900">Admission enquiry (Class 6-8)</option>
                    <option value="Admission enquiry (Class 9-10)" className="text-gray-900">Admission enquiry (Class 9-10)</option>
                    <option value="Admission enquiry (Class 11-12)" className="text-gray-900">Admission enquiry (Class 11-12)</option>
                    <option value="Fee related issue" className="text-gray-900">Fee related issue</option>
                    <option value="Teacher or class issue" className="text-gray-900">Teacher or class issue</option>
                    <option value="Exam or result issue" className="text-gray-900">Exam or result issue</option>
                    <option value="School partnership" className="text-gray-900">School partnership</option>
                    <option value="Others" className="text-gray-900">Others</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-bold tracking-wide text-white/90">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className={`mt-2 block w-full resize-none rounded-lg border px-4 py-3 text-white placeholder-white/50 shadow-sm backdrop-blur-sm transition focus:outline-none focus:ring-2 ${attempted ? "invalid:border-red-500 invalid:ring-red-500/50" : ""} border-white/20 bg-white/10 focus:border-blue-400 focus:ring-blue-400/50`}
                  />
                </div>

                {/* Error message */}
                {attempted && status && !success && (
                  <p className="text-sm font-medium text-red-400">{status}</p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[length:200%_200%] bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 px-6 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 animate-[colorShift_4s_ease_infinite] hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Submit request
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* FAQ Section (Glossy Translucent) */}
        <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-16 lg:py-24">
          <div className="rounded-3xl border border-white/20 bg-black/20 p-8 shadow-2xl backdrop-blur-sm md:p-12">
            <h2 className="mb-8 text-center text-3xl font-black tracking-tight text-white md:text-4xl">Frequently Asked <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">Questions</span></h2>
            <div className="mx-auto grid max-w-3xl gap-4">
              <button
                type="button"
                className="flex items-center justify-between rounded-xl border border-white/20 bg-white/10 px-6 py-5 text-left text-base font-semibold text-white shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02]"
              >
                <span>What subjects are taught from Class 1 to 5?</span>
                <MessageSquare className="h-5 w-5 text-white/60" />
              </button>
              <button
                type="button"
                className="flex items-center justify-between rounded-xl border border-white/20 bg-white/10 px-6 py-5 text-left text-base font-semibold text-white shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02]"
              >
                <span>Is there special coaching for Class 10 board exams?</span>
                <MessageSquare className="h-5 w-5 text-white/60" />
              </button>
              <button
                type="button"
                className="flex items-center justify-between rounded-xl border border-white/20 bg-white/10 px-6 py-5 text-left text-base font-semibold text-white shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-500 hover:border-green-400 hover:shadow-lg hover:shadow-green-500/30 hover:scale-[1.02]"
              >
                <span>Do you provide live classes for Class 6 to 8?</span>
                <MessageSquare className="h-5 w-5 text-white/60" />
              </button>
              <button
                type="button"
                className="flex items-center justify-between rounded-xl border border-white/20 bg-white/10 px-6 py-5 text-left text-base font-semibold text-white shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-gradient-to-r hover:from-orange-500 hover:to-yellow-500 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02]"
              >
                <span>What curriculum is followed for Class 11 and 12?</span>
                <MessageSquare className="h-5 w-5 text-white/60" />
              </button>
              <button
                type="button"
                className="flex items-center justify-between rounded-xl border border-white/20 bg-white/10 px-6 py-5 text-left text-base font-semibold text-white shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-gradient-to-r hover:from-rose-500 hover:to-red-500 hover:border-rose-400 hover:shadow-lg hover:shadow-rose-500/30 hover:scale-[1.02]"
              >
                <span>Are there activity-based learning sessions for primary classes?</span>
                <MessageSquare className="h-5 w-5 text-white/60" />
              </button>
              <button
                type="button"
                className="flex items-center justify-between rounded-xl border border-white/20 bg-white/10 px-6 py-5 text-left text-base font-semibold text-white shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-violet-500 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02]"
              >
                <span>How can parents track progress from Class 1 to 12?</span>
                <MessageSquare className="h-5 w-5 text-white/60" />
              </button>
            </div>
          </div>
        </section>

        {/* Build Smarter Decisions Section (Glossy Translucent) */}
        <section className="px-6 py-20 md:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl rounded-3xl border border-white/20 bg-black/20 p-12 text-center shadow-2xl backdrop-blur-sm md:p-16">
            <h2 className="text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
              Build smarter decisions, <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">faster</span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg font-medium leading-relaxed text-white/90 md:text-xl">
              Join thousands of students and schools who trust ADYAPAN School for innovative learning solutions.
              Transform education with AI-powered insights, personalized learning paths, and comprehensive support.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-bold text-blue-600 shadow-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500 hover:via-purple-500 hover:to-cyan-500 hover:text-white hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-[1.03]"
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="/overview"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-8 py-4 text-base font-bold text-white transition-all duration-300 hover:bg-gradient-to-r hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 hover:border-transparent hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-[1.03]"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>

        {/* Map Section (Glossy Translucent) */}
        <section className="px-6 py-16 md:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 text-center text-3xl font-black tracking-tight text-white md:text-4xl">Find <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">Us</span></h2>
            <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-black/20 p-2 shadow-2xl backdrop-blur-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.844789!2d78.399023!3d17.413497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9158edcba987%3A0x123456789abcdef0!2sSattva%20Magnus%2C%20behind%20Reliance%20Bazaar%20Shaikpet%2C%20Sabza%20Colony%2C%20Ambedkar%20Nagar%2C%20Toli%20Chowki%2C%20Hyderabad%2C%20Telangana%20500008!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="ADYAPAN School Office Location"
                className="w-full rounded-xl"
              />
              <a
                href="https://www.google.com/maps?um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KdkGZDKLl8s7MSJtLa_4zSEV&daddr=Sattva+Magnus,+behind+Reliance+Bazaar+Shaikpet,+Sabza+Colony,+Ambedkar+Nagar,+Toli+Chowki,+Hyderabad,+Telangana+500008"
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-6 right-6 inline-flex items-center gap-2 rounded-lg bg-[length:200%_200%] bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 animate-[colorShift_4s_ease_infinite] hover:scale-[1.02] hover:shadow-xl"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </section>

        {/* Social Media Section (Glossy Translucent) */}
        <section className="px-6 py-16 md:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-2xl border border-white/20 bg-black/20 p-8 text-center shadow-2xl backdrop-blur-sm md:p-12">
              <h3 className="text-2xl font-black tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] md:text-3xl">Follow Us on <span className="bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent drop-shadow-none">Social Media</span></h3>
              <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                Stay connected with ADYAPAN School for the latest updates, educational content, and community insights.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="https://www.instagram.com/adyapanschool_?igsh=MXJ0b3FpNzh1YW1vNg=="
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-orange-400 hover:border-pink-400 hover:shadow-lg hover:shadow-pink-500/30 hover:scale-[1.03]"
                >
                  <Instagram className="h-5 w-5" />
                  Instagram
                </a>
                <a
                  href="https://www.linkedin.com/company/adyapan-edutech-pvt-ltd/posts/?feedView=all"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-blue-600 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.03]"
                >
                  <Linkedin className="h-5 w-5" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Success Modal */}
      {success && (
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/90 p-8 text-center shadow-2xl backdrop-blur-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-gray-900">Message Sent!</h3>
            <p className="mx-auto mt-3 max-w-sm text-base text-gray-600">
              Thanks for reaching out. ADYAPAN School team will contact you soon.
            </p>
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-[length:200%_200%] bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 px-8 text-base font-bold text-white transition-all duration-300 animate-[colorShift_4s_ease_infinite] hover:scale-[1.02] hover:shadow-lg"
            >
              OK
            </button>
          </div>
        </button>
      )}

      {/* Status Message */}
      {status && !success && !attempted && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-white/20 bg-white/90 px-6 py-3 text-sm font-semibold text-gray-900 shadow-xl backdrop-blur-sm">
          {status}
        </div>
      )}
    </main>
  );
}
