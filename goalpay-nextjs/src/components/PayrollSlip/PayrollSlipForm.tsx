'use client';

import React, { useState, useEffect } from 'react';
import { PayrollSlip, PayrollSlipCreateRequest } from '@/types/payroll';
import { CURRENCIES } from '@/types/settings';

interface PayrollSlipFormProps {
  initialData?: PayrollSlip;
  onSubmit: (data: PayrollSlipCreateRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function PayrollSlipForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: PayrollSlipFormProps) {
  const [formData, setFormData] = useState<PayrollSlipCreateRequest>({
    company_name: '',
    division: '',
    employee_no: '',
    employee_name: '',
    pay_period: new Date().toISOString().split('T')[0],
    currency: 'JPY',
    work_record: {
      days_worked: 0,
      absent_days: 0,
      paid_leave: 0,
      unpaid_leave: 0,
      overtime_hours: 0,
      holiday_work_hours: 0
    },
    salary_breakdown: {
      base_salary: 0,
      allowance: 0,
      overtime_pay: 0,
      holiday_pay: 0,
      gross_salary: 0
    },
    deductions: {
      insurance: 0,
      income_tax: 0,
      other_deductions: 0,
      total_deductions: 0
    },
    net_pay: 0,
    payment_method: 'bank_transfer',
    bank_transfer_amount: 0,
    cash_amount: 0,
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        company_name: initialData.company_name,
        division: initialData.division || '',
        employee_no: initialData.employee_no,
        employee_name: initialData.employee_name,
        pay_period: initialData.pay_period,
        currency: initialData.currency,
        work_record: { ...initialData.work_record },
        salary_breakdown: { ...initialData.salary_breakdown },
        deductions: { ...initialData.deductions },
        net_pay: initialData.net_pay,
        payment_method: initialData.payment_method,
        bank_transfer_amount: initialData.bank_transfer_amount || 0,
        cash_amount: initialData.cash_amount || 0,
        notes: initialData.notes || ''
      });
    }
  }, [initialData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof PayrollSlipCreateRequest],
        [field]: value
      }
    }));
  };

  const calculateGrossSalary = () => {
    const { base_salary, allowance, overtime_pay, holiday_pay } = formData.salary_breakdown;
    return base_salary + allowance + (overtime_pay || 0) + (holiday_pay || 0);
  };

  const calculateTotalDeductions = () => {
    const { insurance, income_tax, other_deductions } = formData.deductions;
    return insurance + income_tax + (other_deductions || 0);
  };

  const calculateNetPay = () => {
    return calculateGrossSalary() - calculateTotalDeductions();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update calculated fields
    const updatedData = {
      ...formData,
      salary_breakdown: {
        ...formData.salary_breakdown,
        gross_salary: calculateGrossSalary()
      },
      deductions: {
        ...formData.deductions,
        total_deductions: calculateTotalDeductions()
      },
      net_pay: calculateNetPay()
    };

    onSubmit(updatedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">基本資訊</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              公司名稱 *
            </label>
            <input
              type="text"
              value={formData.company_name}
              onChange={(e) => handleInputChange('company_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              部門/分部
            </label>
            <input
              type="text"
              value={formData.division}
              onChange={(e) => handleInputChange('division', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              員工編號 *
            </label>
            <input
              type="text"
              value={formData.employee_no}
              onChange={(e) => handleInputChange('employee_no', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              員工姓名 *
            </label>
            <input
              type="text"
              value={formData.employee_name}
              onChange={(e) => handleInputChange('employee_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              薪資期間 *
            </label>
            <input
              type="date"
              value={formData.pay_period}
              onChange={(e) => handleInputChange('pay_period', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              貨幣 *
            </label>
            <select
              value={formData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {Object.entries(CURRENCIES).map(([code, { name, symbol }]) => (
                <option key={code} value={code}>
                  {code} - {symbol} {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Work Record */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">工作記錄</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              工作天數 *
            </label>
            <input
              type="number"
              min="0"
              value={formData.work_record.days_worked}
              onChange={(e) => handleNestedChange('work_record', 'days_worked', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              缺勤天數 *
            </label>
            <input
              type="number"
              min="0"
              value={formData.work_record.absent_days}
              onChange={(e) => handleNestedChange('work_record', 'absent_days', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              有薪假天數 *
            </label>
            <input
              type="number"
              min="0"
              value={formData.work_record.paid_leave}
              onChange={(e) => handleNestedChange('work_record', 'paid_leave', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              無薪假天數 *
            </label>
            <input
              type="number"
              min="0"
              value={formData.work_record.unpaid_leave}
              onChange={(e) => handleNestedChange('work_record', 'unpaid_leave', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              加班時數
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={formData.work_record.overtime_hours}
              onChange={(e) => handleNestedChange('work_record', 'overtime_hours', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              假日工作時數
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={formData.work_record.holiday_work_hours}
              onChange={(e) => handleNestedChange('work_record', 'holiday_work_hours', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Salary Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">薪資明細</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              基本薪資 *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.salary_breakdown.base_salary}
              onChange={(e) => handleNestedChange('salary_breakdown', 'base_salary', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              津貼 *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.salary_breakdown.allowance}
              onChange={(e) => handleNestedChange('salary_breakdown', 'allowance', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              加班費
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.salary_breakdown.overtime_pay}
              onChange={(e) => handleNestedChange('salary_breakdown', 'overtime_pay', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              假日工作費
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.salary_breakdown.holiday_pay}
              onChange={(e) => handleNestedChange('salary_breakdown', 'holiday_pay', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              總薪資 (自動計算)
            </label>
            <input
              type="number"
              value={calculateGrossSalary()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Deductions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">扣除項目</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              保險費 *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.insurance}
              onChange={(e) => handleNestedChange('deductions', 'insurance', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              所得稅 *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.income_tax}
              onChange={(e) => handleNestedChange('deductions', 'income_tax', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              其他扣除
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.other_deductions}
              onChange={(e) => handleNestedChange('deductions', 'other_deductions', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              總扣除額 (自動計算)
            </label>
            <input
              type="number"
              value={calculateTotalDeductions()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">付款詳情</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              付款方式 *
            </label>
            <select
              value={formData.payment_method}
              onChange={(e) => handleInputChange('payment_method', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="bank_transfer">銀行轉帳</option>
              <option value="cash">現金</option>
              <option value="check">支票</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              淨薪資 (自動計算)
            </label>
            <input
              type="number"
              value={calculateNetPay()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-semibold text-lg"
              readOnly
            />
          </div>

          {formData.payment_method === 'bank_transfer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                銀行轉帳金額
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.bank_transfer_amount}
                onChange={(e) => handleInputChange('bank_transfer_amount', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {formData.payment_method === 'cash' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                現金金額
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.cash_amount}
                onChange={(e) => handleInputChange('cash_amount', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            備註
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="輸入任何額外的備註或說明..."
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '處理中...' : (initialData ? '更新薪資單' : '創建薪資單')}
        </button>
      </div>
    </form>
  );
}
