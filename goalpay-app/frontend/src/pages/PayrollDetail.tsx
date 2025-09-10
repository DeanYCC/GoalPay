import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Save, ArrowLeft, Plus, Trash2, Edit, Eye } from 'lucide-react';
import CompanySelector from '../components/CompanySelector/CompanySelector';
import { Company } from '../types/company';
import { API_ENDPOINTS } from '../config/api';

interface PayrollItem {
  id?: number;
  item_type: 'income' | 'deduction';
  item_name: string;
  amount: number;
}

interface PayrollData {
  id: number;
  company: string;
  employeeId: string;
  slipDate: string;
  baseSalary: number;
  overtime: number;
  allowance: number;
  incomeTax: number;
  healthInsurance: number;
  pension: number;
  otherDeductions: number;
  netIncome: number;
  items: PayrollItem[];
}

const PayrollDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(id === 'new');
  const [payrollData, setPayrollData] = useState<PayrollData | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  
  // 根據薪資單的公司名稱找到對應的公司
  useEffect(() => {
    if (payrollData?.company && !selectedCompany) {
      // 這裡應該從公司列表中查找對應的公司
      // 暫時使用模擬數據
      setSelectedCompany({
        id: 1,
        name: payrollData.company,
        employeeId: payrollData.employeeId,
        position: '員工',
        isCurrent: true,
        startDate: '2024-01-01',
        paydayType: 'month_end',
        currency: 'JPY',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      });
    }
  }, [payrollData, selectedCompany]);
  const [newItem, setNewItem] = useState<PayrollItem>({
    item_type: 'income',
    item_name: '',
    amount: 0
  });

  // 獲取薪資詳情
  const { data: initialData, isLoading } = useQuery({
    queryKey: ['payroll', id],
    queryFn: async () => {
      if (id === 'new') {
        // 創建新的薪資單
        return {
          id: Date.now(),
          company: '測試科技公司',
          employeeId: 'EMP001',
          slipDate: new Date().toISOString().split('T')[0],
          baseSalary: 400000,
          overtime: 0,
          allowance: 0,
          incomeTax: 0,
          healthInsurance: 0,
          pension: 0,
          otherDeductions: 0,
          netIncome: 400000,
          items: [
            { id: 1, item_type: 'income', item_name: '基本薪資', amount: 400000 }
          ]
        };
      }
      
      // 獲取現有薪資單
      const response = await axios.get(API_ENDPOINTS.PAYROLL.DETAIL(id));
      return response.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (initialData) {
      setPayrollData(initialData);
    }
  }, [initialData]);

  // 更新薪資單
  const updatePayrollMutation = useMutation({
    mutationFn: async (data: PayrollData) => {
      if (id === 'new') {
        const response = await axios.post(API_ENDPOINTS.PAYROLL.CREATE, data);
        return response.data;
      } else {
        const response = await axios.put(API_ENDPOINTS.PAYROLL.UPDATE(id), data);
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payrolls'] });
      setIsEditing(false);
    },
  });

  // 刪除薪資單
  const deletePayrollMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.delete(API_ENDPOINTS.PAYROLL.DELETE(id));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payrolls'] });
      navigate('/payroll');
    },
  });

  const handleSave = () => {
    if (payrollData) {
      updatePayrollMutation.mutate(payrollData);
    }
  };

  const handleInputChange = (field: keyof PayrollData, value: any) => {
    if (payrollData) {
      setPayrollData({
        ...payrollData,
        [field]: value
      });
    }
  };

  const addItem = () => {
    if (newItem.item_name && newItem.amount > 0 && payrollData) {
      const item: PayrollItem = {
        id: Date.now(),
        ...newItem
      };
      
      setPayrollData({
        ...payrollData,
        items: [...(payrollData.items || []), item]
      });
      
      setNewItem({
        item_type: 'income',
        item_name: '',
        amount: 0
      });
    }
  };

  const removeItem = (itemId: number) => {
    if (payrollData && payrollData.items) {
      setPayrollData({
        ...payrollData,
        items: payrollData.items?.filter(item => item.id !== itemId) || []
      });
    }
  };

  const calculateNetIncome = () => {
    if (!payrollData || !payrollData.items) return 0;
    
    const totalIncome = payrollData.items
      ?.filter(item => item.item_type === 'income')
      ?.reduce((sum, item) => sum + item.amount, 0) || 0;
    
    const totalDeductions = payrollData.items
      ?.filter(item => item.item_type === 'deduction')
      ?.reduce((sum, item) => sum + item.amount, 0) || 0;
    
    return totalIncome - totalDeductions;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!payrollData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">薪資單不存在</p>
        </div>
      </div>
    );
  }

  const netIncome = calculateNetIncome();

  return (
    <div className="p-6 space-y-6">
      {/* 頁面標題 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {id === 'new' ? t('payroll.addNewPayslip') : t('payroll.payslipDetails')}
        </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {isEditing ? '編輯模式' : '查看模式'}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                編輯
              </button>
              <button
                onClick={() => {
                  if (window.confirm('確定要刪除這筆薪資單嗎？此操作無法復原。')) {
                    deletePayrollMutation.mutate();
                  }
                }}
                disabled={deletePayrollMutation.isLoading}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                刪除
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={updatePayrollMutation.isLoading}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {updatePayrollMutation.isLoading ? '儲存中...' : '儲存'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* 基本資訊 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            公司名稱
          </label>
          {isEditing ? (
            <CompanySelector
              selectedCompanyId={selectedCompany?.id}
              onCompanyChange={(company) => {
                setSelectedCompany(company);
                handleInputChange('company', company.name);
                handleInputChange('employeeId', company.employeeId);
              }}
              placeholder={t('payroll.selectCompany')}
            />
          ) : (
            <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
              {payrollData.company}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            員工編號
          </label>
          <input
            type="text"
            value={payrollData.employeeId}
            onChange={(e) => handleInputChange('employeeId', e.target.value)}
            disabled={!isEditing || !!selectedCompany}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            薪資單日期
          </label>
          <input
            type="date"
            value={payrollData.slipDate}
            onChange={(e) => handleInputChange('slipDate', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            淨收入
          </label>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            ¥{netIncome.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 工作區間資訊 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          工作區間
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              發薪日期
            </label>
            <div className="text-lg font-medium text-gray-900 dark:text-white">
              {new Date(payrollData.slipDate).toLocaleDateString('zh-TW')}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              對應工作區間
            </label>
            <div className="text-lg font-medium text-gray-900 dark:text-white">
              {(() => {
                const slipDate = new Date(payrollData.slipDate);
                const year = slipDate.getFullYear();
                const month = slipDate.getMonth() + 1;
                const startDate = new Date(year, month - 1, 1);
                const endDate = new Date(year, month, 0);
                return `${startDate.getFullYear()}/${startDate.getMonth() + 1}/${startDate.getDate()} - ${endDate.getFullYear()}/${endDate.getMonth() + 1}/${endDate.getDate()}`;
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* 薪資項目 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            薪資項目
          </h3>
          {isEditing && (
            <button
              onClick={addItem}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('payroll.addItem')}
            </button>
          )}
        </div>

        {/* 新增項目表單 */}
        {isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('payroll.type')}
              </label>
              <select
                value={newItem.item_type}
                onChange={(e) => setNewItem({ ...newItem, item_type: e.target.value as 'income' | 'deduction' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                                    <option value="income">{t('payroll.income')}</option>
                    <option value="deduction">{t('payroll.deduction')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('payroll.itemName')}
              </label>
              <input
                type="text"
                value={newItem.item_name}
                onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                  placeholder={t('payroll.itemName')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('payroll.amount')}
              </label>
              <input
                type="number"
                value={newItem.amount}
                onChange={(e) => setNewItem({ ...newItem, amount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="0"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={addItem}
                className="w-full px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                {t('common.add')}
              </button>
            </div>
          </div>
        )}

        {/* 項目列表 */}
        <div className="space-y-4">
          {payrollData.items && payrollData.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.item_type === 'income' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {item.item_type === 'income' ? t('payroll.income') : t('payroll.deduction')}
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {item.item_name}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`text-lg font-bold ${
                  item.item_type === 'income' 
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {item.item_type === 'income' ? '+' : '-'}¥{item.amount.toLocaleString()}
                </span>
                {isEditing && (
                  <button
                    onClick={() => removeItem(item.id!)}
                    className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 總結 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('payroll.salarySummary')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('payroll.totalIncome')}</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ¥{(payrollData.items || [])
                ?.filter(item => item.item_type === 'income')
                ?.reduce((sum, item) => sum + item.amount, 0)
                ?.toLocaleString() || '0'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('payroll.totalDeductions')}</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              ¥{(payrollData.items || [])
                ?.filter(item => item.item_type === 'deduction')
                ?.reduce((sum, item) => sum + item.amount, 0)
                ?.toLocaleString() || '0'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('payroll.netIncome')}</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ¥{netIncome.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollDetail;
