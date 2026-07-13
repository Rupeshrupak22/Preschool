const express = require('express');
const prisma = require('../lib/prisma');
const { sendResponse } = require('../utils/response');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/v1/dashboard — role-specific dashboard
router.get('/', authenticate, async (req, res) => {
  try {
    const { role, id, email } = req.user;
    let data = {};

    switch (role) {
      case 'student': data = await getStudentDashboard(id, email); break;
      case 'teacher': data = await getTeacherDashboard(id, email); break;
      case 'principal': data = await getPrincipalDashboard(id); break;
      case 'admin': data = await getAdminDashboard(); break;
      default: return sendResponse(res, 400, false, 'Unknown role.');
    }

    sendResponse(res, 200, true, `${role} dashboard fetched.`, data);
  } catch (error) {
    console.error('Dashboard error:', error);
    sendResponse(res, 500, false, 'Failed to fetch dashboard.');
  }
});

// GET /api/v1/dashboard/admin
router.get('/admin', authenticate, authorize('admin'), async (req, res) => {
  try {
    sendResponse(res, 200, true, 'Admin dashboard fetched.', await getAdminDashboard());
  } catch (error) {
    sendResponse(res, 500, false, 'Failed to fetch admin dashboard.');
  }
});

// GET /api/v1/dashboard/principal
router.get('/principal', authenticate, authorize('principal'), async (req, res) => {
  try {
    sendResponse(res, 200, true, 'Principal dashboard fetched.', await getPrincipalDashboard(req.user.id));
  } catch (error) {
    sendResponse(res, 500, false, 'Failed to fetch principal dashboard.');
  }
});

async function getStudentDashboard(userId, email) {
  const [attendance, payments, notices, enrollments] = await Promise.all([
    prisma.attendance.findMany({ where: { user_id: userId }, orderBy: { created_at: 'desc' }, take: 10 }),
    prisma.payments.findMany({ where: { user_email: email }, orderBy: { created_at: 'desc' }, take: 5 }),
    prisma.notifications.findMany({ where: { OR: [{ user_email: email }, { user_email: null }] }, orderBy: { created_at: 'desc' }, take: 5 }),
    prisma.enrollments.findMany({ where: { user_email: email }, orderBy: { enrolled_at: 'desc' }, take: 5 }),
  ]);

  const totalAtt = await prisma.attendance.count({ where: { user_id: userId } });
  const presentCount = await prisma.attendance.count({ where: { user_id: userId, status: 'present' } });

  return {
    attendancePercentage: totalAtt > 0 ? Math.round((presentCount / totalAtt) * 100) : 0,
    recentAttendance: attendance,
    recentPayments: payments,
    notices,
    enrollments,
  };
}

async function getTeacherDashboard(userId, email) {
  const user = await prisma.users.findUnique({ where: { id: userId } });
  const [upcomingClasses, notices, totalStudents] = await Promise.all([
    prisma.teacher_class_sessions.findMany({
      where: { teacher_id: user?.teacher_id || userId, start_time: { gte: new Date() } },
      orderBy: { start_time: 'asc' }, take: 10,
    }),
    prisma.notifications.findMany({ where: { OR: [{ user_email: email }, { user_email: null }] }, orderBy: { created_at: 'desc' }, take: 5 }),
    prisma.student.count({ where: user?.school_id ? { schoolId: user.school_id } : {} }),
  ]);
  return { totalStudents, upcomingClasses, notices };
}

async function getPrincipalDashboard(userId) {
  const user = await prisma.users.findUnique({ where: { id: userId } });
  const schoolId = user?.school_id;
  const where = schoolId ? { schoolId } : {};

  const [totalStudents, totalTeachers, recentLogins] = await Promise.all([
    prisma.student.count({ where }),
    prisma.teacher.count({ where }),
    getRecentLoginEvents(schoolId),
  ]);
  return { totalStudents, totalTeachers, recentLogins, schoolId };
}

async function getRecentLoginEvents(schoolId) {
  if (!schoolId) return [];

  // 1. Student logins — filter by student emails belonging to this school
  const students = await prisma.student.findMany({
    where: { schoolId },
    select: { email: true },
  });
  const schoolEmails = students.map((s) => s.email);

  const [studentLogins, teacherLogins, principalLogins] = await Promise.all([
    schoolEmails.length > 0
      ? prisma.login_events.findMany({
          where: { email: { in: schoolEmails } },
          select: { id: true, email: true, name: true, role: true, status: true, created_at: true, ip_address: true },
          take: 50,
        })
      : [],
    // 2. Teacher logins — teacher_login_events has school_id directly
    prisma.teacher_login_events.findMany({
      where: { school_id: schoolId },
      select: { id: true, email: true, status: true, created_at: true, ip_address: true },
      take: 50,
    }),
    // 3. Principal logins — principal_login_events has school_id directly
    prisma.principal_login_events.findMany({
      where: { school_id: schoolId },
      select: { id: true, email: true, status: true, created_at: true, ip_address: true },
    }),
  ]);

  // Normalise to a common shape
  const allLogins = [
    ...studentLogins.map((e) => ({ ...e, role: e.role || 'student' })),
    ...teacherLogins.map((e) => ({ ...e, name: null, role: 'teacher' })),
    ...principalLogins.map((e) => ({ ...e, name: null, role: 'principal' })),
  ];

  // Sort by created_at descending, take top 10
  return allLogins
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);
}

async function getAdminDashboard() {
  const [totalUsers, totalStudents, totalTeachers, totalSchools, totalPayments, recentLogins] = await Promise.all([
    prisma.users.count(),
    prisma.student.count(),
    prisma.teacher.count(),
    prisma.school.count(),
    prisma.payments.count(),
    prisma.login_events.findMany({ orderBy: { created_at: 'desc' }, take: 10 }),
  ]);
  const paidPayments = await prisma.payments.count({ where: { status: 'paid' } });
  return { totalUsers, totalStudents, totalTeachers, totalSchools, totalPayments, paidPayments, recentLogins };
}

module.exports = router;
