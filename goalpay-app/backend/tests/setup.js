// Jest setup file
const { Pool } = require('pg');

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'goalpay_test';
process.env.DB_USER = 'postgres';
process.env.DB_PASSWORD = 'password';

// Mock database connection
jest.mock('pg', () => ({
  Pool: jest.fn(() => ({
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn(),
    on: jest.fn(), // 添加 on 方法
  })),
}));

// Mock Passport
jest.mock('passport', () => ({
  use: jest.fn(),
  initialize: jest.fn(),
  session: jest.fn(),
  authenticate: jest.fn(() => (req, res, next) => {
    // Mock successful authentication
    req.user = global.testUtils.createMockUser();
    next();
  }),
  serializeUser: jest.fn(),
  deserializeUser: jest.fn(),
}));

// Mock Google OAuth Strategy
jest.mock('passport-google-oauth20', () => ({
  Strategy: jest.fn(),
}));

// Global test utilities
global.testUtils = {
  createMockUser: () => ({
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    googleId: 'google123',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  
  createMockPayroll: () => ({
    id: 1,
    userId: 1,
    companyId: 1,
    period: '2024-01',
    totalIncome: 500000,
    totalDeductions: 100000,
    netIncome: 400000,
    items: [
      { item_type: 'income', item_name: '基本薪資', amount: 400000 },
      { item_type: 'income', item_name: '加班費', amount: 100000 },
      { item_type: 'deduction', item_name: '所得稅', amount: 50000 },
      { item_type: 'deduction', item_name: '健康保險', amount: 50000 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  
  createMockCompany: () => ({
    id: 1,
    userId: 1,
    name: 'Test Company',
    industry: 'Technology',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
};

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
