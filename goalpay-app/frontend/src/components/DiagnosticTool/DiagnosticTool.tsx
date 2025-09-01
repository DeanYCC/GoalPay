import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface DiagnosticInfo {
  timestamp: string;
  userAgent: string;
  screenResolution: string;
  timezone: string;
  language: string;
  localStorage: boolean;
  sessionStorage: boolean;
  cookies: boolean;
  networkStatus: string;
  apiEndpoints: {
    health: string;
    dashboard: string;
    payroll: string;
  };
  errors: Array<{
    type: string;
    message: string;
    timestamp: string;
    stack?: string;
  }>;
  performance: {
    loadTime: number;
    memoryUsage?: number;
  };
}

const DiagnosticTool: React.FC = () => {
  const { t } = useTranslation();
  const [diagnosticInfo, setDiagnosticInfo] = useState<DiagnosticInfo | null>(null);
  const [isCollecting, setIsCollecting] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [includeSensitiveData, setIncludeSensitiveData] = useState(false);
  const [userDescription, setUserDescription] = useState('');

  // 收集系統信息
  const collectDiagnosticInfo = async (): Promise<DiagnosticInfo> => {
    const startTime = performance.now();
    
    // 基本系統信息
    const basicInfo = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      localStorage: !!window.localStorage,
      sessionStorage: !!window.sessionStorage,
      cookies: navigator.cookieEnabled,
      networkStatus: navigator.onLine ? 'online' : 'offline',
    };

    // 測試API端點
    const apiEndpoints = {
      health: 'unknown',
      dashboard: 'unknown',
      payroll: 'unknown',
    };

    try {
      const healthResponse = await fetch('http://localhost:5001/health', { 
        method: 'GET'
      });
      apiEndpoints.health = healthResponse.ok ? 'accessible' : `error-${healthResponse.status}`;
    } catch (error) {
      apiEndpoints.health = 'unreachable';
    }

    try {
      const dashboardResponse = await fetch('http://localhost:5001/api/dashboard/summary', { 
        method: 'GET'
      });
      apiEndpoints.dashboard = dashboardResponse.ok ? 'accessible' : `error-${dashboardResponse.status}`;
    } catch (error) {
      apiEndpoints.dashboard = 'unreachable';
    }

    try {
      const payrollResponse = await fetch('http://localhost:5001/api/payroll', { 
        method: 'GET'
      });
      apiEndpoints.payroll = payrollResponse.ok ? 'accessible' : `error-${payrollResponse.status}`;
    } catch (error) {
      apiEndpoints.payroll = 'unreachable';
    }

    // 收集錯誤信息
    const errors: Array<{type: string, message: string, timestamp: string, stack?: string}> = [];
    
    // 監聽未捕獲的錯誤
    window.addEventListener('error', (event) => {
      errors.push({
        type: 'JavaScript Error',
        message: event.message,
        timestamp: new Date().toISOString(),
        stack: event.error?.stack
      });
    });

    // 監聽Promise拒絕
    window.addEventListener('unhandledrejection', (event) => {
      errors.push({
        type: 'Promise Rejection',
        message: event.reason?.message || 'Unknown promise rejection',
        timestamp: new Date().toISOString(),
        stack: event.reason?.stack
      });
    });

    const loadTime = performance.now() - startTime;

    return {
      ...basicInfo,
      apiEndpoints,
      errors,
      performance: {
        loadTime,
        memoryUsage: (performance as any).memory?.usedJSHeapSize
      }
    };
  };

  // 生成診斷報告
  const generateReport = async () => {
    setIsCollecting(true);
    try {
      const info = await collectDiagnosticInfo();
      setDiagnosticInfo(info);
      setReportGenerated(true);
    } catch (error) {
      console.error('Error collecting diagnostic info:', error);
    } finally {
      setIsCollecting(false);
    }
  };

  // 下載診斷報告
  const downloadReport = () => {
    if (!diagnosticInfo) return;

    const report = {
      userDescription,
      diagnosticInfo: includeSensitiveData ? diagnosticInfo : {
        ...diagnosticInfo,
        userAgent: 'REDACTED',
        errors: diagnosticInfo.errors.map(error => ({
          ...error,
          stack: includeSensitiveData ? error.stack : 'REDACTED'
        }))
      },
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `goalpay-diagnostic-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 發送到支援系統
  const sendToSupport = async () => {
    if (!diagnosticInfo) return;

    try {
      const report = {
        userDescription,
        diagnosticInfo: includeSensitiveData ? diagnosticInfo : {
          ...diagnosticInfo,
          userAgent: 'REDACTED',
          errors: diagnosticInfo.errors.map(error => ({
            ...error,
            stack: includeSensitiveData ? error.stack : 'REDACTED'
          }))
        },
        generatedAt: new Date().toISOString()
      };

      // 這裡可以發送到您的支援系統API
      const response = await fetch('http://localhost:5001/api/support/diagnostic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(report)
      });

      if (response.ok) {
        alert('診斷報告已成功發送到支援團隊');
      } else {
        throw new Error('Failed to send report');
      }
    } catch (error) {
      console.error('Error sending report:', error);
      alert('發送報告失敗，請下載報告並手動發送給支援團隊');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        🔧 {t('diagnostic.title', '系統診斷工具')}
      </h2>

      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          {t('diagnostic.description', '此工具將收集系統信息以幫助我們診斷問題。所有敏感信息都會被保護。')}
        </p>
      </div>

      {/* 用戶問題描述 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('diagnostic.problemDescription', '請描述您遇到的問題：')}
        </label>
        <textarea
          value={userDescription}
          onChange={(e) => setUserDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder={t('diagnostic.problemPlaceholder', '請詳細描述您遇到的問題，包括錯誤信息、操作步驟等...')}
        />
      </div>

      {/* 隱私設置 */}
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={includeSensitiveData}
            onChange={(e) => setIncludeSensitiveData(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">
            {t('diagnostic.includeSensitiveData', '包含敏感數據（瀏覽器信息等）')}
          </span>
        </label>
        <p className="text-xs text-gray-500 mt-1">
          {t('diagnostic.sensitiveDataNote', '注意：包含敏感數據可能有隱私風險，僅在必要時勾選')}
        </p>
      </div>

      {/* 操作按鈕 */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={generateReport}
          disabled={isCollecting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isCollecting ? t('diagnostic.collecting', '收集中...') : t('diagnostic.generateReport', '生成診斷報告')}
        </button>
      </div>

      {/* 診斷結果 */}
      {diagnosticInfo && (
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            📊 {t('diagnostic.results', '診斷結果')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">{t('diagnostic.systemInfo', '系統信息')}</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>時間: {new Date(diagnosticInfo.timestamp).toLocaleString()}</p>
                <p>語言: {diagnosticInfo.language}</p>
                <p>時區: {diagnosticInfo.timezone}</p>
                <p>屏幕: {diagnosticInfo.screenResolution}</p>
                <p>網絡: {diagnosticInfo.networkStatus}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">{t('diagnostic.apiStatus', 'API狀態')}</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>健康檢查: <span className={diagnosticInfo.apiEndpoints.health === 'accessible' ? 'text-green-600' : 'text-red-600'}>
                  {diagnosticInfo.apiEndpoints.health}
                </span></p>
                <p>儀表板: <span className={diagnosticInfo.apiEndpoints.dashboard === 'accessible' ? 'text-green-600' : 'text-red-600'}>
                  {diagnosticInfo.apiEndpoints.dashboard}
                </span></p>
                <p>薪資API: <span className={diagnosticInfo.apiEndpoints.payroll === 'accessible' ? 'text-green-600' : 'text-red-600'}>
                  {diagnosticInfo.apiEndpoints.payroll}
                </span></p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">{t('diagnostic.performance', '性能信息')}</h4>
            <div className="text-sm text-gray-600">
              <p>加載時間: {diagnosticInfo.performance.loadTime.toFixed(2)}ms</p>
              {diagnosticInfo.performance.memoryUsage && (
                <p>內存使用: {(diagnosticInfo.performance.memoryUsage / 1024 / 1024).toFixed(2)}MB</p>
              )}
            </div>
          </div>

          {diagnosticInfo.errors.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">{t('diagnostic.errors', '錯誤信息')}</h4>
              <div className="text-sm text-red-600 space-y-1">
                {diagnosticInfo.errors.map((error, index) => (
                  <div key={index} className="border-l-2 border-red-400 pl-2">
                    <p><strong>{error.type}:</strong> {error.message}</p>
                    <p className="text-xs text-gray-500">{error.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 操作按鈕 */}
          <div className="flex gap-4">
            <button
              onClick={downloadReport}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              📥 {t('diagnostic.downloadReport', '下載報告')}
            </button>
            <button
              onClick={sendToSupport}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              📤 {t('diagnostic.sendToSupport', '發送給支援團隊')}
            </button>
          </div>
        </div>
      )}

      {/* 使用說明 */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">{t('diagnostic.instructions', '使用說明')}</h4>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>{t('diagnostic.step1', '描述您遇到的問題')}</li>
          <li>{t('diagnostic.step2', '點擊"生成診斷報告"收集系統信息')}</li>
          <li>{t('diagnostic.step3', '檢查診斷結果，確認沒有敏感信息洩露')}</li>
          <li>{t('diagnostic.step4', '下載報告或直接發送給支援團隊')}</li>
        </ol>
      </div>
    </div>
  );
};

export default DiagnosticTool;
