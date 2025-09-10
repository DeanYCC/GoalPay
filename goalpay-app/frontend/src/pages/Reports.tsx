import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, FileText, TrendingUp, Calendar, DollarSign, Settings, ChevronDown, ChevronUp, Edit } from 'lucide-react';

const Reports: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [dateError, setDateError] = useState('');

  // 驗證自訂日期範圍
  const validateCustomDateRange = () => {
    if (!customStartDate || !customEndDate) {
      setDateError(t('reports.pleaseSelectBothDates'));
      return false;
    }
    
    if (customStartDate > customEndDate) {
      setDateError(t('reports.startDateCannotBeAfterEndDate'));
      return false;
    }
    
    const startDate = new Date(customStartDate);
    const endDate = new Date(customEndDate);
    const today = new Date();
    
    if (endDate > today) {
      setDateError(t('reports.endDateCannotBeInFuture'));
      return false;
    }
    
    setDateError('');
    return true;
  };

  // 根據選擇的時間區間計算日期範圍
  const getDateRange = () => {
    const now = new Date();
    let startDate = '';
    let endDate = now.toISOString().split('T')[0];

    switch (selectedPeriod) {
      case '1m':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        break;
      case '3m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString().split('T')[0];
        break;
      case '6m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString().split('T')[0];
        break;
      case '1y':
        startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          startDate = customStartDate;
          endDate = customEndDate;
        } else {
          // 如果自訂日期未設置，使用預設的6個月
          startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString().split('T')[0];
        }
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString().split('T')[0];
    }

    return { startDate, endDate };
  };

  const { startDate, endDate } = getDateRange();

  // 獲取報告數據
  const { data: reportsData, isLoading, refetch, error } = useQuery({
    queryKey: ['reports', selectedPeriod, startDate, endDate],
    queryFn: async () => {
      try {
        console.log('Fetching reports data:', { selectedPeriod, startDate, endDate }); // 添加調試日誌
        
        // 如果有自訂日期範圍，使用報告 API
        if (selectedPeriod === 'custom' && customStartDate && customEndDate) {
          console.log('Using custom date range API:', { customStartDate, customEndDate }); // 添加調試日誌
          const response = await axios.get(API_ENDPOINTS.REPORTS.CUSTOM_RANGE(customStartDate, customEndDate));
          console.log('Custom range API response:', response.data); // 添加調試日誌
          return response.data;
        } else {
          // 否則使用儀表板測試數據
          console.log('Using dashboard test data API'); // 添加調試日誌
          const response = await axios.get(API_ENDPOINTS.DASHBOARD.TEST_DATA);
          return response.data;
        }
      } catch (error) {
        console.error('Failed to fetch reports data:', error);
        // 如果 API 失敗，返回測試數據作為後備
        const response = await axios.get(API_ENDPOINTS.DASHBOARD.TEST_DATA);
        return response.data;
      }
    },
    staleTime: 30000, // 添加緩存時間
  });

  // 當自訂日期改變時重新獲取數據
  useEffect(() => {
    if (selectedPeriod === 'custom' && customStartDate && customEndDate) {
      const isValid = validateCustomDateRange();
      console.log('Custom date validation result:', isValid); // 添加調試日誌
      if (isValid) {
        console.log('Refetching data for custom period:', { customStartDate, customEndDate }); // 添加調試日誌
        refetch();
      }
    } else if (selectedPeriod !== 'custom') {
      // 當選擇非自訂區間時，也要重新獲取數據
      console.log('Refetching data for period:', selectedPeriod); // 添加調試日誌
      refetch();
    }
  }, [customStartDate, customEndDate, selectedPeriod, refetch]);

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
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-gray-600 dark:text-gray-400">載入報告數據時發生錯誤</p>
          <p className="text-sm text-gray-500 mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="p-6 space-y-6">
      {/* 頁面標題 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('dashboard.viewReports')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('reports.subtitle')}
          </p>
        </div>
        
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => {
              const newPeriod = e.target.value;
              setSelectedPeriod(newPeriod);
              // 如果選擇自訂區間，自動顯示詳細設定面板
              if (newPeriod === 'custom') {
                setShowAdvancedSettings(true);
              } else {
                setShowAdvancedSettings(false);
              }
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="1m">{t('periods.1m')}</option>
            <option value="3m">{t('periods.3m')}</option>
            <option value="6m">{t('periods.6m')}</option>
            <option value="1y">{t('periods.1y')}</option>
            <option value="custom">{t('reports.customPeriod')}</option>
          </select>
          
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            {t('reports.exportReport')}
          </button>
        </div>
      </div>

                {/* 詳細設定面板 */}
          {showAdvancedSettings && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('reports.detailedTimeSettings')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 快速年月選擇 */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('reports.quickSelection')}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('reports.selectYear')}
                      </label>
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                          <option key={year} value={year}>{year}{t('reports.year')}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('reports.selectMonth')}
                      </label>
                      <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                          <option key={month} value={month}>{month}{t('reports.month')}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      // 修正：選擇6月時，應該顯示6/1-6/30
                      const startDate = new Date(selectedYear, selectedMonth - 1, 1);
                      const endDate = new Date(selectedYear, selectedMonth, 0); // 這個會得到當月的最後一天
                      const startDateStr = startDate.toISOString().split('T')[0];
                      const endDateStr = endDate.toISOString().split('T')[0];
                      console.log('Setting custom dates:', { startDateStr, endDateStr }); // 添加調試日誌
                      setCustomStartDate(startDateStr);
                      setCustomEndDate(endDateStr);
                      setSelectedPeriod('custom');
                    }}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {t('reports.applyYearMonthSettings')} ({selectedYear}{t('reports.year')}{selectedMonth}{t('reports.month')})
                  </button>
                </div>

                {/* 自訂日期範圍 */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('reports.customDateRange')}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('reports.startDate')}
                      </label>
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => {
                          const newStartDate = e.target.value;
                          setCustomStartDate(newStartDate);
                          console.log('Start date changed:', newStartDate); // 添加調試日誌
                          if (newStartDate && customEndDate) {
                            setSelectedPeriod('custom');
                            validateCustomDateRange();
                          }
                        }}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('reports.endDate')}
                      </label>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => {
                          const newEndDate = e.target.value;
                          setCustomEndDate(newEndDate);
                          console.log('End date changed:', newEndDate); // 添加調試日誌
                          if (customStartDate && newEndDate) {
                            setSelectedPeriod('custom');
                            validateCustomDateRange();
                          }
                        }}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  {/* 錯誤訊息顯示 */}
                  {dateError && (
                    <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md">
                      <p className="text-sm text-red-600 dark:text-red-400">{dateError}</p>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => {
                      setCustomStartDate('');
                      setCustomEndDate('');
                      setSelectedPeriod('6m');
                      setDateError('');
                    }}
                    className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    重置設定
                  </button>
                </div>
              </div>

              {/* 當前選擇顯示 */}
              {selectedPeriod === 'custom' && (customStartDate || customEndDate) && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {t('reports.currentSelection')}：{customStartDate} {t('reports.to')} {customEndDate}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    數據點數：{reportsData?.recentPayrolls?.length || 0}
                  </p>
                </div>
              )}
            </div>
          )}

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.totalIncome')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ¥{reportsData?.summary?.totalIncome?.toLocaleString() || '0'}
              </p>
              {selectedPeriod === 'custom' && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {customStartDate} - {customEndDate}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.netIncome')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ¥{reportsData?.summary?.netIncome?.toLocaleString() || '0'}
              </p>
              {selectedPeriod === 'custom' && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {customStartDate} - {customEndDate}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.totalDeductions')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ¥{reportsData?.summary?.totalDeductions?.toLocaleString() || '0'}
              </p>
              {selectedPeriod === 'custom' && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {customStartDate} - {customEndDate}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('reports.payslipCount')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {reportsData?.recentPayrolls?.length || '0'}
              </p>
              {selectedPeriod === 'custom' && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {customStartDate} - {customEndDate}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 圖表區域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 薪資趨勢圖 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('reports.salaryTrend')}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportsData?.chartData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#8884d8" name={t('reports.income')} />
              <Line type="monotone" dataKey="deductions" stroke="#82ca9d" name={t('reports.tax')} />
              <Line type="monotone" dataKey="net" stroke="#ffc658" name={t('dashboard.netIncome')} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 收入分配圖 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('reports.incomeDistribution')}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: t('reports.baseSalary'), value: 400000 },
                  { name: t('reports.overtime'), value: 30000 },
                  { name: t('reports.allowance'), value: 20000 },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 詳細報告表格 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('reports.payslipDetails')}
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('payroll.company')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('reports.date')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('dashboard.totalIncome')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('dashboard.totalDeductions')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('dashboard.netIncome')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('common.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {reportsData?.recentPayrolls?.map((payroll: any) => (
                <tr key={payroll.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {payroll.company}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {payroll.slipDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ¥{payroll.items?.filter((item: any) => item.item_type === 'income')?.reduce((sum: number, item: any) => sum + item.amount, 0)?.toLocaleString() || '0'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ¥{payroll.items?.filter((item: any) => item.item_type === 'deduction')?.reduce((sum: number, item: any) => sum + item.amount, 0)?.toLocaleString() || '0'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
                    ¥{payroll.netIncome?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <button
                      onClick={() => navigate(`/payroll/${payroll.id}`)}
                      className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      編輯
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
