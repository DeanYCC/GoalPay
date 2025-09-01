export interface PayrollItem {
  id?: number;
  item_type: 'income' | 'deduction';
  item_name: string;
  amount: number;
}

export interface PayrollItemTemplate {
  id: string;
  name: {
    zh: string;
    en: string;
    jp: string;
  };
  type: 'income' | 'deduction';
  category: {
    zh: string;
    en: string;
    jp: string;
  };
  isDefault: boolean;
  isCustom: boolean;
  description: {
    zh: string;
    en: string;
    jp: string;
  };
  key?: string; // 對應英文薪資單的key
}

// 預設的薪資項目模板
export const DEFAULT_PAYROLL_ITEMS: PayrollItemTemplate[] = [
  // 基本收入項目
  { 
    id: 'gross_salary', 
    name: {
      zh: '總薪資',
      en: 'Gross Salary',
      jp: '総支給額'
    },
    type: 'income', 
    category: {
      zh: '基本收入',
      en: 'Basic Income',
      jp: '基本収入'
    },
    isDefault: true, 
    isCustom: false,
    key: 'GROSS_SALARY',
    description: {
      zh: '扣除前的薪資總額',
      en: 'Total salary before deductions',
      jp: '控除前の給与総額'
    }
  },
  { 
    id: 'base_salary', 
    name: {
      zh: '基本薪資',
      en: 'Base Salary',
      jp: '基本給'
    },
    type: 'income', 
    category: {
      zh: '基本收入',
      en: 'Basic Income',
      jp: '基本収入'
    },
    isDefault: true, 
    isCustom: false,
    key: 'BASE_SALARY',
    description: {
      zh: '不含津貼的基本薪資',
      en: 'Fixed base amount before allowances',
      jp: '手当を含まない基本的な支給額'
    }
  },
  { 
    id: 'allowance', 
    name: {
      zh: '津貼',
      en: 'Allowance',
      jp: '手当'
    },
    type: 'income', 
    category: {
      zh: '基本收入',
      en: 'Basic Income',
      jp: '基本収入'
    },
    isDefault: true, 
    isCustom: false,
    key: 'ALLOWANCE',
    description: {
      zh: '交通、住房等額外補助',
      en: 'Additional pay such as commuting or housing',
      jp: '通勤・住宅などの追加支給'
    }
  },
  { 
    id: 'overtime', 
    name: {
      zh: '加班費',
      en: 'Overtime Pay',
      jp: '残業手当'
    },
    type: 'income', 
    category: {
      zh: '加班收入',
      en: 'Overtime Income',
      jp: '残業収入'
    },
    isDefault: true, 
    isCustom: false,
    key: 'OVERTIME',
    description: {
      zh: '超過正常工時的報酬',
      en: 'Payment for hours worked beyond regular time',
      jp: '所定労働時間を超えた勤務の支給'
    }
  },
  { 
    id: 'holiday_work', 
    name: {
      zh: '假日出勤津貼',
      en: 'Holiday Work Allowance',
      jp: '休日出勤手当'
    },
    type: 'income', 
    category: {
      zh: '加班收入',
      en: 'Overtime Income',
      jp: '残業収入'
    },
    isDefault: false, 
    isCustom: false,
    key: 'HOLIDAY_WORK',
    description: {
      zh: '假日上班時的額外報酬',
      en: 'Extra pay for working on holidays',
      jp: '休日に勤務した場合の追加支給'
    }
  },
  { 
    id: 'night_work', 
    name: {
      zh: '夜班津貼',
      en: 'Night Work Allowance',
      jp: '夜勤手当'
    },
    type: 'income', 
    category: {
      zh: '加班收入',
      en: 'Overtime Income',
      jp: '残業収入'
    }, 
    isDefault: false, 
    isCustom: false,
    key: 'NIGHT_WORK',
    description: {
      zh: '夜班工作額外給付',
      en: 'Extra pay for night shifts',
      jp: '深夜時間帯に勤務した場合の追加支給'
    }
  },
  { 
    id: 'bonus', 
    name: {
      zh: '獎金',
      en: 'Bonus',
      jp: 'ボーナス'
    },
    type: 'income', 
    category: {
      zh: '獎勵收入',
      en: 'Bonus Income',
      jp: 'ボーナス収入'
    },
    isDefault: true, 
    isCustom: false,
    key: 'BONUS',
    description: {
      zh: '季節性或特別獎金',
      en: 'Special payment (e.g., seasonal bonus)',
      jp: '季節ごとや特別に支給される金額'
    }
  },
  
  // 扣除項目
  { 
    id: 'income_tax', 
    name: {
      zh: '所得稅',
      en: 'Income Tax',
      jp: '所得税'
    },
    type: 'deduction', 
    category: {
      zh: '稅金',
      en: 'Tax',
      jp: '税金'
    },
    isDefault: true, 
    isCustom: false,
    key: 'INCOME_TAX',
    description: {
      zh: '政府徵收的稅金',
      en: 'Government income tax deduction',
      jp: '政府に納める税金'
    }
  },
  { 
    id: 'resident_tax', 
    name: {
      zh: '居民稅',
      en: 'Resident Tax',
      jp: '住民税'
    },
    type: 'deduction', 
    category: {
      zh: '稅金',
      en: 'Tax',
      jp: '税金'
    },
    isDefault: false, 
    isCustom: false,
    key: 'RESIDENT_TAX',
    description: {
      zh: '依居住地徵收的地方稅',
      en: 'Local tax based on residence',
      jp: '居住地に基づく地方税'
    }
  },
  { 
    id: 'health_insurance', 
    name: {
      zh: '健康保險',
      en: 'Health Insurance',
      jp: '健康保険'
    },
    type: 'deduction', 
    category: {
      zh: '社會保險',
      en: 'Social Insurance',
      jp: '社会保険'
    },
    isDefault: true, 
    isCustom: false,
    key: 'HEALTH_INS',
    description: {
      zh: '全民健保扣款',
      en: 'National health insurance deduction',
      jp: '健康保険料の控除'
    }
  },
  { 
    id: 'pension_insurance', 
    name: {
      zh: '年金保險',
      en: 'Pension Insurance',
      jp: '年金保険'
    },
    type: 'deduction', 
    category: {
      zh: '社會保險',
      en: 'Social Insurance',
      jp: '社会保険'
    },
    isDefault: true, 
    isCustom: false,
    key: 'PENSION_INS',
    description: {
      zh: '公共年金制度扣款',
      en: 'Public pension system contribution',
      jp: '公的年金制度の拠出金'
    }
  },
  { 
    id: 'unemployment_insurance', 
    name: {
      zh: '失業保險',
      en: 'Unemployment Insurance',
      jp: '失業保険'
    },
    type: 'deduction', 
    category: {
      zh: '社會保險',
      en: 'Social Insurance',
      jp: '社会保険'
    },
    isDefault: false, 
    isCustom: false,
    key: 'UNEMPLOY_INS',
    description: {
      zh: '失業保障保險',
      en: 'Insurance for unemployment protection',
      jp: '失業時の補償のための保険料'
    }
  },
  { 
    id: 'care_insurance', 
    name: {
      zh: '介護保險',
      en: 'Care Insurance',
      jp: '介護保険'
    },
    type: 'deduction', 
    category: {
      zh: '社會保險',
      en: 'Social Insurance',
      jp: '社会保険'
    },
    isDefault: false, 
    isCustom: false,
    key: 'CARE_INS',
    description: {
      zh: '長照保險扣款',
      en: 'Insurance for elderly care',
      jp: '高齢者介護のための保険料'
    }
  },
  { 
    id: 'union_fee', 
    name: {
      zh: '工會費',
      en: 'Union Fee',
      jp: '組合費'
    },
    type: 'deduction', 
    category: {
      zh: '其他扣除',
      en: 'Other Deductions',
      jp: 'その他の控除'
    },
    isDefault: false, 
    isCustom: false,
    description: {
      zh: '工會會員費',
      en: 'Union membership fee',
      jp: '労働組合の会費'
    }
  },
  { 
    id: 'loan_repayment', 
    name: {
      zh: '貸款還款',
      en: 'Loan Repayment',
      jp: '借入金返済'
    },
    type: 'deduction', 
    category: {
      zh: '其他扣除',
      en: 'Other Deductions',
      jp: 'その他の控除'
    },
    isDefault: false, 
    isCustom: false,
    description: {
      zh: '公司貸款還款',
      en: 'Company loan repayment',
      jp: '会社からの借入金の返済'
    }
  },
];

export const getDefaultItems = (): PayrollItem[] => {
  return DEFAULT_PAYROLL_ITEMS
    .filter(item => item.isDefault)
    .map(item => ({
      item_type: item.type,
      item_name: typeof item.name === 'string' ? item.name : item.name.zh, // 向後兼容
      amount: 0
    }));
}

export const getItemName = (item: PayrollItemTemplate, language: string = 'zh'): string => {
  if (typeof item.name === 'string') {
    return item.name // 向後兼容
  }
  return item.name[language as keyof typeof item.name] || item.name.zh
}

export const getItemCategory = (item: PayrollItemTemplate, language: string = 'zh'): string => {
  if (typeof item.category === 'string') {
    return item.category // 向後兼容
  }
  return item.category[language as keyof typeof item.category] || item.category.zh
};

export const getItemTemplates = (type?: 'income' | 'deduction'): PayrollItemTemplate[] => {
  if (type) {
    return DEFAULT_PAYROLL_ITEMS.filter(item => item.type === type);
  }
  return DEFAULT_PAYROLL_ITEMS;
};

export const getItemByKey = (key: string): PayrollItemTemplate | undefined => {
  return DEFAULT_PAYROLL_ITEMS.find(item => item.key === key);
};
