const request = require('supertest');
const express = require('express');
const reportsRoutes = require('../../routes/reports');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/reports', reportsRoutes);

describe('Reports Routes', () => {
  describe('GET /api/reports/summary', () => {
    it('should return reports summary', async () => {
      const response = await request(app)
        .get('/api/reports/summary')
        .set('Authorization', 'Bearer valid-token')
        .query({ year: '2024' })
        .expect(200);
      
      expect(response.body).toHaveProperty('yearlySummary');
      expect(response.body).toHaveProperty('monthlyBreakdown');
      expect(response.body.year).toBe('2024');
    });

    it('should handle custom date range', async () => {
      const response = await request(app)
        .get('/api/reports/summary')
        .set('Authorization', 'Bearer valid-token')
        .query({ 
          startDate: '2024-01-01',
          endDate: '2024-03-31'
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('customRangeSummary');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/reports/summary')
        .expect(401);
      
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/reports/export/pdf', () => {
    it('should export PDF report', async () => {
      const exportData = {
        year: '2024',
        includeCharts: true,
        includeTables: true
      };

      const response = await request(app)
        .post('/api/reports/export/pdf')
        .set('Authorization', 'Bearer valid-token')
        .send(exportData)
        .expect(200);
      
      expect(response.headers['content-type']).toContain('application/pdf');
    });

    it('should validate export parameters', async () => {
      const invalidData = {
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/reports/export/pdf')
        .set('Authorization', 'Bearer valid-token')
        .send(invalidData)
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/reports/export/csv', () => {
    it('should export CSV report', async () => {
      const exportData = {
        year: '2024',
        format: 'detailed'
      };

      const response = await request(app)
        .post('/api/reports/export/csv')
        .set('Authorization', 'Bearer valid-token')
        .send(exportData)
        .expect(200);
      
      expect(response.headers['content-type']).toContain('text/csv');
    });
  });
});
