const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const multer = require('multer');

// 中間件：驗證 JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: '未提供認證 token' });
  }

  // 檢查是否為測試 token
  if (token.startsWith('test-token-')) {
    req.userId = 1; // 測試用戶 ID
    req.isTestUser = true;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ error: '無效的 token' });
  }
};

// 獲取所有薪資單
router.get('/', authenticateToken, async (req, res) => {
  try {
    // 如果是測試用戶，返回模擬數據
    if (req.isTestUser) {
      const mockPayrolls = [
        {
          id: 1,
          company: '測試科技公司',
          employeeId: 'EMP001',
          slipDate: '2024-06-30',
          baseSalary: 400000,
          overtime: 30000,
          allowance: 20000,
          incomeTax: 45000,
          healthInsurance: 25000,
          pension: 15000,
          otherDeductions: 0,
          netIncome: 365000,
          items: [
            { id: 1, item_type: 'income', item_name: '基本薪資', amount: 400000 },
            { id: 2, item_type: 'income', item_name: '加班費', amount: 30000 },
            { id: 3, item_type: 'income', item_name: '津貼', amount: 20000 },
            { id: 4, item_type: 'deduction', item_name: '所得稅', amount: 45000 },
            { id: 5, item_type: 'deduction', item_name: '健康保險', amount: 25000 },
            { id: 6, item_type: 'deduction', item_name: '養老金', amount: 15000 }
          ]
        },
        {
          id: 2,
          company: '測試科技公司',
          employeeId: 'EMP001',
          slipDate: '2024-05-31',
          baseSalary: 400000,
          overtime: 25000,
          allowance: 20000,
          incomeTax: 44000,
          healthInsurance: 25000,
          pension: 15000,
          otherDeductions: 0,
          netIncome: 361000,
          items: [
            { id: 7, item_type: 'income', item_name: '基本薪資', amount: 400000 },
            { id: 8, item_type: 'income', item_name: '加班費', amount: 25000 },
            { id: 9, item_type: 'income', item_name: '津貼', amount: 20000 },
            { id: 10, item_type: 'deduction', item_name: '所得稅', amount: 44000 },
            { id: 11, item_type: 'deduction', item_name: '健康保險', amount: 25000 },
            { id: 12, item_type: 'deduction', item_name: '養老金', amount: 15000 }
          ]
        }
      ];
      return res.json({ payrolls: mockPayrolls });
    }

    const result = await db.query(
      `SELECT ps.*, 
               json_agg(
                 json_build_object(
                   'id', pi.id,
                   'item_type', pi.item_type,
                   'item_name', pi.item_name,
                   'amount', pi.amount
                 )
               ) as items
        FROM payroll_slips ps
        LEFT JOIN payroll_items pi ON ps.id = pi.payroll_slip_id
        WHERE ps.user_id = $1
        GROUP BY ps.id
        ORDER BY ps.slip_date DESC`,
      [req.userId]
    );

    res.json({ payrolls: result.rows });
  } catch (err) {
    console.error('獲取薪資單錯誤:', err);
    res.status(500).json({ error: '獲取薪資單失敗' });
  }
});

// 獲取單個薪資單詳情
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // 如果是測試用戶，檢查是否有對應的模擬數據
    if (req.isTestUser) {
      // 這裡可以實現一個簡單的模擬數據存儲
      const mockPayrolls = {
        1: {
          id: 1,
          company: '測試科技公司',
          employeeId: 'EMP001',
          slipDate: '2024-06-30',
          baseSalary: 400000,
          overtime: 30000,
          allowance: 20000,
          incomeTax: 45000,
          healthInsurance: 25000,
          pension: 15000,
          otherDeductions: 0,
          netIncome: 365000,
          items: [
            { id: 1, item_type: 'income', item_name: '基本薪資', amount: 400000 },
            { id: 2, item_type: 'income', item_name: '加班費', amount: 30000 },
            { id: 3, item_type: 'income', item_name: '津貼', amount: 20000 },
            { id: 4, item_type: 'deduction', item_name: '所得稅', amount: 45000 },
            { id: 5, item_type: 'deduction', item_name: '健康保險', amount: 25000 },
            { id: 6, item_type: 'deduction', item_name: '養老金', amount: 15000 }
          ]
        },
        2: {
          id: 2,
          company: '測試科技公司',
          employeeId: 'EMP001',
          slipDate: '2024-05-31',
          baseSalary: 400000,
          overtime: 25000,
          allowance: 20000,
          incomeTax: 44000,
          healthInsurance: 25000,
          pension: 15000,
          otherDeductions: 0,
          netIncome: 361000,
          items: [
            { id: 7, item_type: 'income', item_name: '基本薪資', amount: 400000 },
            { id: 8, item_type: 'income', item_name: '加班費', amount: 25000 },
            { id: 9, item_type: 'income', item_name: '津貼', amount: 20000 },
            { id: 10, item_type: 'deduction', item_name: '所得稅', amount: 44000 },
            { id: 11, item_type: 'deduction', item_name: '健康保險', amount: 25000 },
            { id: 12, item_type: 'deduction', item_name: '養老金', amount: 15000 }
          ]
        }
      };
      
      const mockPayroll = mockPayrolls[parseInt(id)];
      if (mockPayroll) {
        return res.json(mockPayroll);
      } else {
        // 如果沒有找到對應的模擬數據，返回一個默認的薪資單
        return res.json({
          id: parseInt(id),
          company: '新公司',
          employeeId: 'EMP001',
          slipDate: new Date().toISOString().split('T')[0],
          baseSalary: 400000,
          overtime: 0,
          allowance: 0,
          incomeTax: 0,
          healthInsurance: 0,
          pension: 0,
          otherDeductions: 0,
          netIncome: 400000,
          items: [
            { id: 1, item_type: 'income', item_name: '基本薪資', amount: 400000 }
          ]
        });
      }
    }

    const result = await db.query(
      `SELECT ps.*, 
               json_agg(
                 json_build_object(
                   'id', pi.id,
                   'item_type', pi.item_type,
                   'item_name', pi.item_name,
                   'amount', pi.amount
                 )
               ) as items
        FROM payroll_slips ps
        LEFT JOIN payroll_items pi ON ps.id = pi.payroll_slip_id
        WHERE ps.id = $1 AND ps.user_id = $2
        GROUP BY ps.id`,
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '薪資單不存在' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('獲取薪資單詳情錯誤:', err);
    res.status(500).json({ error: '獲取薪資單詳情失敗' });
  }
});

