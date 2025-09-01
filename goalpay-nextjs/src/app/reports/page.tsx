'use client';

import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExportOptions {
  format: 'pdf' | 'csv';
  includeCharts: boolean;
  includeTables: boolean;
  startDate: string;
  endDate: string;
}

export default function ReportsPage() {
  const { t } = useLanguage();
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeCharts: true,
    includeTables: true,
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exportOptions),
      });

      if (response.ok) {
        // Create blob and download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `goalpay-report-${new Date().toISOString().split('T')[0]}.${exportOptions.format}`;
        link.click();
        window.URL.revokeObjectURL(url);
      } else {
        const error = await response.json();
        alert(`Export failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleOptionChange = (key: keyof ExportOptions, value: string | boolean) => {
    setExportOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('reports.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('reports.subtitle')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="space-y-6">
            {/* Export Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('export.format')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleOptionChange('format', 'pdf')}
                  className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                    exportOptions.format === 'pdf'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <FileText className="w-8 h-8" />
                  <span className="text-sm font-medium">{t('export.pdfReport')}</span>
                </button>
                <button
                  onClick={() => handleOptionChange('format', 'csv')}
                  className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                    exportOptions.format === 'csv'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <FileSpreadsheet className="w-8 h-8" />
                  <span className="text-sm font-medium">{t('export.csvReport')}</span>
                </button>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('export.startDate')}
                </label>
                <input
                  type="date"
                  value={exportOptions.startDate}
                  onChange={(e) => handleOptionChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('export.endDate')}
                </label>
                <input
                  type="date"
                  value={exportOptions.endDate}
                  onChange={(e) => handleOptionChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Content Options */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('export.contentOptions')}
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeTables}
                    onChange={(e) => handleOptionChange('includeTables', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {t('export.includeTables')}
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeCharts}
                    onChange={(e) => handleOptionChange('includeCharts', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {t('export.includeCharts')}
                  </span>
                </label>
              </div>
            </div>

            {/* Export Button */}
            <div className="flex justify-end">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                <Download className="w-5 h-5" />
                <span>
                  {isExporting ? t('export.exporting') : `${t('export.exportAs')} ${exportOptions.format.toUpperCase()}`}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Information Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('reports.pdfReports')}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t('reports.pdfReportsDescription')}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <FileSpreadsheet className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('reports.csvReports')}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t('reports.csvReportsDescription')}
            </p>
          </div>
        </div>

        {/* Quick Export Presets */}
        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('reports.quickExportPresets')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                setExportOptions(prev => ({
                  ...prev,
                  startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
                  endDate: new Date().toISOString().split('T')[0]
                }));
              }}
              className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-left"
            >
              <div className="font-medium text-gray-900 dark:text-white">{t('reports.currentYear')}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{t('reports.currentYearDate')}</div>
            </button>

            <button
              onClick={() => {
                const lastMonth = new Date();
                lastMonth.setMonth(lastMonth.getMonth() - 1);
                const startDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
                const endDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);
                
                setExportOptions(prev => ({
                  ...prev,
                  startDate: startDate.toISOString().split('T')[0],
                  endDate: endDate.toISOString().split('T')[0]
                }));
              }}
              className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-left"
            >
              <div className="font-medium text-gray-900 dark:text-white">{t('reports.lastMonth')}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{t('reports.lastMonthDate')}</div>
            </button>

            <button
              onClick={() => {
                const lastQuarter = new Date();
                lastQuarter.setMonth(lastQuarter.getMonth() - 3);
                
                setExportOptions(prev => ({
                  ...prev,
                  startDate: lastQuarter.toISOString().split('T')[0],
                  endDate: new Date().toISOString().split('T')[0]
                }));
              }}
              className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-left"
            >
              <div className="font-medium text-gray-900 dark:text-white">{t('reports.lastThreeMonths')}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{t('reports.lastThreeMonthsDate')}</div>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
