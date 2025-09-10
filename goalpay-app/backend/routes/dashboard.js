const express = require('express');
const router = express.Router();

// 認證中間件
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: '未提供認證 token' });
  }

  // 檢查是否為測試 token
  if (token === 'valid-token' || token.startsWith('test-token-')) {
    req.userId = 1; // 測試用戶 ID
    req.isTestUser = true;
    return next();
  }

  // 這裡應該驗證 JWT token
  // 暫時跳過驗證，直接通過
  req.userId = 1;
  next();
};

// 獲取儀表板摘要數據
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    // 模擬數據 - 在實際應用中會從數據庫查詢
    const summary = {
      totalIncome: 450000,
      totalDeductions: 85000,
      netIncome: 365000,
      payrollCount: 5,
      currency: 'JPY'
    };
    
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: '獲取摘要數據失敗' });
  }
});

// 獲取年度摘要
router.get('/yearly-summary', async (req, res) => {
  try {
    const yearlyData = {
      2024: {
        totalIncome: 5400000,
        totalDeductions: 1020000,
        netIncome: 4380000,
        averageMonthly: 365000
      },
      2023: {
        totalIncome: 4800000,
        totalDeductions: 960000,
        netIncome: 3840000,
        averageMonthly: 320000
      }
    };
    
    res.json(yearlyData);
  } catch (error) {
    res.status(500).json({ error: '獲取年度摘要失敗' });
  }
});

// 獲取稅收歷史
router.get('/tax-history', async (req, res) => {
  try {
    const taxHistory = [
      { month: '2024-01', income: 420000, tax: 75000 },
      { month: '2024-02', income: 430000, tax: 78000 },
      { month: '2024-03', income: 440000, tax: 80000 },
      { month: '2024-04', income: 450000, tax: 82000 },
      { month: '2024-05', income: 460000, tax: 84000 },
      { month: '2024-06', income: 470000, tax: 86000 }
    ];
    
    res.json(taxHistory);
  } catch (error) {
    res.status(500).json({ error: '獲取稅收歷史失敗' });
  }
});

// 測試數據端點
router.get('/test-data', async (req, res) => {
  try {
    const testData = {
      summary: {
        monthlyIncome: 450000,
        monthlyDeductions: 85000,
        netIncome: 365000,
        growthRate: 5.2,
        currency: 'JPY'
      },
      recentPayrolls: [
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
        },
        {
          id: 3,
          company: '測試科技公司',
          employeeId: 'EMP001',
          slipDate: '2024-04-30',
          baseSalary: 400000,
          overtime: 20000,
          allowance: 20000,
          incomeTax: 43000,
          healthInsurance: 25000,
          pension: 15000,
          otherDeductions: 0,
          netIncome: 357000,
          items: [
            { id: 13, item_type: 'income', item_name: '基本薪資', amount: 400000 },
            { id: 14, item_type: 'income', item_name: '加班費', amount: 20000 },
            { id: 15, item_type: 'income', item_name: '津貼', amount: 20000 },
            { id: 16, item_type: 'deduction', item_name: '所得稅', amount: 43000 },
            { id: 17, item_type: 'deduction', item_name: '健康保險', amount: 25000 },
            { id: 18, item_type: 'deduction', item_name: '養老金', amount: 15000 }
          ]
        }
      ],
      yearlySummary: {
        2024: {
          totalIncome: 5400000,
          totalDeductions: 1020000,
          netIncome: 4380000,
          averageMonthly: 365000
        },
        2023: {
          totalIncome: 4800000,
          totalDeductions: 960000,
          netIncome: 3840000,
          averageMonthly: 320000
        }
      },
      taxHistory: [
        { month: '2024-01', income: 420000, tax: 75000 },
        { month: '2024-02', income: 430000, tax: 78000 },
        { month: '2024-03', income: 440000, tax: 80000 },
        { month: '2024-04', income: 450000, tax: 82000 },
        { month: '2024-05', income: 460000, tax: 84000 },
        { month: '2024-06', income: 470000, tax: 86000 }
      ],
      monthlyTrend: [
        { month: '2024-01', income: 425000, deductions: 80000, net: 345000 },
        { month: '2024-02', income: 430000, deductions: 81000, net: 349000 },
        { month: '2024-03', income: 435000, deductions: 82000, net: 353000 },
        { month: '2024-04', income: 440000, deductions: 83000, net: 357000 },
        { month: '2024-05', income: 445000, deductions: 84000, net: 361000 },
        { month: '2024-06', income: 450000, deductions: 85000, net: 365000 }
      ]
    };
    
    res.json(testData);
  } catch (error) {
    res.status(500).json({ error: '獲取測試數據失敗' });
  }
});

module.exports = router;
