export default function handler(req, res) {
  if (req.method === 'GET') {
    // 從 URL 中獲取薪資單 ID
    const { id } = req.query;
    
    // 模擬薪資詳情數據
    const mockPayrollDetail = {
      id: parseInt(id),
      company: "測試科技公司",
      employeeId: "EMP001",
      slipDate: "2024-06-30",
      baseSalary: 400000,
      overtime: 50000,
      allowance: 20000,
      incomeTax: 45000,
      healthInsurance: 25000,
      pension: 30000,
      otherDeductions: 0,
      netIncome: 370000,
      items: [
        {
          id: 1,
          item_type: 'income',
          item_name: '基本薪資',
          amount: 400000
        },
        {
          id: 2,
          item_type: 'income',
          item_name: '加班費',
          amount: 50000
        },
        {
          id: 3,
          item_type: 'income',
          item_name: '津貼',
          amount: 20000
        },
        {
          id: 4,
          item_type: 'deduction',
          item_name: '所得稅',
          amount: 45000
        },
        {
          id: 5,
          item_type: 'deduction',
          item_name: '健康保險',
          amount: 25000
        },
        {
          id: 6,
          item_type: 'deduction',
          item_name: '養老金',
          amount: 30000
        }
      ]
    };

    res.status(200).json(mockPayrollDetail);
  } else if (req.method === 'PUT') {
    // 更新薪資記錄
    const updatedPayroll = req.body;
    res.status(200).json({
      message: '薪資記錄更新成功',
      data: updatedPayroll
    });
  } else if (req.method === 'DELETE') {
    // 刪除薪資記錄
    res.status(200).json({
      message: '薪資記錄刪除成功'
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
