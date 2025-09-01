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
        const response = await axios.get('http://localhost:5001/api/dashboard/test-data');
        return response.data;
      } else {
        // 使用實際數據端點
        const response = await axios.get('http://localhost:5001/api/dashboard/summary');
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
          trend={summary.growthRate || 0}
          icon={DollarSign}
          trendUp={summary.growthRate > 0}
        />
        <StatsCard
          title={t('dashboard.totalDeductions')}
          value={summary.monthlyDeductions || summary.totalDeductions}
          currency={summary.currency || 'JPY'}
          trend={-2.1}
          icon={Calculator}
          trendUp={false}
        />
        <StatsCard
          title={t('dashboard.netIncome')}
          value={summary.netIncome}
          currency={summary.currency || 'JPY'}
          trend={summary.growthRate || 5.2}
          icon={TrendingUp}
          trendUp={true}
        />
        <StatsCard
          title={t('dashboard.monthlyAverage')}
          value={summary.monthlyAverage || summary.netIncome}
          currency={summary.currency || 'JPY'}
          trend={3.8}
          icon={TrendingUp}
          trendUp={true}
        />
      </div>

      {/* 圖表和快速操作 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 薪資趨勢圖 */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('dashboard.monthlyOverview')}
            </h3>
            <SalaryChart data={dashboardData?.taxHistory || []} />
          </div>
        </div>

        {/* 快速操作 */}
        <div className="space-y-6">
          <QuickActions onOpenSalaryTerms={() => setShowSalaryTerms(true)} />
          
          {/* 最近薪資單 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('dashboard.recentPayrolls')}
            </h3>
            <RecentPayrolls payrolls={recentPayrolls} />
          </div>
        </div>
      </div>

      {/* 薪資條款彈窗 */}
      <SalaryTerms 
        isOpen={showSalaryTerms} 
        onClose={() => setShowSalaryTerms(false)} 
      />
    </div>
  );
};

export default Dashboard;