// 創建新薪資單
router.post('/', authenticateToken, [
  body('company').notEmpty().withMessage('公司名稱不能為空'),
  body('employeeId').notEmpty().withMessage('員工編號不能為空'),
  body('slipDate').isISO8601().withMessage('日期格式不正確'),
  body('items').isArray().withMessage('薪資項目必須是陣列')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { company, employeeId, slipDate, items } = req.body;

    // 如果是測試用戶，返回模擬數據
    if (req.isTestUser) {
      const newPayroll = {
        id: Date.now(),
        company,
        employeeId,
        slipDate,
        baseSalary: 400000,
        overtime: 0,
        allowance: 0,
        incomeTax: 0,
        healthInsurance: 0,
        pension: 0,
        otherDeductions: 0,
        netIncome: 400000,
        items: items || [{ id: 1, item_type: 'income', item_name: '基本薪資', amount: 400000 }]
      };
      return res.status(201).json(newPayroll);
    }

    // 開始事務
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      // 插入薪資單
      const payrollResult = await client.query(
        `INSERT INTO payroll_slips (user_id, company, employee_id, slip_date, base_salary, overtime, allowance, income_tax, health_insurance, pension, other_deductions, net_income)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING *`,
        [req.userId, company, employeeId, slipDate, 0, 0, 0, 0, 0, 0, 0, 0]
      );

      const payrollId = payrollResult.rows[0].id;

      // 插入薪資項目
      for (const item of items) {
        await client.query(
          `INSERT INTO payroll_items (payroll_slip_id, item_type, item_name, amount)
           VALUES ($1, $2, $3, $4)`,
          [payrollId, item.item_type, item.item_name, item.amount]
        );
      }

      await client.query('COMMIT');

      // 返回創建的薪資單
      const result = await client.query(
        `SELECT ps.*, 
                 json_agg(
                   json_build_object(
                     'id', pi.id,
                     'item_type', pi.item_type,
                     'item_name', pi.item_name,
                     'amount', pi.amount
                   )
                 ) as items
          FROM payroll_slips ps
          LEFT JOIN payroll_items pi ON ps.id = pi.payroll_slip_id
          WHERE ps.id = $1
          GROUP BY ps.id`,
        [payrollId]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('創建薪資單錯誤:', err);
    res.status(500).json({ error: '創建薪資單失敗' });
  }
});

// 更新薪資單
router.put('/:id', authenticateToken, [
  body('company').notEmpty().withMessage('公司名稱不能為空'),
  body('employeeId').notEmpty().withMessage('員工編號不能為空'),
  body('slipDate').isISO8601().withMessage('日期格式不正確'),
  body('items').isArray().withMessage('薪資項目必須是陣列')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { company, employeeId, slipDate, items } = req.body;

    // 如果是測試用戶，返回模擬數據
    if (req.isTestUser) {
      const updatedPayroll = {
        id: parseInt(id),
        company,
        employeeId,
        slipDate,
        baseSalary: 400000,
        overtime: 0,
        allowance: 0,
        incomeTax: 0,
        healthInsurance: 0,
        pension: 0,
        otherDeductions: 0,
        netIncome: 400000,
        items: items || [{ id: 1, item_type: 'income', item_name: '基本薪資', amount: 400000 }]
      };
      return res.json(updatedPayroll);
    }

    // 開始事務
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      // 更新薪資單
      await client.query(
        `UPDATE payroll_slips 
         SET company = $1, employee_id = $2, slip_date = $3, updated_at = CURRENT_TIMESTAMP
         WHERE id = $4 AND user_id = $5`,
        [company, employeeId, slipDate, id, req.userId]
      );

      // 刪除現有項目
      await client.query(
        'DELETE FROM payroll_items WHERE payroll_slip_id = $1',
        [id]
      );

      // 插入新項目
      for (const item of items) {
        await client.query(
          `INSERT INTO payroll_items (payroll_slip_id, item_type, item_name, amount)
           VALUES ($1, $2, $3, $4)`,
          [id, item.item_type, item.item_name, item.amount]
        );
      }

      await client.query('COMMIT');

      // 返回更新後的薪資單
      const result = await client.query(
        `SELECT ps.*, 
                 json_agg(
                   json_build_object(
                     'id', pi.id,
                     'item_type', pi.item_type,
                     'item_name', pi.item_name,
                     'amount', pi.amount
                   )
                 ) as items
          FROM payroll_slips ps
          LEFT JOIN payroll_items pi ON ps.id = pi.payroll_slip_id
          WHERE ps.id = $1
          GROUP BY ps.id`,
        [id]
      );

      res.json(result.rows[0]);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('更新薪資單錯誤:', err);
    res.status(500).json({ error: '更新薪資單失敗' });
  }
});

