const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// 確保支援報告目錄存在
const supportDir = path.join(__dirname, '../support-reports');

// 獲取所有診斷報告
router.get('/diagnostic-reports', async (req, res) => {
  try {
    const files = await fs.readdir(supportDir);
    const reports = [];
    
    for (const file of files) {
      if (file.endsWith('.json') && file !== 'support-log.json') {
        const filePath = path.join(supportDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        const report = JSON.parse(content);
        
        // 只返回基本信息，不包含完整的診斷數據
        reports.push({
          id: report.id,
          timestamp: report.timestamp,
          category: report.category,
          priority: report.priority,
          status: report.status,
          userDescription: report.userDescription?.substring(0, 100) + '...',
          estimatedResponseTime: getEstimatedResponseTime(report.priority)
        });
      }
    }
    
    // 按時間排序，最新的在前
    reports.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json({ reports });
  } catch (error) {
    console.error('Error reading diagnostic reports:', error);
    res.status(500).json({ error: '無法讀取診斷報告' });
  }
});

// 獲取特定診斷報告詳情
router.get('/diagnostic-reports/:reportId', async (req, res) => {
  try {
    const { reportId } = req.params;
    const reportPath = path.join(supportDir, `${reportId}.json`);
    
    const content = await fs.readFile(reportPath, 'utf8');
    const report = JSON.parse(content);
    
    res.json({ report });
  } catch (error) {
    res.status(404).json({ error: '報告未找到' });
  }
});

// 更新報告狀態
router.patch('/diagnostic-reports/:reportId/status', async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, adminNotes } = req.body;
    
    const reportPath = path.join(supportDir, `${reportId}.json`);
    const content = await fs.readFile(reportPath, 'utf8');
    const report = JSON.parse(content);
    
    report.status = status;
    report.adminNotes = adminNotes;
    report.updatedAt = new Date().toISOString();
    
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');
    
    res.json({ success: true, message: '報告狀態已更新' });
  } catch (error) {
    res.status(500).json({ error: '更新報告狀態失敗' });
  }
});

// 獲取支援統計
router.get('/support-stats', async (req, res) => {
  try {
    const files = await fs.readdir(supportDir);
    const reports = [];
    
    for (const file of files) {
      if (file.endsWith('.json') && file !== 'support-log.json') {
        const filePath = path.join(supportDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        const report = JSON.parse(content);
        reports.push(report);
      }
    }
    
    // 計算統計數據
    const stats = {
      total: reports.length,
      byStatus: {
        pending: reports.filter(r => r.status === 'pending').length,
        inProgress: reports.filter(r => r.status === 'in_progress').length,
        resolved: reports.filter(r => r.status === 'resolved').length,
        closed: reports.filter(r => r.status === 'closed').length
      },
      byPriority: {
        high: reports.filter(r => r.priority === 'high').length,
        medium: reports.filter(r => r.priority === 'medium').length,
        low: reports.filter(r => r.priority === 'low').length
      },
      byCategory: {
        dashboard: reports.filter(r => r.category === 'dashboard').length,
        upload: reports.filter(r => r.category === 'upload').length,
        authentication: reports.filter(r => r.category === 'authentication').length,
        data: reports.filter(r => r.category === 'data').length,
        network: reports.filter(r => r.category === 'network').length,
        general: reports.filter(r => r.category === 'general').length
      },
      recentActivity: reports
        .filter(r => new Date(r.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
        .length
    };
    
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ error: '無法獲取統計數據' });
  }
});

// 獲取支援日誌
router.get('/support-log', async (req, res) => {
  try {
    const logPath = path.join(supportDir, 'support-log.json');
    const content = await fs.readFile(logPath, 'utf8');
    const logs = JSON.parse(content);
    
    res.json({ logs });
  } catch (error) {
    res.json({ logs: [] });
  }
});

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

module.exports = router;
