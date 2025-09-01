export default function handler(req, res) {
  // 模擬儀表板數據
  const mockData = {
    totalSalary: 1250000,
    averageSalary: 416667,
    totalEmployees: 3,
    monthlyGrowth: 5.2,
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

  res.status(200).json(mockData);
}
