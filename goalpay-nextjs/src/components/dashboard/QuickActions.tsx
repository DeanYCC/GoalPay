import React from 'react';
import Link from 'next/link';
import { 
  Upload, 
  FileText, 
  BarChart3, 
  Settings, 
  Download,
  Plus,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function QuickActions() {
  const { t } = useLanguage();
  const actions = [
    {
      title: t('dashboard.uploadPayslip'),
      description: t('dashboard.uploadDescription'),
      icon: Upload,
      href: '/upload',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: t('dashboard.viewReports'),
      description: t('dashboard.reportsDescription'),
      icon: BarChart3,
      href: '/reports',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: t('dashboard.exportData'),
      description: t('dashboard.exportDescription'),
      icon: Download,
      href: '/export',
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      title: t('dashboard.salaryTerms'),
      description: t('dashboard.termsDescription'),
      icon: FileText,
      href: '/salary-terms',
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
          <Plus className="h-5 w-5 text-white" />
        </div>
        <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
          {t('dashboard.quickActions')}
        </h3>
      </div>

      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              href={action.href}
              className={`block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 ${action.bgColor}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {action.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 统计摘要 */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
          {t('dashboard.monthlyOverview')}
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Calendar className="h-5 w-5 text-blue-500 mx-auto mb-1" />
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.payslips')}</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">0</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <DollarSign className="h-5 w-5 text-green-500 mx-auto mb-1" />
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.totalIncome')}</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">¥0</div>
          </div>
        </div>
      </div>
    </div>
  );
}
