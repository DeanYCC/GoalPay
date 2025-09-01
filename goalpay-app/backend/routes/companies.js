const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { body, validationResult } = require('express-validator');
const router = express.Router();

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

// 模擬公司數據（測試用）
let mockCompanies = [
  {
    id: 1,
    userId: 1,
    name: '測試科技公司',
    employeeId: 'EMP001',
    position: '軟體工程師',
    isCurrent: true,
    startDate: '2024-01-01',
    endDate: null,
    paydayType: 'month_end',
    customPayday: 25,
    periodStartDay: 1,
    periodEndDay: 31,
    currency: 'JPY',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    userId: 1,
    name: '前公司',
    employeeId: 'EMP002',
    position: '前端工程師',
    isCurrent: false,
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    paydayType: 'custom_day',
    customPayday: 15,
    periodStartDay: 1,
    periodEndDay: 31,
    currency: 'JPY',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-12-31T00:00:00Z'
  }
];

// 獲取用戶的所有公司
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (req.isTestUser) {
      return res.json(mockCompanies);
    }

    const result = await db.query(
      'SELECT * FROM companies WHERE user_id = $1 ORDER BY is_current DESC, created_at DESC',
      [req.userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('獲取公司列表錯誤:', err);
    res.status(500).json({ error: '獲取公司列表失敗' });
  }
});

// 獲取單個公司
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.isTestUser) {
      const company = mockCompanies.find(c => c.id === parseInt(id));
      if (!company) {
        return res.status(404).json({ error: '公司不存在' });
      }
      return res.json(company);
    }

    const result = await db.query(
      'SELECT * FROM companies WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '公司不存在' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('獲取公司錯誤:', err);
    res.status(500).json({ error: '獲取公司失敗' });
  }
});

// 獲取當前公司
router.get('/current', authenticateToken, async (req, res) => {
  try {
    if (req.isTestUser) {
      const currentCompany = mockCompanies.find(c => c.isCurrent);
      return res.json(currentCompany || null);
    }

    const result = await db.query(
      'SELECT * FROM companies WHERE user_id = $1 AND is_current = true',
      [req.userId]
    );

    res.json(result.rows[0] || null);
  } catch (err) {
    console.error('獲取當前公司錯誤:', err);
    res.status(500).json({ error: '獲取當前公司失敗' });
  }
});

