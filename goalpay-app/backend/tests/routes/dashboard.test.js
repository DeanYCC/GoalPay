const request = require('supertest');
const express = require('express');
const dashboardRoutes = require('../../routes/dashboard');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/dashboard', dashboardRoutes);

describe('Dashboard Routes', () => {
  describe('GET /api/dashboard/summary', () => {
    it('should return dashboard summary for authenticated user', async () => {
      const response = await request(app)
        .get('/api/dashboard/summary')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);
      
      expect(response.body).toHaveProperty('summary');
      expect(response.body.summary).toHaveProperty('totalIncome');
      expect(response.body.summary).toHaveProperty('totalDeductions');
      expect(response.body.summary).toHaveProperty('netIncome');
      expect(response.body.summary).toHaveProperty('payrollCount');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/dashboard/summary')
        .expect(401);
      
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/dashboard/test-data', () => {
    it('should return test data for development', async () => {
      const response = await request(app)
        .get('/api/dashboard/test-data')
        .expect(200);
      
      expect(response.body).toHaveProperty('summary');
      expect(response.body).toHaveProperty('recentPayrolls');
      expect(response.body).toHaveProperty('monthlyTrend');
      expect(Array.isArray(response.body.recentPayrolls)).toBe(true);
    });
  });
});
