"use client";

import { motion } from "framer-motion";
import { FileText, Scale, BookOpen, AlertTriangle, CreditCard, Ban, RefreshCw, Gavel, Mail, School, Users } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const sections = [
  {
    icon: BookOpen,
    title: "Acceptance of Terms",
    content: [
      "By accessing or using the ADYAPAN School platform, you agree to these Terms of Service.",
      "Since our platform serves students from Class 1 to 12, a parent or legal guardian must accept these terms on behalf of the student.",
      "If you are a school or institutional partner, the authorized representative must accept these terms on behalf of the institution.",
      "If you do not agree with any part of these terms, please do not access or use the platform.",
      "We may update these terms from time to time. Parents and schools will be notified of material changes via email.",
    ],
  },
  {
    icon: Users,
    title: "User Accounts & Roles",
    content: [
      "Students (Class 1-12): Accounts are created by parents/guardians or partner schools. Students access learning content, submit assignments, and view progress.",
      "Parents/Guardians: Responsible for managing their child's account, monitoring progress, communicating with teachers, and providing consent.",
      "Teachers: Access assigned classes, manage attendance, create assignments, conduct live sessions, and communicate with parents.",
      "School Administrators/Principals: Oversee institutional accounts, manage teachers, view reports, and configure school settings.",
      "You are responsible for keeping login credentials confidential. Report any unauthorized access immediately.",
    ],
  },
  {
    icon: School,
    title: "Educational Services",
    content: [
      "ADYAPAN School provides future skills education including Coding, AI, Current Affairs, Communication, Design, and Life Skills for Class 1-12.",
      "Services include live classes, recorded lessons, quizzes, assignments, progress tracking, attendance management, and certification.",
      "The platform also serves as a Learning Management System (LMS) for partner schools to manage classes, teachers, and students.",
      "We strive to deliver quality education but do not guarantee specific grades, academic results, or career outcomes.",
      "Course content, schedules, and curriculum may be updated to ensure relevance and quality.",
    ],
  },
  {
    icon: Scale,
    title: "Intellectual Property",
    content: [
      "All course content, videos, worksheets, quizzes, curriculum materials, and platform design are owned by or licensed to ADYAPAN School.",
      "Students and parents are granted a limited, personal, non-transferable license to access content for educational purposes only.",
      "Recording, downloading, redistributing, or commercially using any platform content without written permission is prohibited.",
      "Student-created projects, homework, and submissions remain the student's property. ADYAPAN may showcase anonymized examples for promotional purposes with parental consent.",
      "School partnership materials and co-branded content are governed by separate institutional agreements.",
    ],
  },
  {
    icon: CreditCard,
    title: "Payments & Fees",
    content: [
      "Certain programs, certifications, and premium features may require payment. All fees are clearly displayed before purchase.",
      "Payments are processed securely through trusted third-party payment gateways (Razorpay/similar).",
      "School partnership fees are governed by separate institutional agreements and invoicing.",
      "Refund requests may be submitted within 7 days of payment if the student has not substantially accessed the paid content.",
      "ADYAPAN reserves the right to modify pricing with at least 30 days advance notice to parents and schools.",
    ],
  },
  {
    icon: Ban,
    title: "Prohibited Activities",
    content: [
      "Sharing account credentials with unauthorized persons or allowing others to use a student's account.",
      "Uploading or sharing inappropriate, harmful, offensive, or illegal content on the platform.",
      "Bullying, harassment, or any behavior that disrupts the safe learning environment for other students.",
      "Attempting to hack, exploit vulnerabilities, or interfere with platform operations.",
      "Using the platform for any purpose other than legitimate educational activities.",
      "Parents/teachers engaging in abusive behavior towards staff or other users through the communication features.",
      "Creating fake accounts or misrepresenting identity or school affiliation.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Account Suspension & Termination",
    content: [
      "We may suspend or terminate accounts that violate these terms, with notice to the parent/guardian or school.",
      "In cases of severe misconduct (harassment, hacking, illegal activity), immediate suspension may occur without prior notice.",
      "Upon termination, access to courses and content ceases. Earned certificates remain valid.",
      "Parents can request account deletion for their child at any time by contacting support.",
      "Schools can terminate their partnership and request data export/deletion as per the institutional agreement.",
    ],
  },
  {
    icon: RefreshCw,
    title: "Platform Availability",
    content: [
      "We aim for maximum uptime but do not guarantee uninterrupted access to the platform.",
      "Scheduled maintenance will be communicated in advance to minimize disruption to live classes and learning.",
      "We are not liable for temporary unavailability due to technical issues, internet connectivity, or third-party service failures.",
      "Live class recordings will be made available if a session is disrupted due to platform issues.",
    ],
  },
  {
    icon: Gavel,
    title: "Limitation of Liability & Governing Law",
    content: [
      "ADYAPAN School provides educational services on an \"as-is\" basis and does not guarantee specific academic outcomes.",
      "We are not liable for any indirect, incidental, or consequential damages arising from platform use.",
      "Our total liability shall not exceed the amount paid for the specific service in question.",
      "Parents/guardians are responsible for supervising their child's online activity and screen time.",
      "These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Hyderabad, Telangana.",
    ],
  },
  {
    icon: Mail,
    title: "Contact Us",
    content: [
      "For questions, concerns, or complaints regarding these Terms of Service:",
      "Email: support@adyapan.com",
      "Phone: +91 81791 24566",
      "Parents can also raise concerns through the parent portal's 'Support' section.",
      "We respond to all inquiries within 48 business hours.",
    ],
  },
];

export default function TermsOfServicePage() {
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
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-[120px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/25"
          >
            <FileText className="h-8 w-8 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-black text-white sm:text-5xl md:text-6xl"
          >
            Terms of Service
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg text-slate-300"
          >
            Guidelines for using the ADYAPAN School platform — for students, parents, teachers, and partner schools.
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
          className="mb-12 rounded-2xl border border-purple-100 bg-purple-50/50 p-6 md:p-8"
        >
          <p className="text-base leading-7 text-slate-700">
            These Terms of Service (&quot;Terms&quot;) govern the use of the ADYAPAN
            School platform operated by SR&apos;s Adyapan Edutech Pvt. Ltd. Our
            platform provides future skills education, learning management, and
            school partnership services for students from Class 1 to 12. These
            terms apply to all users — students, parents/guardians, teachers,
            school administrators, and institutional partners. By creating an
            account or using our services, you agree to be bound by these Terms.
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
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-sm">
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
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Agreement Notice */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="mt-12 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-6 md:p-8"
        >
          <h3 className="text-lg font-bold text-indigo-900">Agreement</h3>
          <p className="mt-3 text-base leading-7 text-indigo-800">
            By using the ADYAPAN School platform, you (and if applicable, your
            child&apos;s parent/guardian) acknowledge that you have read, understood,
            and agree to these Terms of Service. If you have questions, please
            contact us at support@adyapan.com before using our services.
          </p>
        </motion.div>
      </section>
    </main>
  );
}
