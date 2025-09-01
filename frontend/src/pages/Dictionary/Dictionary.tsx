import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Edit, Trash2, BookOpen, Tag } from 'lucide-react';

interface PayrollTerm {
  id: string;
  standardKey: string;
  originalLabelEn: string;
  originalLabelJp: string;
  originalLabelZh: string;
  descriptionEn: string;
  descriptionJp: string;
  descriptionZh: string;
  category: string;
  isCustom: boolean;
}

const Dictionary: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [terms, setTerms] = useState<PayrollTerm[]>([]);
  const [filteredTerms, setFilteredTerms] = useState<PayrollTerm[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { key: 'all', label: t('dictionary.allCategories') },
    { key: 'income', label: t('dictionary.income') },
    { key: 'deduction', label: t('dictionary.deduction') },
    { key: 'tax', label: t('dictionary.tax') },
    { key: 'insurance', label: t('dictionary.insurance') },
    { key: 'other', label: t('dictionary.other') }
  ];

  useEffect(() => {
    fetchTerms();
  }, []);

  useEffect(() => {
    filterTerms();
  }, [terms, searchTerm, selectedCategory]);

  const fetchTerms = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await api.get('/dictionary/terms');
      // setTerms(response.data);
      
      // Mock data for now
      setTerms([
        {
          id: '1',
          standardKey: 'BASIC_SALARY',
          originalLabelEn: 'Basic Salary',
          originalLabelJp: '基本給',
          originalLabelZh: '基本薪資',
          descriptionEn: 'Base salary before deductions',
          descriptionJp: '控除前の基本給',
          descriptionZh: '扣除前的基本薪資',
          category: 'income',
          isCustom: false
        },
        {
          id: '2',
          standardKey: 'INCOME_TAX',
          originalLabelEn: 'Income Tax',
          originalLabelJp: '所得税',
          originalLabelZh: '所得稅',
          descriptionEn: 'Government tax on income',
          descriptionJp: '政府が課す税金',
          descriptionZh: '政府徵收的稅金',
          category: 'tax',
          isCustom: false
        },
        {
          id: '3',
          standardKey: 'HEALTH_INSURANCE',
          originalLabelEn: 'Health Insurance',
          originalLabelJp: '健康保険',
          originalLabelZh: '健康保險',
          descriptionEn: 'National health insurance deduction',
          descriptionJp: '健康保険料の控除',
          descriptionZh: '全民健保扣款',
          category: 'insurance',
          isCustom: false
        }
      ]);
    } catch (error) {
      console.error('Error fetching terms:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTerms = () => {
    let filtered = terms;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(term => term.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(term =>
        term.standardKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.originalLabelEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.originalLabelJp.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.originalLabelZh.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.descriptionEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.descriptionJp.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.descriptionZh.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTerms(filtered);
  };

  const getCurrentLanguageLabel = (term: PayrollTerm) => {
    const lang = i18n.language;
    switch (lang) {
      case 'jp':
        return term.originalLabelJp;
      case 'zh':
        return term.originalLabelZh;
      default:
        return term.originalLabelEn;
    }
  };

  const getCurrentLanguageDescription = (term: PayrollTerm) => {
    const lang = i18n.language;
    switch (lang) {
      case 'jp':
        return term.descriptionJp;
      case 'zh':
        return term.descriptionZh;
      default:
        return term.descriptionEn;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'income':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'deduction':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'tax':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'insurance':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

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
            {t('dictionary.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('dictionary.subtitle')}
          </p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus className="w-5 h-5" />
          <span>{t('dictionary.addTerm')}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('dictionary.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {categories.map(category => (
                <option key={category.key} value={category.key}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTerms.map(term => (
          <div
            key={term.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {getCurrentLanguageLabel(term)}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                  {term.standardKey}
                </p>
              </div>
              <div className="flex space-x-2">
                {term.isCustom && (
                  <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                {term.isCustom && (
                  <button className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Badge */}
            <div className="mb-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(term.category)}`}>
                <Tag className="w-3 h-3 mr-1" />
                {categories.find(c => c.key === term.category)?.label}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
              {getCurrentLanguageDescription(term)}
            </p>

            {/* Language Labels */}
            <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex justify-between">
                <span>EN:</span>
                <span>{term.originalLabelEn}</span>
              </div>
              <div className="flex justify-between">
                <span>JP:</span>
                <span>{term.originalLabelJp}</span>
              </div>
              <div className="flex justify-between">
                <span>ZH:</span>
                <span>{term.originalLabelZh}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTerms.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {t('dictionary.noTermsFound')}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {t('dictionary.noTermsDescription')}
          </p>
        </div>
      )}
    </div>
  );
};

export default Dictionary;
