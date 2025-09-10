const request = require('supertest');
const express = require('express');
const payrollRoutes = require('../../routes/payroll');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/payroll', payrollRoutes);

describe('Payroll Routes', () => {
  describe('GET /api/payroll', () => {
    it('should return payroll slips for authenticated user', async () => {
      const mockPayrolls = [
        global.testUtils.createMockPayroll(),
        { ...global.testUtils.createMockPayroll(), id: 2, period: '2024-02' }
      ];

      const response = await request(app)
        .get('/api/payroll')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);
      
      expect(response.body).toHaveProperty('payrolls');
      expect(Array.isArray(response.body.payrolls)).toBe(true);
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/payroll')
        .expect(401);
      
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/payroll', () => {
    it('should create new payroll slip', async () => {
      const newPayroll = {
        company: 'Test Company',
        employeeId: 'EMP001',
        slipDate: '2024-03-31',
        items: [
          { item_type: 'income', item_name: '基本薪資', amount: 400000 },
          { item_type: 'deduction', item_name: '所得稅', amount: 50000 }
        ]
      };

      const response = await request(app)
        .post('/api/payroll')
        .set('Authorization', 'Bearer valid-token')
        .send(newPayroll)
        .expect(201);
      
      expect(response.body).toHaveProperty('payroll');
      expect(response.body.payroll.slipDate).toBe(newPayroll.slipDate);
    });

    it('should validate required fields', async () => {
      const invalidPayroll = {
        slipDate: '2024-03-31'
        // Missing company and employeeId
      };

      const response = await request(app)
        .post('/api/payroll')
        .set('Authorization', 'Bearer valid-token')
        .send(invalidPayroll)
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/payroll/:id', () => {
    it('should update existing payroll slip', async () => {
      const updateData = {
        company: 'Updated Company',
        employeeId: 'EMP001',
        slipDate: '2024-03-31',
        items: [
          { item_type: 'income', item_name: '基本薪資', amount: 450000 }
        ]
      };

      const response = await request(app)
        .put('/api/payroll/1')
        .set('Authorization', 'Bearer valid-token')
        .send(updateData)
        .expect(200);
      
      expect(response.body).toHaveProperty('payroll');
      expect(response.body.payroll.slipDate).toBe(updateData.slipDate);
    });

    it('should return 404 for non-existent payroll', async () => {
      const response = await request(app)
        .put('/api/payroll/999')
        .set('Authorization', 'Bearer valid-token')
        .send({ company: 'Test', employeeId: 'EMP001', slipDate: '2024-03-31', items: [] })
        .expect(404);
      
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/payroll/:id', () => {
    it('should delete payroll slip', async () => {
      const response = await request(app)
        .delete('/api/payroll/1')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);
      
      expect(response.body).toHaveProperty('message', 'Payroll slip deleted successfully');
    });

    it('should return 404 for non-existent payroll', async () => {
      const response = await request(app)
        .delete('/api/payroll/999')
        .set('Authorization', 'Bearer valid-token')
        .expect(404);
      
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/payroll/template/csv', () => {
    it('should return CSV template', async () => {
      const response = await request(app)
        .get('/api/payroll/template/csv')
        .expect(200);
      
      expect(response.headers['content-type']).toContain('text/csv');
      expect(response.text).toContain('公司名稱,員工編號');
    });
  });

  describe('POST /api/payroll/upload/csv', () => {
    it('should upload and parse CSV file', async () => {
      const csvContent = '公司名稱,員工編號,員工姓名,部門,薪資日期,工作天數,缺勤天數,有薪假天數,無薪假天數,基本薪資,津貼,總薪資,扣除額,保險費,所得稅,實發薪資,銀行轉帳,現金支付,備註\n測試科技公司,EMP001,張小明,研發部,2024-06-30,22,0,0,0,400000,20000,420000,85000,25000,45000,335000,335000,0,6月份薪資單';
      
      const response = await request(app)
        .post('/api/payroll/upload/csv')
        .set('Authorization', 'Bearer valid-token')
        .attach('csvFile', Buffer.from(csvContent), 'test.csv')
        .expect(200);
      
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');
    });

    it('should validate CSV format', async () => {
      const invalidCsv = 'invalid,csv,content';
      
      const response = await request(app)
        .post('/api/payroll/upload/csv')
        .set('Authorization', 'Bearer valid-token')
        .attach('csvFile', Buffer.from(invalidCsv), 'test.csv')
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
    });
  });
});