// 創建新公司
router.post('/', authenticateToken, [
  body('name').notEmpty().withMessage('公司名稱不能為空'),
  body('employeeId').notEmpty().withMessage('員工編號不能為空'),
  body('position').notEmpty().withMessage('職位不能為空'),
  body('startDate').isISO8601().withMessage('到職日期格式不正確'),
  body('endDate').optional().isISO8601().withMessage('離職日期格式不正確'),
  body('paydayType').isIn(['month_end', 'custom_day', 'custom_period']).withMessage('發薪日類型不正確'),
  body('currency').isIn(['JPY', 'USD', 'EUR', 'CNY']).withMessage('幣別不正確')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      name, employeeId, position, isCurrent, startDate, endDate,
      paydayType, customPayday, periodStartDay, periodEndDay, currency
    } = req.body;

    if (req.isTestUser) {
      const newCompany = {
        id: mockCompanies.length + 1,
        userId: 1,
        name,
        employeeId,
        position,
        isCurrent: isCurrent || false,
        startDate,
        endDate: endDate || null,
        paydayType,
        customPayday: customPayday || null,
        periodStartDay: periodStartDay || null,
        periodEndDay: periodEndDay || null,
        currency,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // 如果設為現職，將其他公司設為非現職
      if (isCurrent) {
        mockCompanies = mockCompanies.map(c => ({ ...c, isCurrent: false }));
      }

      mockCompanies.push(newCompany);
      return res.status(201).json(newCompany);
    }

    // 如果設為現職，先將其他公司設為非現職
    if (isCurrent) {
      await db.query(
        'UPDATE companies SET is_current = false WHERE user_id = $1',
        [req.userId]
      );
    }

    const result = await db.query(
      `INSERT INTO companies (
        user_id, name, employee_id, position, is_current, start_date, end_date,
        payday_type, custom_payday, period_start_day, period_end_day, currency
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [
        req.userId, name, employeeId, position, isCurrent || false,
        startDate, endDate, paydayType, customPayday, periodStartDay, periodEndDay, currency
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('創建公司錯誤:', err);
    res.status(500).json({ error: '創建公司失敗' });
  }
});

// 更新公司
router.put('/:id', authenticateToken, [
  body('name').optional().notEmpty().withMessage('公司名稱不能為空'),
  body('employeeId').optional().notEmpty().withMessage('員工編號不能為空'),
  body('position').optional().notEmpty().withMessage('職位不能為空'),
  body('startDate').optional().isISO8601().withMessage('到職日期格式不正確'),
  body('endDate').optional().isISO8601().withMessage('離職日期格式不正確'),
  body('paydayType').optional().isIn(['month_end', 'custom_day', 'custom_period']).withMessage('發薪日類型不正確'),
  body('currency').optional().isIn(['JPY', 'USD', 'EUR', 'CNY']).withMessage('幣別不正確')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const updateData = req.body;

    if (req.isTestUser) {
      const companyIndex = mockCompanies.findIndex(c => c.id === parseInt(id));
      if (companyIndex === -1) {
        return res.status(404).json({ error: '公司不存在' });
      }

      // 如果設為現職，將其他公司設為非現職
      if (updateData.isCurrent) {
        mockCompanies = mockCompanies.map(c => ({ ...c, isCurrent: false }));
      }

      mockCompanies[companyIndex] = {
        ...mockCompanies[companyIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      return res.json(mockCompanies[companyIndex]);
    }

    // 如果設為現職，先將其他公司設為非現職
    if (updateData.isCurrent) {
      await db.query(
        'UPDATE companies SET is_current = false WHERE user_id = $1 AND id != $2',
        [req.userId, id]
      );
    }

    const result = await db.query(
      `UPDATE companies SET 
        name = COALESCE($1, name),
        employee_id = COALESCE($2, employee_id),
        position = COALESCE($3, position),
        is_current = COALESCE($4, is_current),
        start_date = COALESCE($5, start_date),
        end_date = COALESCE($6, end_date),
        payday_type = COALESCE($7, payday_type),
        custom_payday = COALESCE($8, custom_payday),
        period_start_day = COALESCE($9, period_start_day),
        period_end_day = COALESCE($10, period_end_day),
        currency = COALESCE($11, currency),
        updated_at = NOW()
      WHERE id = $12 AND user_id = $13 RETURNING *`,
      [
        updateData.name, updateData.employeeId, updateData.position,
        updateData.isCurrent, updateData.startDate, updateData.endDate,
        updateData.paydayType, updateData.customPayday, updateData.periodStartDay,
        updateData.periodEndDay, updateData.currency, id, req.userId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '公司不存在' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('更新公司錯誤:', err);
    res.status(500).json({ error: '更新公司失敗' });
  }
});

// 刪除公司
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.isTestUser) {
      const companyIndex = mockCompanies.findIndex(c => c.id === parseInt(id));
      if (companyIndex === -1) {
        return res.status(404).json({ error: '公司不存在' });
      }

      mockCompanies.splice(companyIndex, 1);
      return res.status(204).send();
    }

    const result = await db.query(
      'DELETE FROM companies WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: '公司不存在' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('刪除公司錯誤:', err);
    res.status(500).json({ error: '刪除公司失敗' });
  }
});

// 設置當前公司
router.patch('/:id/set-current', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.isTestUser) {
      // 將所有公司設為非現職
      mockCompanies = mockCompanies.map(c => ({ ...c, isCurrent: false }));
      
      // 將指定公司設為現職
      const companyIndex = mockCompanies.findIndex(c => c.id === parseInt(id));
      if (companyIndex === -1) {
        return res.status(404).json({ error: '公司不存在' });
      }

      mockCompanies[companyIndex].isCurrent = true;
      mockCompanies[companyIndex].updatedAt = new Date().toISOString();

      return res.json(mockCompanies[companyIndex]);
    }

    // 將所有公司設為非現職
    await db.query(
      'UPDATE companies SET is_current = false WHERE user_id = $1',
      [req.userId]
    );

    // 將指定公司設為現職
    const result = await db.query(
      'UPDATE companies SET is_current = true, updated_at = NOW() WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '公司不存在' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('設置當前公司錯誤:', err);
    res.status(500).json({ error: '設置當前公司失敗' });
  }
});

module.exports = router;
