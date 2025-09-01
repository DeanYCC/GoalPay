export default function handler(req, res) {
  const faq = [
    {
      id: 'dashboard-loading',
      question: '儀表板無法載入數據',
      answer: '請檢查網絡連接和後端服務器是否運行。如果問題持續，請使用診斷工具生成報告。',
      category: 'dashboard'
    },
    {
      id: 'csv-upload-error',
      question: 'CSV文件上傳失敗',
      answer: '確保CSV文件格式正確，包含所有必需欄位。檢查文件大小是否超過限制。',
      category: 'upload'
    },
    {
      id: 'login-issue',
      question: '無法登入系統',
      answer: '檢查用戶名和密碼是否正確。清除瀏覽器緩存或嘗試無痕模式。',
      category: 'authentication'
    },
    {
      id: 'data-not-saving',
      question: '數據無法保存',
      answer: '檢查網絡連接和瀏覽器存儲權限。確保沒有特殊字符在輸入欄位中。',
      category: 'data'
    }
  ];

  res.status(200).json({ faq });
}
