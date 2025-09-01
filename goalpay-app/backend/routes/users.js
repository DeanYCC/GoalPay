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

// 獲取用戶信息
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    // 如果是測試用戶，返回模擬數據
    if (req.isTestUser) {
      return res.json({
        id: 1,
        email: 'test@goalpay.com',
        name: '測試用戶',
        picture: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2QjcyRkYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDkuNzRMMTIgMTZMMTAuOTEgOS43NEw0IDlMMTAuOTEgOC4yNkwxMiAyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo=',
        company_name: '測試公司',
        currency: 'JPY',
        theme: 'light',
        language: 'zh',
        paydayType: 'month_end',
        customPayday: 25,
        periodStartDay: 1,
        periodEndDay: 31
      });
    }

    const result = await db.query(
      'SELECT id, email, name, picture, company_name, currency, theme, language FROM users WHERE id = $1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '用戶不存在' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('獲取用戶信息錯誤:', err);
    res.status(500).json({ error: '獲取用戶信息失敗' });
  }
});

// 更新用戶信息
router.put('/profile', authenticateToken, [
  body('company_name').optional().isLength({ max: 255 }),
  body('currency').optional().isIn(['JPY', 'USD', 'EUR', 'CNY']),
  body('theme').optional().isIn(['light', 'dark']),
  body('language').optional().isIn(['zh', 'en', 'jp']),
  body('paydayType').optional().isIn(['month_end', 'custom_day', 'custom_period']),
  body('customPayday').optional().isInt({ min: 1, max: 31 }),
  body('periodStartDay').optional().isInt({ min: 1, max: 31 }),
  body('periodEndDay').optional().isInt({ min: 1, max: 31 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { company_name, currency, theme, language, paydayType, customPayday, periodStartDay, periodEndDay } = req.body;
    
    // 如果是測試用戶，返回模擬更新後的數據
    if (req.isTestUser) {
      return res.json({
        id: 1,
        email: 'test@goalpay.com',
        name: '測試用戶',
        picture: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2QjcyRkYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDkuNzRMMTIgMTZMMTAuOTEgOS43NEw0IDlMMTAuOTEgOC4yNkwxMiAyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo=',
        company_name: company_name || '測試公司',
        currency: currency || 'JPY',
        theme: theme || 'light',
        language: language || 'zh',
        paydayType: paydayType || 'month_end',
        customPayday: customPayday || 25,
        periodStartDay: periodStartDay || 1,
        periodEndDay: periodEndDay || 31
      });
    }
    
    const result = await db.query(
      `UPDATE users 
       SET company_name = COALESCE($1, company_name),
           currency = COALESCE($2, currency),
           theme = COALESCE($3, theme),
           language = COALESCE($4, language),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING id, email, name, picture, company_name, currency, theme, language`,
      [company_name, currency, theme, language, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '用戶不存在' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('更新用戶信息錯誤:', err);
    res.status(500).json({ error: '更新用戶信息失敗' });
  }
});

module.exports = router;
