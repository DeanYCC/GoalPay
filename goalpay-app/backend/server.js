const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

// 導入 Passport 配置
require('./config/passport');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const payrollRoutes = require('./routes/payroll');
const dashboardRoutes = require('./routes/dashboard');
const reportsRoutes = require('./routes/reports');
const companyRoutes = require('./routes/companies');
const supportRoutes = require('./routes/support');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5001;

// 安全中間件
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));

// Session 中間件
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24小時
  }
}));

// Passport 中間件
app.use(passport.initialize());
app.use(passport.session());

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分鐘
  max: 100 // 限制每個IP 15分鐘內最多100個請求
});
app.use(limiter);

// 解析JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/admin', adminRoutes);

// 健康檢查
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 處理
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// 錯誤處理中間件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 GoalPay 後端服務器運行在端口 ${PORT}`);
  console.log(`📊 健康檢查: http://localhost:${PORT}/health`);
});
