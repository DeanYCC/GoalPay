import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { format } from 'date-fns';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExportOptions {
  format: 'pdf' | 'csv';
  includeCharts: boolean;
  includeTables: boolean;
  startDate: string;
  endDate: string;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeCharts: true,
    includeTables: true,
    startDate: format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      if (exportOptions.format === 'pdf') {
        await exportToPDF();
      } else {
        await exportToCSV();
      }
      
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      // TODO: Show error message to user
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.post('/reports/export/pdf', exportOptions, {
      //   responseType: 'blob'
      // });
      
      // Create blob and download
      // const blob = new Blob([response.data], { type: 'application/pdf' });
      // const url = window.URL.createObjectURL(blob);
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = `goalpay-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      // link.click();
      // window.URL.revokeObjectURL(url);
      
      // Mock implementation for now
      console.log('Exporting to PDF with options:', exportOptions);
      alert('PDF export functionality will be implemented with the backend API');
    } catch (error) {
      console.error('PDF export failed:', error);
      throw error;
    }
  };

  const exportToCSV = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/reports/export/csv', {
      //   params: exportOptions,
      //   responseType: 'blob'
      // });
      
      // Create blob and download
      // const blob = new Blob([response.data], { type: 'text/csv' });
      // const url = window.URL.createObjectURL(blob);
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = `goalpay-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      // link.click();
      // window.URL.revokeObjectURL(url);
      
      // Mock implementation for now
      console.log('Exporting to CSV with options:', exportOptions);
      alert('CSV export functionality will be implemented with the backend API');
    } catch (error) {
      console.error('CSV export failed:', error);
      throw error;
    }
  };

  const handleOptionChange = (key: keyof ExportOptions, value: any) => {
    setExportOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('export.title')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('export.format')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleOptionChange('format', 'pdf')}
                className={`p-3 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                  exportOptions.format === 'pdf'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                <FileText className="w-6 h-6" />
                <span className="text-sm font-medium">PDF</span>
              </button>
              <button
                onClick={() => handleOptionChange('format', 'csv')}
                className={`p-3 border rounded-lg flex flex-col items-center space-y2 transition-colors ${
                  exportOptions.format === 'csv'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                <FileSpreadsheet className="w-6 h-6" />
                <span className="text-sm font-medium">CSV</span>
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
              {t('export.content')}
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
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>
              {isExporting ? t('export.exporting') : t('export.export')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
