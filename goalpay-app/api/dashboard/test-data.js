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
      totalSalary: 1250000,
      averageSalary: 416667,
      totalEmployees: 3,
      monthlyGrowth: 5.2,
      monthlyIncome: 1250000,
      currency: 'JPY'
    },
    recentPayrolls: [
      {
        id: 1,
        employeeName: "張小明",
        amount: 335000,
        date: "2024-06-30"
      },
      {
        id: 2,
        employeeName: "李美玲",
        amount: 313000,
        date: "2024-06-30"
      },
      {
        id: 3,
        employeeName: "王建國",
        amount: 324000,
        date: "2024-06-30"
      }
    ]
  };

  // 添加延遲以模擬真實API
  setTimeout(() => {
    res.status(200).json(testData);
  }, 100);
}