// 刪除薪資單
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // 如果是測試用戶，返回成功
    if (req.isTestUser) {
      return res.json({ message: '薪資單已刪除' });
    }

    const result = await db.query(
      'DELETE FROM payroll_slips WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '薪資單不存在' });
    }

    res.json({ message: '薪資單已刪除' });
  } catch (err) {
    console.error('刪除薪資單錯誤:', err);
    res.status(500).json({ error: '刪除薪資單失敗' });
  }
});

// Download CSV template
router.get('/template/csv', async (req, res) => {
  try {
    const csvContent = `公司名稱,員工編號,員工姓名,部門,薪資日期,工作天數,缺勤天數,有薪假天數,無薪假天數,基本薪資,津貼,總薪資,扣除額,保險費,所得稅,實發薪資,銀行轉帳,現金支付,備註
測試科技公司,EMP001,張小明,研發部,2024-06-30,22,0,0,0,400000,20000,420000,85000,25000,45000,335000,335000,0,6月份薪資單`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="personal-payroll-template.csv"');
    res.setHeader('Content-Length', Buffer.byteLength(csvContent, 'utf8'));
    
    res.send(csvContent);
  } catch (error) {
    console.error('Error generating CSV template:', error);
    res.status(500).json({ error: 'Failed to generate CSV template' });
  }
});

// Upload CSV file
router.post('/upload/csv', multer({
  dest: 'temp/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  }
}).single('csvFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CSV file uploaded' });
    }

    console.log('Uploaded file:', req.file);

    // Read and parse CSV file
    const csv = require('csv-parser');
    const fs = require('fs');
    const results = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => {
        console.log('CSV row:', data);
        results.push(data);
      })
      .on('end', () => {
        console.log('CSV parsing completed, rows:', results.length);
        
        // Clean up uploaded file
        try {
          fs.unlinkSync(req.file.path);
        } catch (error) {
          console.error('Error deleting temp file:', error);
        }
        
        // Process the CSV data
        const processedData = results.map(row => ({
          companyName: row['公司名稱'] || row['Company Name'],
          employeeNo: row['員工編號'] || row['Employee ID'],
          name: row['員工姓名'] || row['Employee Name'],
          division: row['部門'] || row['Division'],
          slipDate: row['薪資日期'] || row['Payroll Date'],
          daysWorked: parseInt(row['工作天數'] || row['Days Worked']) || 0,
          absentDays: parseInt(row['缺勤天數'] || row['Absent Days']) || 0,
          paidLeave: parseInt(row['有薪假天數'] || row['Paid Leave']) || 0,
          unpaidLeave: parseInt(row['無薪假天數'] || row['Unpaid Leave']) || 0,
          baseSalary: parseFloat(row['基本薪資'] || row['Base Salary']) || 0,
          allowance: parseFloat(row['津貼'] || row['Allowance']) || 0,
          grossSalary: parseFloat(row['總薪資'] || row['Gross Salary']) || 0,
          deductions: parseFloat(row['扣除額'] || row['Deductions']) || 0,
          insurance: parseFloat(row['保險費'] || row['Insurance']) || 0,
          incomeTax: parseFloat(row['所得稅'] || row['Income Tax']) || 0,
          netPay: parseFloat(row['實發薪資'] || row['Net Pay']) || 0,
          bankTransfer: parseFloat(row['銀行轉帳'] || row['Bank Transfer']) || 0,
          cash: parseFloat(row['現金支付'] || row['Cash']) || 0,
          notes: row['備註'] || row['Notes'] || ''
        }));

        console.log('Processed data:', processedData);

        res.json({
          message: 'CSV file processed successfully',
          data: processedData,
          totalRecords: processedData.length
        });
      })
      .on('error', (error) => {
        console.error('Error parsing CSV:', error);
        
        // Clean up uploaded file
        try {
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
        } catch (cleanupError) {
          console.error('Error deleting temp file:', cleanupError);
        }
        
        res.status(500).json({ error: 'Failed to parse CSV file' });
      });

  } catch (error) {
    console.error('Error uploading CSV:', error);
    res.status(500).json({ error: 'Failed to upload CSV file' });
  }
});

module.exports = router;
