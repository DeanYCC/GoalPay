import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3 } from 'lucide-react';

const Analytics: React.FC = () => {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState('6m');

  // 獲取分析數據
  const { data: analyticsData, isLoading, error } = useQuery({
    queryKey: ['analytics', selectedPeriod],
    queryFn: async () => {
      const response = await axios.get(API_ENDPOINTS.DASHBOARD.TEST_DATA);
      console.log('Analytics data received:', response.data); // 添加調試日誌
      return response.data;
    },
    // 移除不必要的 enabled: true
    staleTime: 30000, // 添加緩存時間
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
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-gray-600 dark:text-gray-400">載入數據時發生錯誤</p>
          <p className="text-sm text-gray-500 mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  // 驗證數據結構
  if (!analyticsData || !analyticsData.taxHistory || !Array.isArray(analyticsData.taxHistory)) {
    console.log('Analytics data validation failed:', analyticsData); // 添加調試日誌
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-gray-600 text-xl mb-4">📊</div>
          <p className="text-gray-600 dark:text-gray-400">沒有可用的分析數據</p>
          <p className="text-sm text-gray-500 mt-2">請檢查數據源或稍後再試</p>
        </div>
      </div>
    );
  }

  // 驗證稅收歷史數據的結構
  const validTaxHistory = analyticsData.taxHistory.filter(item => 
    item && typeof item.month === 'string' && 
    typeof item.income === 'number' && 
    typeof item.tax === 'number'
  );

  if (validTaxHistory.length === 0) {
    console.log('No valid tax history data found:', analyticsData.taxHistory); // 添加調試日誌
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-gray-600 text-xl mb-4">📊</div>
          <p className="text-gray-600 dark:text-gray-400">稅收歷史數據格式不正確</p>
          <p className="text-sm text-gray-500 mt-2">請檢查數據格式或稍後再試</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="p-6 space-y-6">
      {/* 頁面標題 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('dashboard.salaryTrend')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('analytics.trendAnalysis')}
          </p>
        </div>
        
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="1m">{t('periods.1m')}</option>
            <option value="3m">{t('periods.3m')}</option>
            <option value="6m">{t('periods.6m')}</option>
            <option value="1y">{t('periods.1y')}</option>
          </select>
        </div>
      </div>

      {/* 關鍵指標 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('analytics.averageMonthlyIncome')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ¥{analyticsData?.summary?.monthlyIncome?.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('analytics.growthRate')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                +{analyticsData?.summary?.growthRate || '0'}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('analytics.averageDeductions')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ¥{analyticsData?.summary?.monthlyDeductions?.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('analytics.dataPoints')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {validTaxHistory.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 主要圖表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 收入趨勢圖 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('analytics.incomeTrend')}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={validTaxHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tickFormatter={(value) => {
                  try {
                    const date = new Date(value);
                    return date.toLocaleDateString('ja-JP', { 
                      year: 'numeric', 
                      month: 'short' 
                    });
                  } catch {
                    return value;
                  }
                }}
              />
              <YAxis 
                tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip 
                formatter={(value: number) => [`¥${value.toLocaleString()}`, t('income')]}
                labelFormatter={(label) => {
                  try {
                    const date = new Date(label);
                    return date.toLocaleDateString('ja-JP', { 
                      year: 'numeric', 
                      month: 'long' 
                    });
                  } catch {
                    return label;
                  }
                }}
              />
              <Area type="monotone" dataKey="income" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} name={t('income')} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 稅收趨勢圖 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('analytics.taxTrend')}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={validTaxHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tickFormatter={(value) => {
                  try {
                    const date = new Date(value);
                    return date.toLocaleDateString('ja-JP', { 
                      year: 'numeric', 
                      month: 'short' 
                    });
                  } catch {
                    return value;
                  }
                }}
              />
              <YAxis 
                tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip 
                formatter={(value: number) => [`¥${value.toLocaleString()}`, t('tax')]}
                labelFormatter={(label) => {
                  try {
                    const date = new Date(label);
                    return date.toLocaleDateString('ja-JP', { 
                      year: 'numeric', 
                      month: 'long' 
                    });
                  } catch {
                    return label;
                  }
                }}
              />
              <Line type="monotone" dataKey="tax" stroke="#82ca9d" strokeWidth={2} name={t('tax')} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 詳細分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 收入 vs 稅收對比 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('analytics.incomeVsTax')}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={validTaxHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tickFormatter={(value) => {
                  try {
                    const date = new Date(value);
                    return date.toLocaleDateString('ja-JP', { 
                      year: 'numeric', 
                      month: 'short' 
                    });
                  } catch {
                    return value;
                  }
                }}
              />
              <YAxis 
                tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip 
                formatter={(value: number) => [`¥${value.toLocaleString()}`, '']}
                labelFormatter={(label) => {
                  try {
                    const date = new Date(label);
                    return date.toLocaleDateString('ja-JP', { 
                      year: 'numeric', 
                      month: 'long' 
                    });
                  } catch {
                    return label;
                  }
                }}
              />
              <Legend />
              <Bar dataKey="income" fill="#8884d8" name={t('income')} />
              <Bar dataKey="tax" fill="#82ca9d" name={t('tax')} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 稅收比例 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('analytics.taxRatio')}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: t('incomeTax'), value: 45000 },
                  { name: t('healthInsurance'), value: 25000 },
                  { name: t('pension'), value: 15000 },
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

        {/* 趨勢分析 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('analytics.trendAnalysis')}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">{t('analytics.incomeGrowth')}</span>
              </div>
              <span className="text-sm font-bold text-green-600 dark:text-green-400">+5.2%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center">
                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">{t('analytics.averageIncome')}</span>
              </div>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">¥450,000</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">{t('analytics.dataPeriod')}</span>
              </div>
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{t('periods.6m')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
