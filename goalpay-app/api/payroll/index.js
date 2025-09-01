export default function handler(req, res) {
  if (req.method === 'GET') {
    // 獲取薪資列表
    const mockPayrolls = [
      {
        id: 1,
        employeeName: "張小明",
        employeeNo: "EMP001",
        companyName: "測試科技公司",
        division: "研發部",
        slipDate: "2024-06-30",
        baseSalary: 400000,
        allowance: 20000,
        grossSalary: 420000,
        deductions: 85000,
        insurance: 25000,
        incomeTax: 45000,
        netPay: 335000,
        bankTransfer: 335000,
        cash: 0,
        notes: "6月份薪資單"
      }
    ];

    res.status(200).json(mockPayrolls);
  } else if (req.method === 'POST') {
    // 創建新薪資記錄
    const newPayroll = req.body;
    res.status(201).json({
      message: '薪資記錄創建成功',
      data: newPayroll
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
