import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Download, TrendingUp, TrendingDown, DollarSign, Calendar, Building } from 'lucide-react';
import ExportModal from '../../components/ExportModal/ExportModal';
import { useAuth } from '../../contexts/AuthContext';

interface SalarySummary {
  totalSlips: number;
  totalGross: number;
  totalNet: number;
  totalDeductions: number;
  monthlyData: Array<{
    month: string;
    gross: number;
    net: number;
    deductions: number;
  }>;
  yearlyData: Array<{
    year: string;
    gross: number;
    net: number;
    deductions: number;
  }>;
}

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [summary, setSummary] = useState<SalarySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await api.get('/reports/summary');
      // setSummary(response.data);
      
      // Mock data for now
      setSummary({
        totalSlips: 12,
        totalGross: 6000000,
        totalNet: 4800000,
        totalDeductions: 1200000,
        monthlyData: [
          { month: '2024-01', gross: 500000, net: 400000, deductions: 100000 },
          { month: '2024-02', gross: 500000, net: 400000, deductions: 100000 },
          { month: '2024-03', gross: 500000, net: 400000, deductions: 100000 },
          { month: '2024-04', gross: 500000, net: 400000, deductions: 100000 },
          { month: '2024-05', gross: 500000, net: 400000, deductions: 100000 },
          { month: '2024-06', gross: 500000, net: 400000, deductions: 100000 },
        ],
        yearlyData: [
          { year: '2023', gross: 6000000, net: 4800000, deductions: 1200000 },
          { year: '2024', gross: 3000000, net: 2400000, deductions: 600000 },
        ]
      });
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: user?.preferredCurrency || 'JPY'
    }).format(amount);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('dashboard.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('dashboard.subtitle')}
          </p>
        </div>
        <button
          onClick={() => setShowExportModal(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Download className="w-5 h-5" />
          <span>{t('dashboard.exportReport')}</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('dashboard.totalGross')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(summary?.totalGross || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('dashboard.totalNet')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(summary?.totalNet || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('dashboard.totalDeductions')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(summary?.totalDeductions || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('dashboard.totalSlips')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {summary?.totalSlips || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('dashboard.monthlyTrend')}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={summary?.monthlyData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="gross" fill="#0088FE" name={t('dashboard.gross')} />
              <Bar dataKey="net" fill="#00C49F" name={t('dashboard.net')} />
              <Bar dataKey="deductions" fill="#FF8042" name={t('dashboard.deductions')} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Yearly Comparison Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('dashboard.yearlyComparison')}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={summary?.yearlyData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Line type="monotone" dataKey="gross" stroke="#0088FE" name={t('dashboard.gross')} />
              <Line type="monotone" dataKey="net" stroke="#00C49F" name={t('dashboard.net')} />
              <Line type="monotone" dataKey="deductions" stroke="#FF8042" name={t('dashboard.deductions')} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Income vs Deductions Pie Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('dashboard.incomeVsDeductions')}
        </h3>
        <div className="flex justify-center">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={[
                  { name: t('dashboard.netIncome'), value: summary?.totalNet || 0 },
                  { name: t('dashboard.deductions'), value: summary?.totalDeductions || 0 }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {[
                  { name: t('dashboard.netIncome'), value: summary?.totalNet || 0 },
                  { name: t('dashboard.deductions'), value: summary?.totalDeductions || 0 }
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  );
};

export default Dashboard;
