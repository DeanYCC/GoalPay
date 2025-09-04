import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Info } from 'lucide-react';

interface SalaryTerm {
  key: string;
  en: string;
  jp: string;
  zh: string;
  description_en: string;
  description_jp: string;
  description_zh: string;
}

const SALARY_TERMS: SalaryTerm[] = [
  {
    key: 'GROSS_SALARY',
    en: 'Gross Salary',
    jp: '総支給額',
    zh: '總薪資',
    description_en: 'Total salary before deductions',
    description_jp: '控除前の給与総額',
    description_zh: '扣除前的薪資總額'
  },
  {
    key: 'BASE_SALARY',
    en: 'Base Salary',
    jp: '基本給',
    zh: '基本薪資',
    description_en: 'Fixed base amount before allowances',
    description_jp: '手当を含まない基本的な支給額',
    description_zh: '不含津貼的基本薪資'
  },
  {
    key: 'ALLOWANCE',
    en: 'Allowance',
    jp: '手当',
    zh: '津貼',
    description_en: 'Additional pay such as commuting or housing',
    description_jp: '通勤・住宅などの追加支給',
    description_zh: '交通、住房等額外補助'
  },
  {
    key: 'OVERTIME',
    en: 'Overtime Pay',
    jp: '残業代',
    zh: '加班費',
    description_en: 'Payment for hours worked beyond regular time',
    description_jp: '所定労働時間を超えた勤務の支給',
    description_zh: '超過正常工時的報酬'
  },
  {
    key: 'HOLIDAY_WORK',
    en: 'Holiday Work',
    jp: '休日出勤手当',
    zh: '假日出勤津貼',
    description_en: 'Extra pay for working on holidays',
    description_jp: '休日に勤務した場合の追加支給',
    description_zh: '假日上班時的額外報酬'
  },
  {
    key: 'NIGHT_WORK',
    en: 'Midnight Allowance',
    jp: '深夜勤務手当',
    zh: '夜班津貼',
    description_en: 'Extra pay for night shifts',
    description_jp: '深夜時間帯に勤務した場合の追加支給',
    description_zh: '夜班工作額外給付'
  },
  {
    key: 'TAXABLE_GROSS',
    en: 'Taxable Gross Income',
    jp: '課税対象額',
    zh: '課稅總額',
    description_en: 'Amount subject to taxation',
    description_jp: '課税対象となる給与額',
    description_zh: '需課稅的薪資總額'
  },
  {
    key: 'INCOME_TAX',
    en: 'Income Tax',
    jp: '所得税',
    zh: '所得稅',
    description_en: 'Government income tax deduction',
    description_jp: '政府に納める税金',
    description_zh: '政府徵收的稅金'
  },
  {
    key: 'RESIDENT_TAX',
    en: 'Resident Tax',
    jp: '住民税',
    zh: '居民稅',
    description_en: 'Local tax based on residence',
    description_jp: '居住地に基づく地方税',
    description_zh: '依居住地徵收的地方稅'
  },
  {
    key: 'HEALTH_INS',
    en: 'Health Insurance',
    jp: '健康保険',
    zh: '健康保險',
    description_en: 'National health insurance deduction',
    description_jp: '健康保険料の控除',
    description_zh: '全民健保扣款'
  },
  {
    key: 'PENSION_INS',
    en: 'Pension Insurance',
    jp: '厚生年金保険',
    zh: '年金保險',
    description_en: 'Public pension system contribution',
    description_jp: '公的年金制度の拠出金',
    description_zh: '公共年金制度扣款'
  },
  {
    key: 'UNEMPLOY_INS',
    en: 'Unemployment Insurance',
    jp: '雇用保険',
    zh: '失業保険',
    description_en: 'Insurance for unemployment protection',
    description_jp: '失業時の補償のための保険料',
    description_zh: '失業保障保險'
  },
  {
    key: 'CARE_INS',
    en: 'Nursing Care Insurance',
    jp: '介護保険',
    zh: '介護保險',
    description_en: 'Insurance for elderly care',
    description_jp: '高齢者介護のための保険料',
    description_zh: '長照保險扣款'
  },
  {
    key: 'TOTAL_DEDUCT',
    en: 'Total Deductions',
    jp: '控除合計',
    zh: '扣款總額',
    description_en: 'Total of all deductions',
    description_jp: 'すべての控除の合計',
    description_zh: '所有扣款的總額'
  },
  {
    key: 'NET_INCOME',
    en: 'Net Income',
    jp: '差引支給額',
    zh: '實領金額',
    description_en: 'Final take-home pay after deductions',
    description_jp: '控除後に受け取る実際の金額',
    description_zh: '扣除後實際拿到的金額'
  },
  {
    key: 'BANK_TRANSFER',
    en: 'Bank Transfer',
    jp: '振込額',
    zh: '銀行轉帳',
    description_en: 'Salary transferred to employee\'s account',
    description_jp: '銀行口座に振り込まれる金額',
    description_zh: '轉入銀行帳戶的金額'
  },
  {
    key: 'CASH_PAYMENT',
    en: 'Cash Payment',
    jp: '現金支給',
    zh: '現金發放',
    description_en: 'Salary paid in cash',
    description_jp: '現金で支給される給与',
    description_zh: '以現金發放的薪資'
  },
  {
    key: 'YTD_TOTAL',
    en: 'Year-to-Date Total',
    jp: '年累計',
    zh: '年度累計',
    description_en: 'Total salary received in the year',
    description_jp: '年間で累計された給与額',
    description_zh: '一年累計的薪資總額'
  },
  {
    key: 'BONUS',
    en: 'Bonus',
    jp: '賞与',
    zh: '獎金',
    description_en: 'Special payment (e.g., seasonal bonus)',
    description_jp: '季節ごとや特別に支給される金額',
    description_zh: '季節性或特別獎金'
  }
];

interface SalaryTermsProps {
  isOpen: boolean;
  onClose: () => void;
}

const SalaryTerms: React.FC<SalaryTermsProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const getTermName = (term: SalaryTerm) => {
    switch (i18n.language) {
      case 'en': return term.en;
      case 'jp': return term.jp;
      default: return term.zh;
    }
  };

  const getTermDescription = (term: SalaryTerm) => {
    switch (i18n.language) {
      case 'en': return term.description_en;
      case 'jp': return term.description_jp;
      default: return term.description_zh;
    }
  };

  const filteredTerms = SALARY_TERMS.filter(term =>
    term.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.zh.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.jp.toLowerCase().includes(searchTerm.toLowerCase())
  );

    // 根據語言獲取標題和提示文字
  const getTitle = () => {
    switch (i18n.language) {
      case 'en': return 'Salary Terms Guide';
      case 'jp': return '給与項目ガイド';
      default: return '薪資條款說明';
    }
  };

  const getSearchPlaceholder = () => {
    switch (i18n.language) {
      case 'en': return 'Search terms...';
      case 'jp': return '項目を検索...';
      default: return '搜尋條款...';
    }
  };

  const getNoResultsText = () => {
    switch (i18n.language) {
      case 'en': return 'No salary terms found';
      case 'jp': return '該当する給与項目が見つかりません';
      default: return '沒有找到相關的薪資條款';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder={getSearchPlaceholder()}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div className="grid gap-4">
          {filteredTerms.map((term) => (
            <div
              key={term.key}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded">
                      {term.key}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{getTermName(term)}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{getTermDescription(term)}</p>
                </div>
                <Info className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
          ))}
        </div>

        {filteredTerms.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {getNoResultsText()}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalaryTerms;
