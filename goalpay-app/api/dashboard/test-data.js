export default function handler(req, res) {
  // 設置CORS頭
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 處理OPTIONS請求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 只允許GET請求
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // 模擬測試數據
  const testData = {
    summary: {
      totalIncome: 450000,
      totalDeductions: 85000,
      netIncome: 365000,
      monthlyAverage: 365000,
      monthlyGrowth: 2.5,
      currency: 'JPY'
    },
    recentPayrolls: [
      {
        id: 1,
        company: "測試科技公司",
        employeeId: "EMP001",
        slipDate: "2024-06-30",
        netIncome: 365000,
        items: [
          { item_type: 'income', item_name: '基本薪資', amount: 400000 },
          { item_type: 'income', item_name: '加班費', amount: 50000 },
          { item_type: 'deduction', item_name: '所得稅', amount: 45000 },
          { item_type: 'deduction', item_name: '健康保險', amount: 25000 },
          { item_type: 'deduction', item_name: '養老金', amount: 15000 }
        ]
      },
      {
        id: 2,
        company: "測試科技公司",
        employeeId: "EMP001",
        slipDate: "2024-05-31",
        netIncome: 361000,
        items: [
          { item_type: 'income', item_name: '基本薪資', amount: 400000 },
          { item_type: 'income', item_name: '加班費', amount: 46000 },
          { item_type: 'deduction', item_name: '所得稅', amount: 45000 },
          { item_type: 'deduction', item_name: '健康保險', amount: 25000 },
          { item_type: 'deduction', item_name: '養老金', amount: 15000 }
        ]
      },
      {
        id: 3,
        company: "測試科技公司",
        employeeId: "EMP001",
        slipDate: "2024-04-30",
        netIncome: 357000,
        items: [
          { item_type: 'income', item_name: '基本薪資', amount: 400000 },
          { item_type: 'income', item_name: '加班費', amount: 42000 },
          { item_type: 'deduction', item_name: '所得稅', amount: 45000 },
          { item_type: 'deduction', item_name: '健康保險', amount: 25000 },
          { item_type: 'deduction', item_name: '養老金', amount: 15000 }
        ]
      }
    ]
  };

  // 添加延遲以模擬真實API
  setTimeout(() => {
    res.status(200).json(testData);
  }, 100);
}
