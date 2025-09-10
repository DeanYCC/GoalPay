import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import StatsCard from '../components/dashboard/StatsCard';
import SalaryChart from '../components/dashboard/SalaryChart';
import QuickActions from '../components/dashboard/QuickActions';
import RecentPayrolls from '../components/dashboard/RecentPayrolls';
import SalaryTerms from '../components/SalaryTerms/SalaryTerms';
import { TrendingUp, TrendingDown, DollarSign, Calculator } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';
import { payrollCalculations } from '../services/companyService';

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

    // 在開發環境中運行計算測試（僅一次）
    if (process.env.NODE_ENV === 'development') {
      payrollCalculations.runTests();
    }
  }, []);

  // 獲取儀表板數據
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboardData', isTestUser],
    queryFn: async () => {
      // 使用狀態中的 isTestUser，避免重複檢查 localStorage
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
    // 移除不必要的 enabled: true
    refetchInterval: 60000, // 改為每60秒刷新一次，減少頻率
    staleTime: 30000, // 添加 staleTime，30秒內不重新獲取
  });

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
          <div className="mt-4">
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              重新載入
            </button>
          </div>
        </div>
      </div>
    );
  }

  const summary = dashboardData?.summary || dashboardData;
  const recentPayrolls = dashboardData?.recentPayrolls || [];

  // 驗證薪資單數據
  const validationResults = recentPayrolls?.map(payroll => ({
    id: payroll.id,
    ...payrollCalculations.validatePayrollData(payroll)
  })) || [];

  // 檢查是否有驗證錯誤
  const hasValidationErrors = validationResults?.some(result => !result.isValid) || false;
  if (hasValidationErrors) {
    console.warn('薪資單數據驗證錯誤:', validationResults?.filter(result => !result.isValid) || []);
  }

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
          value={summary?.totalIncome || 0}
          currency={summary?.currency || 'JPY'}
          trend={summary?.monthlyGrowth || 0}
          icon="dollar-sign"
          color="green"
        />
        <StatsCard
          title={t('dashboard.totalDeductions')}
          value={summary?.totalDeductions || 0}
          currency={summary?.currency || 'JPY'}
          trend={0}
          icon="trending-down"
          color="red"
        />
        <StatsCard
          title={t('dashboard.netIncome')}
          value={summary?.netIncome || 0}
          currency={summary?.currency || 'JPY'}
          trend={summary?.monthlyGrowth || 0}
          icon="trending-up"
          color="blue"
        />
        <StatsCard
          title={t('dashboard.monthlyAverage')}
          value={summary?.monthlyAverage || 0}
          currency={summary?.currency || 'JPY'}
          trend={0}
          icon="calendar"
          color="purple"
        />
      </div>

      {/* 圖表和最近薪資單 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalaryChart data={dashboardData?.chartData || []} />
        <RecentPayrolls payrolls={recentPayrolls} />
      </div>

      {/* 快速操作 */}
      <QuickActions 
        onShowSalaryTerms={() => setShowSalaryTerms(true)} 
        validationResults={validationResults}
      />

      {/* 薪資條款模態框 */}
      {showSalaryTerms && (
        <SalaryTerms onClose={() => setShowSalaryTerms(false)} />
      )}
    </div>
  );
};

export default Dashboard;
