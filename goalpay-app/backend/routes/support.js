const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// 確保支援報告目錄存在
const supportDir = path.join(__dirname, '../support-reports');
const ensureSupportDir = async () => {
  try {
    await fs.access(supportDir);
  } catch {
    await fs.mkdir(supportDir, { recursive: true });
  }
};

// 接收診斷報告
router.post('/diagnostic', async (req, res) => {
  try {
    await ensureSupportDir();
    
    const { userDescription, diagnosticInfo, generatedAt } = req.body;
    
    if (!diagnosticInfo) {
      return res.status(400).json({ error: '診斷信息缺失' });
    }

    // 生成報告ID
    const reportId = `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // 創建報告對象
    const report = {
      id: reportId,
      timestamp: new Date().toISOString(),
      userDescription,
      diagnosticInfo,
      generatedAt,
      status: 'pending',
      priority: determinePriority(diagnosticInfo),
      category: categorizeIssue(userDescription, diagnosticInfo)
    };

    // 保存報告到文件
    const reportPath = path.join(supportDir, `${reportId}.json`);
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');

    // 記錄到支援系統日誌
    await logSupportRequest(report);

    console.log(`📋 收到診斷報告: ${reportId}`);
    console.log(`📝 用戶描述: ${userDescription?.substring(0, 100)}...`);
    console.log(`🔍 問題類別: ${report.category}`);
    console.log(`⚡ 優先級: ${report.priority}`);

    res.json({
      success: true,
      reportId,
      message: '診斷報告已成功接收',
      estimatedResponseTime: getEstimatedResponseTime(report.priority)
    });

  } catch (error) {
    console.error('Error processing diagnostic report:', error);
    res.status(500).json({ error: '處理診斷報告時發生錯誤' });
  }
});

// 獲取支援狀態
router.get('/status/:reportId', async (req, res) => {
  try {
    const { reportId } = req.params;
    const reportPath = path.join(supportDir, `${reportId}.json`);
    
    const reportData = await fs.readFile(reportPath, 'utf8');
    const report = JSON.parse(reportData);
    
    res.json({
      reportId,
      status: report.status,
      category: report.category,
      priority: report.priority,
      timestamp: report.timestamp,
      estimatedResponseTime: getEstimatedResponseTime(report.priority)
    });
  } catch (error) {
    res.status(404).json({ error: '報告未找到' });
  }
});

// 獲取常見問題解決方案
router.get('/faq', async (req, res) => {
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

  res.json({ faq });
});

// 獲取系統狀態
router.get('/system-status', async (req, res) => {
  try {
    const systemStatus = {
      timestamp: new Date().toISOString(),
      services: {
        backend: 'operational',
        database: 'operational',
        fileUpload: 'operational'
      },
      performance: {
        responseTime: 'normal',
        uptime: process.uptime()
      },
      recentIssues: await getRecentIssues()
    };

    res.json(systemStatus);
  } catch (error) {
    res.status(500).json({ error: '無法獲取系統狀態' });
  }
});

// 輔助函數：確定問題優先級
function determinePriority(diagnosticInfo) {
  const { apiEndpoints, errors } = diagnosticInfo;
  
  // 檢查是否有嚴重錯誤
  if (errors.length > 0) {
    return 'high';
  }
  
  // 檢查API端點狀態
  const unreachableEndpoints = Object.values(apiEndpoints).filter(status => status === 'unreachable').length;
  if (unreachableEndpoints >= 2) {
    return 'high';
  } else if (unreachableEndpoints === 1) {
    return 'medium';
  }
  
  return 'low';
}

// 輔助函數：分類問題
function categorizeIssue(userDescription, diagnosticInfo) {
  const description = userDescription.toLowerCase();
  const { apiEndpoints } = diagnosticInfo;
  
  if (description.includes('儀表板') || description.includes('dashboard') || apiEndpoints.dashboard !== 'accessible') {
    return 'dashboard';
  }
  
  if (description.includes('上傳') || description.includes('upload') || description.includes('csv')) {
    return 'upload';
  }
  
  if (description.includes('登入') || description.includes('login') || description.includes('認證')) {
    return 'authentication';
  }
  
  if (description.includes('保存') || description.includes('save') || description.includes('數據')) {
    return 'data';
  }
  
  if (description.includes('網絡') || description.includes('network') || description.includes('連接')) {
    return 'network';
  }
  
  return 'general';
}

// 輔助函數：獲取預估回應時間
function getEstimatedResponseTime(priority) {
  switch (priority) {
    case 'high':
      return '2-4小時';
    case 'medium':
      return '24小時內';
    case 'low':
      return '48小時內';
    default:
      return '24小時內';
  }
}

// 輔助函數：記錄支援請求
async function logSupportRequest(report) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    reportId: report.id,
    category: report.category,
    priority: report.priority,
    userDescription: report.userDescription?.substring(0, 100)
  };
  
  const logPath = path.join(supportDir, 'support-log.json');
  
  try {
    const existingLog = await fs.readFile(logPath, 'utf8');
    const logs = JSON.parse(existingLog);
    logs.push(logEntry);
    await fs.writeFile(logPath, JSON.stringify(logs, null, 2));
  } catch {
    await fs.writeFile(logPath, JSON.stringify([logEntry], null, 2));
  }
}

// 輔助函數：獲取最近問題
async function getRecentIssues() {
  try {
    const logPath = path.join(supportDir, 'support-log.json');
    const logData = await fs.readFile(logPath, 'utf8');
    const logs = JSON.parse(logData);
    
    // 返回最近24小時的問題
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return logs
      .filter(log => new Date(log.timestamp) > oneDayAgo)
      .slice(-5); // 最近5個問題
  } catch {
    return [];
  }
}

module.exports = router;
