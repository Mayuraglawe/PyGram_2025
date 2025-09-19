import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Example API routes
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// Mock Faculty routes
app.get('/api/faculty', (req, res) => {
  res.json([
    { id: 1, name: 'Dr. John Smith', employee_id: 'EMP001', department: 'Computer Science' },
    { id: 2, name: 'Prof. Sarah Johnson', employee_id: 'EMP002', department: 'Computer Science' },
    { id: 3, name: 'Dr. Mike Brown', employee_id: 'EMP003', department: 'Mechanical Engineering' }
  ]);
});

app.post('/api/faculty', (req, res) => {
  const { name, employee_id, department } = req.body;
  res.json({ 
    id: Date.now(), 
    name, 
    employee_id, 
    department,
    created_at: new Date().toISOString()
  });
});

// Mock Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // Mock authentication
  if ((username === 'Pygram2k25' && password === 'Pygram2k25') ||
      (username === 'pygram2k25' && password === 'pygram2k25') ||
      (username === 'admin' && password === 'password') ||
      (username === 'student1' && password === 'password')) {
    res.json({
      access: `mock_token_${Date.now()}`,
      refresh: `refresh_token_${Date.now()}`,
      user: {
        id: Date.now(),
        username,
        role: username.includes('admin') ? 'admin' : 
              username === 'Pygram2k25' ? 'creator' : 
              username === 'pygram2k25' ? 'publisher' : 'student'
      }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Mock Telegram endpoints for testing
app.get('/api/telegram/status', (req, res) => {
  res.json({
    success: true,
    status: {
      isReady: true,
      hasToken: !!process.env.TELEGRAM_BOT_TOKEN,
      hasChatId: !!process.env.TELEGRAM_PRINCIPAL_CHAT_ID,
      lastChecked: new Date().toISOString()
    }
  });
});

app.post('/api/telegram/send-to-principal', (req, res) => {
  const { senderName, senderRole, senderDepartment, message, priority } = req.body;
  
  // Validate required fields
  if (!senderName || !senderRole || !senderDepartment || !message) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: senderName, senderRole, senderDepartment, message'
    });
  }

  // Simulate successful message sending
  console.log('📨 Mock Telegram Message:');
  console.log(`From: ${senderName} (${senderRole})`);
  console.log(`Department: ${senderDepartment}`);
  console.log(`Priority: ${priority || 'medium'}`);
  console.log(`Message: ${message}`);
  console.log('---');

  res.json({
    success: true,
    message: 'Message sent to principal successfully (MOCK)',
    messageId: `mock_${Date.now()}`,
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`🚀 Backend server running on port ${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
  console.log(`💚 Health: http://localhost:${port}/health`);
  console.log(`📡 Ping: http://localhost:${port}/api/ping`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully');
  process.exit(0);
});