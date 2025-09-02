import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import StatsCard from '../components/dashboard/StatsCard';
import SalaryChart from '../components/dashboard/SalaryChart';
import QuickActions from '../components/dashboard/QuickActions';
import RecentPayrolls from '../components/dashboard/RecentPayrolls';
import SalaryTerms from '../components/SalaryTerms/SalaryTerms';
import { TrendingUp, TrendingDown, DollarSign, Calculator } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [isTestUser, setIsTestUser] = useState(false);
  const [showSalaryTerms, setShowSalaryTerms] = useState(false);

  useEffect(() => {
    // 檢查是否為測試用戶
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setIsTestUser(userData.email === 'test@goalpay.com');
    }
  }, []);

  // 獲取儀表板數據
  const { data: dashboardData, isLoading, error } = useQuery(
    'dashboardData',
    async () => {
      if (isTestUser) {
        // 使用測試數據端點
        const response = await axios.get(API_ENDPOINTS.DASHBOARD.TEST_DATA);
        return response.data;
      } else {
        // 使用實際數據端點
        const response = await axios.get(API_ENDPOINTS.DASHBOARD.SUMMARY);
        return response.data;
      }
    },
    {
      enabled: true,
      refetchInterval: 30000, // 每30秒刷新一次
    }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t('common.error')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            無法載入儀表板數據，請檢查網絡連接
          </p>
          <div className="mt-4 text-sm text-gray-500">
            錯誤詳情: {error.message}
          </div>
        </div>
      </div>
    );
  }

  const summary = dashboardData?.summary || dashboardData;
  const recentPayrolls = dashboardData?.recentPayrolls || [];

  return (
    <div className="p-6 space-y-6">
      {/* 頁面標題 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('dashboard.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('dashboard.subtitle')}
          </p>
        </div>
        {isTestUser && (
          <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-sm">
            🧪 測試模式
          </div>
        )}
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title={t('dashboard.totalIncome')}
          value={summary.monthlyIncome || summary.totalIncome}
          currency={summary.currency || 'JPY'}
          icon={DollarSign}
          trend={summary.monthlyGrowth}
          trendDirection={summary.monthlyGrowth >= 0 ? 'up' : 'down'}
        />
        <StatsCard
          title={t('dashboard.averageSalary')}
          value={summary.averageSalary}
          currency={summary.currency || 'JPY'}
          icon={Calculator}
        />
        <StatsCard
          title={t('dashboard.totalEmployees')}
          value={summary.totalEmployees}
          icon={TrendingUp}
        />
        <StatsCard
          title={t('dashboard.monthlyGrowth')}
          value={`${summary.monthlyGrowth}%`}
          icon={summary.monthlyGrowth >= 0 ? TrendingUp : TrendingDown}
          trendDirection={summary.monthlyGrowth >= 0 ? 'up' : 'down'}
        />
      </div>

      {/* 圖表和最近薪資單 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalaryChart data={summary} />
        <RecentPayrolls payrolls={recentPayrolls} />
      </div>

      {/* 快速操作 */}
      <QuickActions onShowSalaryTerms={() => setShowSalaryTerms(true)} />

      {/* 薪資條款模態框 */}
      {showSalaryTerms && (
        <SalaryTerms onClose={() => setShowSalaryTerms(false)} />
      )}
    </div>
  );
};

export default Dashboard;
