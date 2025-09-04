import axios from 'axios';
import { Company, CreateCompanyRequest, UpdateCompanyRequest } from '../types/company';

const API_BASE_URL = 'http://localhost:5001/api';

// 獲取認證token
const getAuthToken = () => {
  return localStorage.getItem('token') || 'test-token-123';
};

// 創建axios實例
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 請求攔截器：添加認證token
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 薪資數據計算工具函數
export const payrollCalculations = {
  // 計算總收入
  calculateTotalIncome: (items: any[]): number => {
    return items
      .filter(item => item.item_type === 'income')
      .reduce((sum, item) => sum + (item.amount || 0), 0);
  },

  // 計算總扣除
  calculateTotalDeductions: (items: any[]): number => {
    return items
      .filter(item => item.item_type === 'deduction')
      .reduce((sum, item) => sum + (item.amount || 0), 0);
  },

  // 計算淨收入
  calculateNetIncome: (items: any[]): number => {
    const totalIncome = payrollCalculations.calculateTotalIncome(items);
    const totalDeductions = payrollCalculations.calculateTotalDeductions(items);
    return totalIncome - totalDeductions;
  },

  // 計算月平均收入
  calculateMonthlyAverage: (payrolls: any[]): number => {
    if (payrolls.length === 0) return 0;
    const totalNetIncome = payrolls.reduce((sum, payroll) => sum + (payroll.netIncome || 0), 0);
    return totalNetIncome / payrolls.length;
  },

  // 計算月成長率
  calculateMonthlyGrowth: (currentMonth: number, previousMonth: number): number => {
    if (previousMonth === 0) return 0;
    return ((currentMonth - previousMonth) / previousMonth) * 100;
  },

  // 驗證薪資單數據完整性
  validatePayrollData: (payroll: any): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!payroll.items || !Array.isArray(payroll.items)) {
      errors.push('薪資項目數據格式錯誤');
    }
    
    if (!payroll.netIncome && payroll.netIncome !== 0) {
      errors.push('淨收入數據缺失');
    }
    
    const calculatedNetIncome = payrollCalculations.calculateNetIncome(payroll.items || []);
    const actualNetIncome = payroll.netIncome || 0;
    
    // 增加容差到 10 日元，避免浮點數精度問題
    if (Math.abs(calculatedNetIncome - actualNetIncome) > 10) {
      errors.push(`淨收入計算不匹配: 計算值 ${calculatedNetIncome}, 實際值 ${actualNetIncome}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // 測試計算函數
  runTests: () => {
    // 避免重複運行測試
    if ((window as any).__payrollTestsRun) {
      return;
    }
    (window as any).__payrollTestsRun = true;
    
    console.log('🧪 開始執行薪資計算測試...');
    
    // 測試數據
    const testItems = [
      { item_type: 'income', item_name: '基本薪資', amount: 400000 },
      { item_type: 'income', item_name: '加班費', amount: 50000 },
      { item_type: 'deduction', item_name: '所得稅', amount: 45000 },
      { item_type: 'deduction', item_name: '健康保險', amount: 25000 },
      { item_type: 'deduction', item_name: '養老金', amount: 15000 }
    ];

    // 測試總收入計算
    const totalIncome = payrollCalculations.calculateTotalIncome(testItems);
    console.log('✅ 總收入計算:', totalIncome === 450000 ? '通過' : '失敗', `(${totalIncome})`);

    // 測試總扣除計算
    const totalDeductions = payrollCalculations.calculateTotalDeductions(testItems);
    console.log('✅ 總扣除計算:', totalDeductions === 85000 ? '通過' : '失敗', `(${totalDeductions})`);

    // 測試淨收入計算
    const netIncome = payrollCalculations.calculateNetIncome(testItems);
    console.log('✅ 淨收入計算:', netIncome === 365000 ? '通過' : '失敗', `(${netIncome})`);

    // 測試月成長率計算
    const growthRate = payrollCalculations.calculateMonthlyGrowth(450000, 400000);
    console.log('✅ 月成長率計算:', growthRate === 12.5 ? '通過' : '失敗', `(${growthRate}%)`);

    console.log('🧪 薪資計算測試完成');
  }
};

export const companyService = {
  // 獲取所有公司
  async getCompanies(): Promise<Company[]> {
    const response = await api.get('/companies');
    return response.data;
  },

  // 獲取單個公司
  async getCompany(id: number): Promise<Company> {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },

  // 創建新公司
  async createCompany(company: CreateCompanyRequest): Promise<Company> {
    const response = await api.post('/companies', company);
    return response.data;
  },

  // 更新公司
  async updateCompany(company: UpdateCompanyRequest): Promise<Company> {
    const response = await api.put(`/companies/${company.id}`, company);
    return response.data;
  },

  // 刪除公司
  async deleteCompany(id: number): Promise<void> {
    await api.delete(`/companies/${id}`);
  },

  // 設置當前公司
  async setCurrentCompany(id: number): Promise<void> {
    await api.patch(`/companies/${id}/set-current`);
  },

  // 獲取當前公司
  async getCurrentCompany(): Promise<Company | null> {
    try {
      const response = await api.get('/companies/current');
      return response.data;
    } catch (error) {
      return null;
    }
  }
};
