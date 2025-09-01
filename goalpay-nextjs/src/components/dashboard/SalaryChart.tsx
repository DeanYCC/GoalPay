import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Payslip {
  id: string;
  pay_period: string;
  payment?: {
    net_pay: number;
  };
  earnings?: {
    gross_salary: number;
  };
  deductions?: {
    total_deduct: number;
  };
}

interface SalaryChartProps {
  payslips: Payslip[];
  isLoading: boolean;
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
}

export default function SalaryChart({ payslips, isLoading, selectedPeriod, setSelectedPeriod }: SalaryChartProps) {
  const { t, language } = useLanguage();
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const processChartData = () => {
    if (!payslips.length) return [];

    const months = language === 'jp' 
      ? ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    // 根据选择的期间过滤数据
    let filteredPayslips = payslips;
    if (selectedPeriod === '6m') {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      filteredPayslips = payslips.filter(slip => 
        new Date(slip.pay_period) >= sixMonthsAgo
      );
    } else if (selectedPeriod === '1y') {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      filteredPayslips = payslips.filter(slip => 
        new Date(slip.pay_period) >= oneYearAgo
      );
    }

    // 按月份分组数据
    const monthlyData = months.map((month, index) => {
      const monthPayslips = filteredPayslips.filter(slip => {
        const slipDate = new Date(slip.pay_period);
        return slipDate.getMonth() === index && slipDate.getFullYear() === currentYear;
      });

      const totalGross = monthPayslips.reduce((sum, slip) => sum + (slip.earnings?.gross_salary || 0), 0);
      const totalNet = monthPayslips.reduce((sum, slip) => sum + (slip.payment?.net_pay || 0), 0);
      const totalDeductions = monthPayslips.reduce((sum, slip) => sum + (slip.deductions?.total_deduct || 0), 0);

      return {
        month,
        gross: totalGross,
        net: totalNet,
        deductions: totalDeductions,
        count: monthPayslips.length
      };
    });

    return monthlyData;
  };

  const chartData = processChartData();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {t('dashboard.salaryTrend')}
        </h3>
        <div className="flex items-center space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="6m">{t('periods.6m')}</option>
            <option value="1y">{t('periods.1y')}</option>
            <option value="all">{t('periods.all')}</option>
          </select>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="space-y-6">
          {/* 柱状图 - 总收入 vs 净收入 */}
          <div>
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
              {t('dashboard.monthlyComparison')}
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), t('common.currency')]}
                  labelFormatter={(label) => `${label}`}
                />
                <Legend />
                <Bar dataKey="gross" fill="#3b82f6" name={t('dashboard.gross')} />
                <Bar dataKey="net" fill="#10b981" name={t('dashboard.net')} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 折线图 - 净收入趋势 */}
          <div>
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
              {t('dashboard.netIncomeTrend')}
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), t('dashboard.net')]}
                  labelFormatter={(label) => `${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="net" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            {t('dashboard.noChartData')}
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t('dashboard.noChartDataDescription')}
          </p>
        </div>
      )}
    </div>
  );
}
