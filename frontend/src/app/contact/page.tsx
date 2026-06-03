"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Atom, BookOpen, BriefcaseBusiness, Building2, ChevronDown, Clock3, GraduationCap, Heart, Instagram, Linkedin, Mail, MapPin, MessageSquare, Pencil, PhoneCall, PlaySquare, Send, Sparkles, Star, X } from "lucide-react";

const socialFaqs = [
  {
    question: "How do I enroll in a course?",
    answer:
      "Students can enroll by exploring our programs, selecting a suitable course, and completing the registration process through our admissions team.",
    icon: BookOpen,
  },
  {
    question: "Are classes live or recorded?",
    answer:
      "We provide a combination of live interactive sessions and recorded learning resources so students can learn at their own pace.",
    icon: PlaySquare,
  },
  {
    question: "Do you provide placement support?",
    answer:
      "Our programs focus on future skills, project-based learning, certifications and career readiness guidance to help students prepare for future opportunities.",
    icon: BriefcaseBusiness,
  },
];

export default function ContactPage() {
  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState(false);
  const [activeSocialFaq, setActiveSocialFaq] = useState<number | null>(null);

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Submitting...");

    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());
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
    event.currentTarget.reset();
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section with Scenic Background */}
      <section className="relative z-20 flex aspect-[16/9] min-h-[420px] items-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/contactus.jpeg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/45 via-blue-950/25 to-transparent" />
        <div className="absolute inset-0 backdrop-blur-[3px]" />
        
        <div className="relative mx-auto w-full max-w-7xl -translate-y-6 px-4 py-12 md:-translate-y-8 md:px-6 lg:-translate-y-10 lg:py-16">
          <div className="max-w-4xl">
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/55 bg-white/25 px-6 py-3 text-sm font-extrabold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_14px_40px_rgba(15,23,42,0.2)] backdrop-blur-xl md:text-base">
              <Sparkles className="h-5 w-5 text-sky-500" />
              Contact ADYAPAN
            </div>
            <h1 className="max-w-4xl text-[46px] font-black leading-[1.05] tracking-normal text-white drop-shadow-[0_6px_24px_rgba(15,23,42,0.45)] sm:text-[58px] md:text-[72px] lg:text-[86px]">
              <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                Get in touch
              </span>{" "}
              with our team
            </h1>
            <p className="mt-6 max-w-3xl rounded-2xl border border-white/35 bg-white/20 px-5 py-4 text-lg font-extrabold leading-8 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_16px_45px_rgba(15,23,42,0.18)] backdrop-blur-[18px] drop-shadow-[0_4px_18px_rgba(15,23,42,0.5)] md:text-2xl md:leading-10">
              Have a question about our courses, classes, or school support? Reach out - our team responds within 24 hours.
            </p>
          </div>
        </div>
      </section>

      <div className="relative isolate overflow-hidden">
        <video
          className="fixed inset-0 -z-20 h-screen w-screen object-cover"
          src="/videos/contactus.mp4"
          poster="/contactus2.jpeg"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <div className="fixed inset-0 -z-10 bg-white/75" />

      {/* Two Column Layout - Company Information & Personal Information */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:px-6 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          
          {/* Left Column - Company Information Box */}
          <div className="rounded-3xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8 shadow-xl backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-blue-300 hover:shadow-[0_28px_80px_rgba(37,99,235,0.18)] md:p-10">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Company information</h2>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              Connect with ADYAPAN - where education meets innovation. We're here to support your learning journey.
            </p>

            <div className="mt-10 space-y-6">
              {/* Phone */}
              <a href="tel:+918179124566" className="group flex items-start gap-4 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/60 hover:p-3 hover:shadow-[0_12px_30px_rgba(37,99,235,0.12)]">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-[0_12px_28px_rgba(37,99,235,0.25)]">
                  <PhoneCall className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">Phone</h3>
                  <p className="mt-1 text-lg font-bold text-gray-900">+91 81791 24566</p>
                </div>
              </a>

              {/* Email */}
              <a href="mailto:support@adyapan.com" className="group flex items-start gap-4 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/60 hover:p-3 hover:shadow-[0_12px_30px_rgba(37,99,235,0.12)]">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-[0_12px_28px_rgba(37,99,235,0.25)]">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">Email</h3>
                  <p className="mt-1 text-lg font-bold text-gray-900">support@adyapan.com</p>
                </div>
              </a>

              {/* Address */}
              <a 
                href="https://www.google.com/maps?um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KdkGZDKLl8s7MSJtLa_4zSEV&daddr=Sattva+Magnus,+behind+Reliance+Bazaar+Shaikpet,+Sabza+Colony,+Ambedkar+Nagar,+Toli+Chowki,+Hyderabad,+Telangana+500008"
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-4 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/60 hover:p-3 hover:shadow-[0_12px_30px_rgba(37,99,235,0.12)]"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-[0_12px_28px_rgba(37,99,235,0.25)]">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">Address</h3>
                  <p className="mt-1 text-base font-bold text-gray-900">ADYAPAN EDUTECH PRIVATE LIMITED</p>
                  <p className="text-sm text-gray-600">Sattva Magnus, behind Reliance Bazaar Shaikpet,</p>
                  <p className="text-sm text-gray-600">Sabza Colony, Ambedkar Nagar, Toli Chowki,</p>
                  <p className="text-sm text-gray-600">Hyderabad, Telangana 500008</p>
                </div>
              </a>

              {/* Hours */}
              <div className="group flex items-start gap-4 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/60 hover:p-3 hover:shadow-[0_12px_30px_rgba(37,99,235,0.12)]">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-[0_12px_28px_rgba(37,99,235,0.25)]">
                  <Clock3 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">Visit Us</h3>
                  <p className="mt-1 text-lg font-bold text-gray-900">Mon-Sat, 11 AM - 8 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Personal Information Form Box */}
          <div className="rounded-3xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 via-white to-pink-50 p-8 shadow-xl backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-purple-300 hover:shadow-[0_28px_80px_rgba(147,51,234,0.18)] md:p-10">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Personal information</h2>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>

            <form id="contact-form" onSubmit={submitContact} className="mt-8 space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)] focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:shadow-[0_12px_32px_rgba(37,99,235,0.14)]"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@email.com"
                  className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)] focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:shadow-[0_12px_32px_rgba(37,99,235,0.14)]"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)] focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:shadow-[0_12px_32px_rgba(37,99,235,0.14)]"
                />
              </div>

              {/* Company Name / Subject */}
              <div>
                <label htmlFor="interest" className="block text-sm font-semibold text-gray-700">
                  Subject *
                </label>
                <select
                  id="interest"
                  name="interest"
                  required
                  defaultValue=""
                  className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)] focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:shadow-[0_12px_32px_rgba(37,99,235,0.14)]"
                >
                  <option value="" disabled>
                    Select a topic
                  </option>
                  <option value="Course enrollment">Course enrollment</option>
                  <option value="Live class support">Live class support</option>
                  <option value="School partnership">School partnership</option>
                  <option value="Placement support">Placement support</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className="mt-2 block w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)] focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:shadow-[0_12px_32px_rgba(37,99,235,0.14)]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:bg-blue-700 hover:shadow-[0_18px_42px_rgba(37,99,235,0.28)] focus:outline-none focus:ring-4 focus:ring-blue-500/25 focus:ring-offset-2"
              >
                Submit request
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="relative z-10 overflow-hidden py-16">
        <div className="pointer-events-none absolute inset-0 bg-white/55" />
        <div className="pointer-events-none absolute inset-0 text-blue-600/[0.06]">
          <MapPin className="absolute left-[5%] top-[18%] h-16 w-16 -rotate-12" />
          <Send className="absolute right-[8%] top-[12%] h-14 w-14 rotate-12" />
          <GraduationCap className="absolute bottom-[10%] left-[12%] h-16 w-16 rotate-12" />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-4 md:px-6">
          <div className="mb-8 rounded-[32px] border border-white/50 bg-white/75 px-6 py-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-[18px] md:px-10 md:py-14 lg:px-16">
            <h1 className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-[36px] font-black leading-none tracking-tight text-transparent drop-shadow-[0_4px_20px_rgba(15,23,42,0.12)] md:text-[56px] lg:text-[68px]">
              Find Us Here
            </h1>
          </div>

          <div className="grid items-stretch gap-6 lg:grid-cols-[3fr_2fr] lg:gap-8">
            <div className="relative h-[320px] overflow-hidden rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition duration-300 ease-out hover:-translate-y-1 md:h-[400px] lg:h-[520px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.844789!2d78.399023!3d17.413497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9158edcba987%3A0x123456789abcdef0!2sSattva%20Magnus%2C%20behind%20Reliance%20Bazaar%20Shaikpet%2C%20Sabza%20Colony%2C%20Ambedkar%20Nagar%2C%20Toli%20Chowki%2C%20Hyderabad%2C%20Telangana%20500008!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="ADYAPAN Office Location"
                className="h-full w-full"
              />
            </div>

            <div className="relative h-auto overflow-hidden rounded-[24px] border border-white/40 bg-white/85 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] backdrop-blur-[16px] transition duration-300 ease-out hover:-translate-y-1 md:p-7 lg:h-[520px]">
              <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-gradient-to-br from-blue-300/30 via-purple-300/20 to-pink-300/20 blur-3xl" />
              <div className="relative flex h-full flex-col">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-blue-700 shadow-sm backdrop-blur-md">
                  <MapPin className="h-4 w-4" />
                  VISIT OUR OFFICE
                </div>

                <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                  Visit our office for admissions, partnerships, student support, and future skills consultations.
                </p>

                <div className="mt-5 grid gap-3">
                  <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-white/75 p-3.5 shadow-sm">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-[0_10px_24px_rgba(37,99,235,0.25)]">
                      <Building2 className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-black text-slate-900">Office Location</p>
                      <p className="text-sm font-medium text-slate-600">Hyderabad, Telangana</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-purple-100 bg-white/75 p-3.5 shadow-sm">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-[0_10px_24px_rgba(147,51,234,0.22)]">
                      <Clock3 className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-black text-slate-900">Working Hours</p>
                      <p className="text-sm font-medium text-slate-600">Mon - Sat</p>
                      <p className="text-sm font-medium text-slate-600">11:00 AM - 8:00 PM</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-pink-100 bg-white/75 p-3.5 shadow-sm">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-blue-500 text-white shadow-[0_10px_24px_rgba(236,72,153,0.2)]">
                      <PhoneCall className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-black text-slate-900">Contact Support</p>
                      <p className="text-sm font-medium text-slate-600">+91 81791 24566</p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row">
                  <a
                    href="https://maps.app.goo.gl/k9gTre3rCq2ao2Vw6?g_st=awb"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3.5 text-sm font-black text-white shadow-[0_14px_34px_rgba(37,99,235,0.25)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(37,99,235,0.34)]"
                  >
                    <MapPin className="h-5 w-5" />
                    Open In Google Maps
                  </a>
                  <a
                    href="#contact-form"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-white/80 px-5 py-3.5 text-sm font-black text-blue-700 shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-purple-200 hover:text-purple-700 hover:shadow-[0_14px_34px_rgba(147,51,234,0.14)]"
                  >
                    <PhoneCall className="h-5 w-5" />
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Build Smarter Decisions Section */}
      <section className="relative z-10 bg-gradient-to-br from-blue-600/90 via-indigo-600/90 to-purple-600/90 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center md:px-6">
          <h2 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Build smarter decisions, faster
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-white/90 md:text-xl">
            Join thousands of students and schools who trust ADYAPAN for innovative learning solutions. 
            Transform education with AI-powered insights, personalized learning paths, and comprehensive support.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold text-blue-600 shadow-xl transition hover:bg-gray-50"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="/overview"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="relative z-10 overflow-hidden bg-gradient-to-b from-[#eef7ff] via-[#f8fbff] to-white py-16">
        <style jsx>{`
          @keyframes social-float {
            0%, 100% { transform: translate3d(0, 0, 0); }
            50% { transform: translate3d(0, -12px, 0); }
          }

          @keyframes phone-float-left {
            0%, 100% { transform: translate3d(0, 0, 0) rotate(-12deg); }
            50% { transform: translate3d(0, -10px, 0) rotate(-12deg); }
          }

          @keyframes phone-float-right {
            0%, 100% { transform: translate3d(0, 0, 0) rotate(12deg); }
            50% { transform: translate3d(0, -10px, 0) rotate(12deg); }
          }
        `}</style>
        <div className="pointer-events-none absolute inset-0 text-sky-600/[0.07]">
          <Star className="absolute left-[4%] top-[12%] h-8 w-8" />
          <GraduationCap className="absolute right-[9%] top-[9%] h-16 w-16 rotate-12" />
          <BookOpen className="absolute left-[11%] top-[28%] h-12 w-12 -rotate-12" />
          <Pencil className="absolute left-[3%] top-[48%] h-10 w-10 rotate-12" />
          <Atom className="absolute right-[12%] top-[38%] h-14 w-14" />
          <Send className="absolute bottom-[42%] left-[15%] h-9 w-9 rotate-12" />
          <Sparkles className="absolute bottom-[16%] left-[20%] h-10 w-10" />
          <MessageSquare className="absolute bottom-[28%] right-[5%] h-12 w-12 -rotate-12" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 text-center md:px-6">
          <h3 className="bg-gradient-to-r from-[#2563eb] via-[#4f46e5] to-[#7c3aed] bg-clip-text text-[40px] font-black leading-tight text-transparent drop-shadow-[0_10px_24px_rgba(79,70,229,0.18)] md:text-[56px] lg:text-[72px]">
            Follow Us on Social Media
          </h3>
          <p className="mx-auto mt-6 max-w-[800px] text-lg font-medium leading-relaxed text-[#334155] md:text-2xl">
            Stay connected with ADYAPAN for the latest updates, educational content, and community insights.
          </p>

          <div className="relative mx-auto mt-16 flex min-h-[360px] max-w-5xl items-center justify-center sm:min-h-[460px] lg:mt-20 lg:min-h-[560px]">
            <div className="absolute inset-x-12 top-14 h-72 rounded-full bg-blue-400/20 blur-3xl" />
            <div className="absolute left-[3%] top-[30%] z-30 hidden h-16 w-16 items-center justify-center rounded-full border border-white/70 bg-white/95 shadow-[0_15px_35px_rgba(0,0,0,0.12)] backdrop-blur-[12px] sm:flex lg:h-[72px] lg:w-[72px]" style={{ animation: "social-float 5.4s ease-in-out infinite", animationDelay: "0s" }}>
              <Instagram className="h-8 w-8 text-pink-500 lg:h-9 lg:w-9" />
            </div>
            <div className="absolute left-[14%] top-[11%] z-30 hidden h-14 w-14 items-center justify-center rounded-full border border-white/70 bg-white/95 text-rose-500 shadow-[0_15px_35px_rgba(0,0,0,0.12)] backdrop-blur-[12px] md:flex" style={{ animation: "social-float 6.2s ease-in-out infinite", animationDelay: "0.7s" }}>
              <Heart className="h-7 w-7" />
            </div>
            <div className="absolute right-[4%] top-[39%] z-30 hidden h-16 w-16 items-center justify-center rounded-full border border-white/70 bg-white/95 shadow-[0_15px_35px_rgba(0,0,0,0.12)] backdrop-blur-[12px] sm:flex lg:h-[72px] lg:w-[72px]" style={{ animation: "social-float 5.8s ease-in-out infinite", animationDelay: "0.35s" }}>
              <Linkedin className="h-8 w-8 text-blue-600 lg:h-9 lg:w-9" />
            </div>
            <div className="absolute right-[15%] top-[14%] z-30 hidden h-14 w-14 items-center justify-center rounded-full border border-white/70 bg-white/95 text-sky-500 shadow-[0_15px_35px_rgba(0,0,0,0.12)] backdrop-blur-[12px] md:flex" style={{ animation: "social-float 6.6s ease-in-out infinite", animationDelay: "1s" }}>
              <Send className="h-7 w-7" />
            </div>
            <div className="absolute bottom-[13%] left-[9%] z-30 hidden h-14 w-14 items-center justify-center rounded-full border border-white/70 bg-white/95 text-indigo-500 shadow-[0_15px_35px_rgba(0,0,0,0.12)] backdrop-blur-[12px] lg:flex" style={{ animation: "social-float 7s ease-in-out infinite", animationDelay: "1.4s" }}>
              <GraduationCap className="h-7 w-7" />
            </div>

            <div className="relative z-20 mx-auto w-full max-w-[900px] overflow-hidden transition duration-500 ease-out hover:-translate-y-2">
              {/* Replace with a true transparent PNG for best visual quality. */}
              <img
                src="/social-showcase.png"
                alt="ADYAPAN social media phone showcase"
                className="h-auto w-full object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.25)]"
              />
            </div>
          </div>

          <div className="relative z-30 mt-10 grid gap-4 md:mt-12 md:grid-cols-2 lg:grid-cols-3">
            {socialFaqs.map((faq, index) => {
              const Icon = faq.icon;
              const isActive = activeSocialFaq === index;

              return (
                <div key={faq.question} className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveSocialFaq(isActive ? null : index)}
                    className="flex w-full items-center justify-between gap-4 rounded-[20px] border border-indigo-500/15 bg-white/95 p-6 text-left text-sm font-black text-slate-950 shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-indigo-400/35 hover:shadow-[0_18px_42px_rgba(37,99,235,0.14)]"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                        <Icon className="h-5 w-5" />
                      </span>
                      {faq.question}
                    </span>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-blue-600 transition ${isActive ? "rotate-180" : ""}`} />
                  </button>

                  {isActive && (
                    <div className="relative mt-4 rounded-[24px] border border-indigo-500/10 bg-white/95 p-5 text-left shadow-[0_25px_60px_rgba(0,0,0,0.12)] backdrop-blur-[16px] transition duration-300 animate-in fade-in slide-in-from-top-2">
                      <button
                        type="button"
                        onClick={() => setActiveSocialFaq(null)}
                        className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
                        aria-label="Close FAQ answer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h4 className="pr-8 text-base font-black text-slate-950">{faq.question}</h4>
                      <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
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
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-gray-900">Message Sent!</h3>
            <p className="mx-auto mt-3 max-w-sm text-base text-gray-600">
              Thanks for reaching out. ADYAPAN team will contact you soon.
            </p>
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-blue-600 px-8 text-base font-semibold text-white transition hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </button>
      )}

      {/* Status Message */}
      {status && !success && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-xl">
          {status}
        </div>
      )}
    </main>
  );
}
