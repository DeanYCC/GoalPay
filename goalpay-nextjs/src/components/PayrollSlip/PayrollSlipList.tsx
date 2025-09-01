'use client';

import React, { useState, useEffect } from 'react';
import { PayrollSlip, PayrollSlipFilters } from '@/types/payroll';
import { CURRENCIES } from '@/types/settings';

interface PayrollSlipListProps {
  payrollSlips: PayrollSlip[];
  onEdit: (payrollSlip: PayrollSlip) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export default function PayrollSlipList({ 
  payrollSlips, 
  onEdit, 
  onDelete, 
  onRefresh, 
  isLoading = false 
}: PayrollSlipListProps) {
  const [filters, setFilters] = useState<PayrollSlipFilters>({});
  const [sortBy, setSortBy] = useState<string>('pay_period');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleFilterChange = (field: keyof PayrollSlipFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Apply filters and sorting
  const filteredAndSortedSlips = payrollSlips
    .filter(slip => {
      if (filters.company_name && !slip.company_name.toLowerCase().includes(filters.company_name.toLowerCase())) {
        return false;
      }
      if (filters.employee_name && !slip.employee_name.toLowerCase().includes(filters.employee_name.toLowerCase())) {
        return false;
      }
      if (filters.currency && slip.currency !== filters.currency) {
        return false;
      }
      if (filters.min_amount !== undefined && slip.net_pay < filters.min_amount) {
        return false;
      }
      if (filters.max_amount !== undefined && slip.net_pay > filters.max_amount) {
        return false;
      }
      if (filters.pay_period_start && slip.pay_period < filters.pay_period_start) {
        return false;
      }
      if (filters.pay_period_end && slip.pay_period > filters.pay_period_end) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy as keyof PayrollSlip];
      let bValue: any = b[sortBy as keyof PayrollSlip];

      // Handle nested object sorting
      if (sortBy === 'work_record.days_worked') {
        aValue = a.work_record.days_worked;
        bValue = b.work_record.days_worked;
      } else if (sortBy === 'salary_breakdown.gross_salary') {
        aValue = a.salary_breakdown.gross_salary;
        bValue = b.salary_breakdown.gross_salary;
      } else if (sortBy === 'deductions.total_deductions') {
        aValue = a.deductions.total_deductions;
        bValue = b.deductions.total_deductions;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedSlips.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSlips = filteredAndSortedSlips.slice(startIndex, endIndex);

  const formatCurrency = (amount: number, currency: string) => {
    const currencyInfo = CURRENCIES[currency as keyof typeof CURRENCIES];
    if (currencyInfo) {
      return `${currencyInfo.symbol}${amount.toLocaleString()}`;
    }
    return `${currency} ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW');
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">篩選條件</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              公司名稱
            </label>
            <input
              type="text"
              value={filters.company_name || ''}
              onChange={(e) => handleFilterChange('company_name', e.target.value)}
              placeholder="搜尋公司名稱..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              員工姓名
            </label>
            <input
              type="text"
              value={filters.employee_name || ''}
              onChange={(e) => handleFilterChange('employee_name', e.target.value)}
              placeholder="搜尋員工姓名..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              貨幣
            </label>
            <select
              value={filters.currency || ''}
              onChange={(e) => handleFilterChange('currency', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">所有貨幣</option>
              {Object.entries(CURRENCIES).map(([code, { name, symbol }]) => (
                <option key={code} value={code}>
                  {code} - {symbol} {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              薪資期間開始
            </label>
            <input
              type="date"
              value={filters.pay_period_start || ''}
              onChange={(e) => handleFilterChange('pay_period_start', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              薪資期間結束
            </label>
            <input
              type="date"
              value={filters.pay_period_end || ''}
              onChange={(e) => handleFilterChange('pay_period_end', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              薪資範圍
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="最低"
                value={filters.min_amount || ''}
                onChange={(e) => handleFilterChange('min_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="self-center text-gray-500">-</span>
              <input
                type="number"
                placeholder="最高"
                value={filters.max_amount || ''}
                onChange={(e) => handleFilterChange('max_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            清除篩選條件
          </button>
          
          <div className="text-sm text-gray-600">
            共 {filteredAndSortedSlips.length} 筆薪資單
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('company_name')}
                >
                  公司名稱
                  {sortBy === 'company_name' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('employee_name')}
                >
                  員工姓名
                  {sortBy === 'employee_name' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('pay_period')}
                >
                  薪資期間
                  {sortBy === 'pay_period' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('salary_breakdown.gross_salary')}
                >
                  總薪資
                  {sortBy === 'salary_breakdown.gross_salary' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('deductions.total_deductions')}
                >
                  扣除額
                  {sortBy === 'deductions.total_deductions' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('net_pay')}
                >
                  淨薪資
                  {sortBy === 'net_pay' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  貨幣
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    載入中...
                  </td>
                </tr>
              ) : currentSlips.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    沒有找到符合條件的薪資單
                  </td>
                </tr>
              ) : (
                currentSlips.map((slip) => (
                  <tr key={slip.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {slip.company_name}
                        </div>
                        {slip.division && (
                          <div className="text-sm text-gray-500">
                            {slip.division}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {slip.employee_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {slip.employee_no}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(slip.pay_period)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(slip.salary_breakdown.gross_salary, slip.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(slip.deductions.total_deductions, slip.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(slip.net_pay, slip.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {slip.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEdit(slip)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          編輯
                        </button>
                        <button
                          onClick={() => onDelete(slip.id!)}
                          className="text-red-600 hover:text-red-900"
                        >
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一頁
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一頁
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  顯示第 <span className="font-medium">{startIndex + 1}</span> 到{' '}
                  <span className="font-medium">{Math.min(endIndex, filteredAndSortedSlips.length)}</span> 筆，
                  共 <span className="font-medium">{filteredAndSortedSlips.length}</span> 筆結果
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    上一頁
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    下一頁
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
