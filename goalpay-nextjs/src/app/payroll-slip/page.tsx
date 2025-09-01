'use client';

import React, { useState, useEffect } from 'react';
import { PayrollSlip, PayrollSlipCreateRequest } from '@/types/payroll';
import PayrollSlipForm from '@/components/PayrollSlip/PayrollSlipForm';
import PayrollSlipList from '@/components/PayrollSlip/PayrollSlipList';

export default function PayrollSlipPage() {
  const [payrollSlips, setPayrollSlips] = useState<PayrollSlip[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingSlip, setEditingSlip] = useState<PayrollSlip | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch payroll slips on component mount
  useEffect(() => {
    fetchPayrollSlips();
  }, []);

  const fetchPayrollSlips = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/payroll-slip');
      if (response.ok) {
        const data = await response.json();
        setPayrollSlips(data.payroll_slips || []);
      } else {
        console.error('Failed to fetch payroll slips');
      }
    } catch (error) {
      console.error('Error fetching payroll slips:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSlip = async (data: PayrollSlipCreateRequest) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/payroll-slip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setPayrollSlips(prev => [result.payroll_slip, ...prev]);
        setShowForm(false);
        alert('薪資單創建成功！');
      } else {
        const error = await response.json();
        alert(`創建失敗: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating payroll slip:', error);
      alert('創建薪資單時發生錯誤');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSlip = async (data: PayrollSlipCreateRequest) => {
    if (!editingSlip?.id) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/payroll-slip', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, id: editingSlip.id }),
      });

      if (response.ok) {
        const result = await response.json();
        setPayrollSlips(prev => 
          prev.map(slip => 
            slip.id === editingSlip.id ? result.payroll_slip : slip
          )
        );
        setEditingSlip(undefined);
        alert('薪資單更新成功！');
      } else {
        const error = await response.json();
        alert(`更新失敗: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating payroll slip:', error);
      alert('更新薪資單時發生錯誤');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSlip = async (id: string) => {
    if (!confirm('確定要刪除這筆薪資單嗎？此操作無法復原。')) {
      return;
    }

    try {
      const response = await fetch(`/api/payroll-slip?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPayrollSlips(prev => prev.filter(slip => slip.id !== id));
        alert('薪資單刪除成功！');
      } else {
        const error = await response.json();
        alert(`刪除失敗: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting payroll slip:', error);
      alert('刪除薪資單時發生錯誤');
    }
  };

  const handleEditSlip = (slip: PayrollSlip) => {
    setEditingSlip(slip);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingSlip(undefined);
  };

  const handleSubmit = (data: PayrollSlipCreateRequest) => {
    if (editingSlip) {
      handleUpdateSlip(data);
    } else {
      handleCreateSlip(data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">薪資單管理</h1>
              <p className="mt-2 text-gray-600">
                管理員工薪資單，包含工作記錄、薪資明細和扣除項目
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              新增薪資單
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Form Section */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  {editingSlip ? '編輯薪資單' : '新增薪資單'}
                </h2>
              </div>
              <div className="p-6">
                <PayrollSlipForm
                  initialData={editingSlip}
                  onSubmit={handleSubmit}
                  onCancel={handleCancelForm}
                  isLoading={isSubmitting}
                />
              </div>
            </div>
          )}

          {/* List Section */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">薪資單列表</h2>
            </div>
            <div className="p-6">
              <PayrollSlipList
                payrollSlips={payrollSlips}
                onEdit={handleEditSlip}
                onDelete={handleDeleteSlip}
                onRefresh={fetchPayrollSlips}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {payrollSlips.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">總薪資單數</dt>
                      <dd className="text-lg font-medium text-gray-900">{payrollSlips.length}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">總薪資支出</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        ¥{payrollSlips.reduce((sum, slip) => sum + slip.salary_breakdown.gross_salary, 0).toLocaleString()}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">總扣除額</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        ¥{payrollSlips.reduce((sum, slip) => sum + slip.deductions.total_deductions, 0).toLocaleString()}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">平均淨薪資</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        ¥{Math.round(payrollSlips.reduce((sum, slip) => sum + slip.net_pay, 0) / payrollSlips.length).toLocaleString()}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
