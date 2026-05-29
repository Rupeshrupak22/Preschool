require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Route imports
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const teacherRoutes = require('./routes/teachers');
const schoolRoutes = require('./routes/schools');
const liveClassRoutes = require('./routes/liveClasses');
const eventRoutes = require('./routes/events');
const leaveRoutes = require('./routes/leaves');
const meetingRoutes = require('./routes/meetings');
const leadRoutes = require('./routes/leads');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Adyapan Unified Backend is running',
    version: '2.0.0',
    database: 'TiDB Cloud (Prisma + MySQL)',
    endpoints: [
      '/api/v1/auth',
      '/api/v1/students',
      '/api/v1/teachers',
      '/api/v1/schools',
      '/api/v1/live-classes',
      '/api/v1/events',
      '/api/v1/leaves',
      '/api/v1/meetings',
      '/api/v1/leads',
    ],
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/teachers', teacherRoutes);
app.use('/api/v1/schools', schoolRoutes);
app.use('/api/v1/live-classes', liveClassRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/leaves', leaveRoutes);
app.use('/api/v1/meetings', meetingRoutes);
app.use('/api/v1/leads', leadRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Adyapan Unified Backend running on http://localhost:${PORT}`);
  console.log(`📦 Database: TiDB Cloud via Prisma`);
});
