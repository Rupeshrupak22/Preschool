"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, Database, UserCheck, Mail, Bell, Globe, School } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const sections = [
  {
    icon: Database,
    title: "Information We Collect",
    content: [
      "Student details: name, age, class, section, school name, parent/guardian contact information provided during enrollment.",
      "Parent/Guardian details: name, email address, phone number, and relationship to the student.",
      "Academic data: attendance records, course progress, quiz/test scores, certificates, homework submissions, and teacher feedback.",
      "Usage information: pages visited, features used, time spent on learning modules, device type, browser, and IP address.",
      "Communication records: messages between parents-teachers, support requests, and feedback submitted through the platform.",
      "School partnership data: institutional contact details, teacher profiles, and administrative information.",
    ],
  },
  {
    icon: Eye,
    title: "How We Use Your Information",
    content: [
      "To deliver and personalize educational content for students from Class 1 to 12.",
      "To generate progress reports, attendance summaries, and academic dashboards for parents and schools.",
      "To enable teacher-parent communication, notices, event updates, and homework tracking.",
      "To issue certificates, maintain student portfolios, and track skill development across programs.",
      "To improve our curriculum, live classes, and platform features based on usage patterns.",
      "To ensure platform security and prevent unauthorized access to student data.",
      "To comply with applicable education regulations and legal requirements.",
    ],
  },
  {
    icon: Lock,
    title: "Data Protection & Security",
    content: [
      "All data is encrypted in transit (TLS/SSL) and at rest using industry-standard encryption methods.",
      "Student data is stored on secure servers with strict access controls and role-based permissions.",
      "Only authorized teachers, school administrators, and ADYAPAN staff can access relevant student information.",
      "Regular security audits, penetration testing, and vulnerability assessments are conducted.",
      "We maintain secure backup systems and disaster recovery procedures to prevent data loss.",
      "Passwords are hashed and never stored in plain text.",
    ],
  },
  {
    icon: UserCheck,
    title: "Children's Privacy (Students Class 1-12)",
    content: [
      "Protecting children's privacy is our highest priority. All students on our platform are minors (Class 1 to 12).",
      "We collect only the minimum information necessary to provide educational services.",
      "Parental or guardian consent is mandatory before any student account is created.",
      "Parents/guardians have full access to view, modify, or request deletion of their child's data at any time.",
      "We never display student personal information publicly. Student profiles are visible only to authorized school staff and parents.",
      "We do not allow direct messaging between students. All communication is supervised and monitored.",
      "No behavioral advertising or profiling is performed on student data.",
    ],
  },
  {
    icon: School,
    title: "School Partnership Data",
    content: [
      "Partner school data (teacher details, admin contacts, institutional information) is used solely for delivering educational programs.",
      "School-specific reports and analytics are shared only with authorized school administrators.",
      "Teacher information is used for class management, scheduling live sessions, and communication with parents.",
      "Schools can request export or deletion of all institutional data upon termination of partnership.",
    ],
  },
  {
    icon: Globe,
    title: "Sharing of Information",
    content: [
      "We do NOT sell, rent, or trade any student, parent, or school information to third parties.",
      "Academic progress may be shared with the student's enrolled school for report card and evaluation purposes.",
      "We use trusted third-party service providers (hosting, payment gateways) bound by strict confidentiality agreements.",
      "Data may be disclosed only if required by law, court order, or to protect the safety of students.",
      "Anonymized, aggregated data (no personal identifiers) may be used for educational research and platform improvement.",
    ],
  },
  {
    icon: Bell,
    title: "Cookies & Tracking",
    content: [
      "We use essential cookies to maintain login sessions and ensure proper platform functionality.",
      "Analytics cookies help us understand how students and parents use the platform to improve the learning experience.",
      "We do NOT use any third-party advertising cookies or trackers.",
      "You can manage cookie preferences through your browser settings at any time.",
    ],
  },
  {
    icon: UserCheck,
    title: "Your Rights",
    content: [
      "Right to access: Parents/guardians can request a complete copy of their child's data at any time.",
      "Right to correction: You can request correction of any inaccurate or incomplete information.",
      "Right to deletion: You can request permanent deletion of your child's account and all associated data.",
      "Right to restrict processing: You can limit how we use specific data.",
      "Right to withdraw consent: You can withdraw consent for data collection at any time, which may affect access to certain features.",
      "Right to complain: You may raise concerns with us or the relevant data protection authority.",
    ],
  },
  {
    icon: Mail,
    title: "Contact Us",
    content: [
      "For any privacy concerns, data requests, or questions about your child's information:",
      "Email: support@adyapan.com",
      "Phone: +91 81791 24566",
      "We respond to all privacy inquiries within 48 business hours.",
      "Parents can also reach out through the parent portal's 'Support' section.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-24 md:py-32">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25"
          >
            <Shield className="h-8 w-8 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-black text-white sm:text-5xl md:text-6xl"
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg text-slate-300"
          >
            Protecting student data and family privacy is at the core of everything we do at ADYAPAN School.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-3 text-sm text-slate-400"
          >
            Last updated: August 2026
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        {/* Introduction */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="mb-12 rounded-2xl border border-blue-100 bg-blue-50/50 p-6 md:p-8"
        >
          <p className="text-base leading-7 text-slate-700">
            SR&apos;s Adyapan Edutech Pvt. Ltd. (&quot;ADYAPAN School&quot;, &quot;we&quot;, &quot;us&quot;, or
            &quot;our&quot;) operates the ADYAPAN School platform — a future skills and
            learning management system for students from Class 1 to 12. This
            Privacy Policy explains how we collect, use, store, and protect
            information from students, parents/guardians, teachers, and partner
            schools. Since our platform primarily serves children and young
            learners, we hold ourselves to the highest standards of data privacy
            and protection.
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md md:p-8"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-sm">
                  <section.icon className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
                  {section.title}
                </h2>
              </div>
              <ul className="mt-5 space-y-3">
                {section.content.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-base leading-7 text-slate-600"
                  >
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Policy Changes Notice */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="mt-12 rounded-2xl border border-amber-200 bg-amber-50/50 p-6 md:p-8"
        >
          <h3 className="text-lg font-bold text-amber-900">Changes to This Policy</h3>
          <p className="mt-3 text-base leading-7 text-amber-800">
            We may update this Privacy Policy periodically. When changes are made,
            we will notify parents and schools via email and update the &quot;Last
            updated&quot; date. We encourage parents and guardians to review this
            policy regularly. Continued use of the platform after changes
            constitutes acceptance of the updated policy.
          </p>
        </motion.div>
      </section>
    </main>
  );
}
