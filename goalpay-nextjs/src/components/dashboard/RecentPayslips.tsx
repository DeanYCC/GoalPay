import React from 'react';
import { Calendar, DollarSign, TrendingUp } from 'lucide-react';
import Link from 'next/link';
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

interface RecentPayslipsProps {
  payslips: Payslip[];
  isLoading: boolean;
  formatCurrency: (amount: number) => string;
}

export default function RecentPayslips({ payslips, isLoading, formatCurrency }: RecentPayslipsProps) {
  const { t } = useLanguage();
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!payslips.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-center py-8">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            {t('dashboard.noData')}
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t('dashboard.noDataDescription')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {t('dashboard.recentPayslips')}
        </h3>
        <Link 
          href="/reports" 
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {t('dashboard.viewAll')}
        </Link>
      </div>
      
      <div className="space-y-3">
        {payslips.map((payslip) => (
          <div key={payslip.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(payslip.pay_period).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'short'
                })}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.net')}</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(payslip.payment?.net_pay || 0)}
                </div>
              </div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
