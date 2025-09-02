import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DiagnosticTool from '../components/DiagnosticTool/DiagnosticTool';
import { API_ENDPOINTS } from '../config/api';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface SystemStatus {
  timestamp: string;
  services: {
    backend: string;
    database: string;
    fileUpload: string;
  };
  performance: {
    responseTime: string;
    uptime: number;
  };
  recentIssues: Array<{
    timestamp: string;
    category: string;
    priority: string;
  }>;
}

const Support: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'diagnostic' | 'faq' | 'contact'>('diagnostic');
  const [faq, setFaq] = useState<FAQ[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFAQ();
    loadSystemStatus();
  }, []);

  const loadFAQ = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.SUPPORT.FAQ);
      if (response.ok) {
        const data = await response.json();
        setFaq(data.faq);
      }
    } catch (error) {
      console.error('Error loading FAQ:', error);
    }
  };

  const loadSystemStatus = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.SUPPORT.SYSTEM_STATUS);
      if (response.ok) {
        const data = await response.json();
        setSystemStatus(data);
      }
    } catch (error) {
      console.error('Error loading system status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-600';
      case 'degraded':
        return 'text-yellow-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🆘 {t('support.title', '技術支援')}
          </h1>
          <p className="text-gray-600">
            {t('support.subtitle', '我們在這裡幫助您解決任何問題')}
          </p>
        </div>

        {/* 標籤頁 */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('diagnostic')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'diagnostic'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🔧 {t('support.diagnostic', '診斷工具')}
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'faq'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            ❓ {t('support.faq', '常見問題')}
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'contact'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📞 {t('support.contact', '聯繫我們')}
          </button>
        </div>

        {/* 系統狀態面板 */}
        {systemStatus && (
          <div className="mb-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              📊 {t('support.systemStatus', '系統狀態')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">{t('support.services', '服務狀態')}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>後端服務</span>
                    <span className={getStatusColor(systemStatus.services.backend)}>
                      {systemStatus.services.backend}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>數據庫</span>
                    <span className={getStatusColor(systemStatus.services.database)}>
                      {systemStatus.services.database}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>文件上傳</span>
                    <span className={getStatusColor(systemStatus.services.fileUpload)}>
                      {systemStatus.services.fileUpload}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">{t('support.performance', '性能指標')}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>回應時間</span>
                    <span>{systemStatus.performance.responseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>運行時間</span>
                    <span>{Math.floor(systemStatus.performance.uptime / 3600)}小時</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">{t('support.recentIssues', '最近問題')}</h4>
                <div className="space-y-2 text-sm">
                  {systemStatus.recentIssues.length > 0 ? (
                    systemStatus.recentIssues.map((issue, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="truncate">{issue.category}</span>
                        <span className={`ml-2 ${getPriorityColor(issue.priority)}`}>
                          {issue.priority}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className="text-green-600">無問題報告</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 內容區域 */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'diagnostic' && (
            <DiagnosticTool />
          )}

          {activeTab === 'faq' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                ❓ {t('support.faqTitle', '常見問題')}
              </h2>
              <div className="space-y-6">
                {faq.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {item.question}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.answer}
                    </p>
                    <div className="mt-2">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {item.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                📞 {t('support.contactTitle', '聯繫我們')}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    {t('support.contactInfo', '聯繫信息')}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-3">📧</span>
                      <div>
                        <p className="font-medium">技術支援</p>
                        <p className="text-sm text-gray-600">support@goalpay.com</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-3">📱</span>
                      <div>
                        <p className="font-medium">客服熱線</p>
                        <p className="text-sm text-gray-600">+886 2 1234-5678</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-3">💬</span>
                      <div>
                        <p className="font-medium">在線客服</p>
                        <p className="text-sm text-gray-600">工作日 9:00-18:00</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    {t('support.responseTime', '回應時間')}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span className="font-medium">緊急問題</span>
                      <span className="text-green-600 font-semibold">2-4小時</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                      <span className="font-medium">一般問題</span>
                      <span className="text-yellow-600 font-semibold">24小時內</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                      <span className="font-medium">功能建議</span>
                      <span className="text-blue-600 font-semibold">48小時內</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">
                  💡 {t('support.tips', '聯繫前準備')}
                </h4>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>{t('support.tip1', '準備詳細的問題描述')}</li>
                  <li>{t('support.tip2', '記錄錯誤信息和操作步驟')}</li>
                  <li>{t('support.tip3', '使用診斷工具生成報告')}</li>
                  <li>{t('support.tip4', '提供系統環境信息')}</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Support;
