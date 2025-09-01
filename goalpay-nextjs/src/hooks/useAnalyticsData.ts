import { useState, useEffect, useMemo, useCallback } from 'react';
import { format, parseISO, startOfYear, endOfYear, subMonths, isWithinInterval } from 'date-fns';

interface Payslip {
  id: string;
  pay_period: string;
  earnings?: {
    gross_salary: number;
    base_salary: number;
    allowances: number;
    overtime_pay: number;
  };
  deductions?: {
    total_deduct: number;
    health_ins: number;
    employ_ins: number;
    income_tax: number;
  };
  payment?: {
    net_pay: number;
  };
  company_id?: string;
}

interface AnalyticsData {
  monthlyData: any[];
  yearlyData: any[];
  deductionBreakdown: any[];
}

interface Stats {
  totalPayslips: number;
  totalGrossSalary: number;
  totalNetPay: number;
  averageGrossSalary: number;
  averageNetPay: number;
  totalDeductions: number;
  averageDeductions: number;
}

interface UseAnalyticsDataProps {
  searchTerm: string;
  dateRange: string;
  selectedCompany: string;
}

export function useAnalyticsData({ searchTerm, dateRange, selectedCompany }: UseAnalyticsDataProps) {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 加載數據
  const loadPayslips = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 這裡應該調用你的 API
      // const data = await PayrollSlip.list("-pay_period");
      const data: Payslip[] = []; // 暫時使用空數組
      setPayslips(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load payslips'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 刷新數據
  const refreshData = useCallback(() => {
    loadPayslips();
  }, [loadPayslips]);

  // 過濾數據
  const filteredData = useMemo(() => {
    if (!payslips.length) return [];

    let filtered = [...payslips];

    // 按公司過濾
    if (selectedCompany !== 'all') {
      filtered = filtered.filter(slip => slip.company_id === selectedCompany);
    }

    // 按日期範圍過濾
    if (dateRange !== 'all') {
      const now = new Date();
      let startDate: Date;
      let endDate: Date;

      switch (dateRange) {
        case '1m':
          startDate = subMonths(now, 1);
          endDate = now;
          break;
        case '3m':
          startDate = subMonths(now, 3);
          endDate = now;
          break;
        case '6m':
          startDate = subMonths(now, 6);
          endDate = now;
          break;
        case '1y':
          startDate = startOfYear(now);
          endDate = endOfYear(now);
          break;
        default:
          startDate = new Date(0);
          endDate = now;
      }

      filtered = filtered.filter(slip => {
        const slipDate = parseISO(slip.pay_period);
        return isWithinInterval(slipDate, { start: startDate, end: endDate });
      });
    }

    // 按搜索詞過濾
    if (searchTerm) {
      filtered = filtered.filter(slip => 
        slip.pay_period.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slip.earnings?.gross_salary.toString().includes(searchTerm) ||
        slip.payment?.net_pay.toString().includes(searchTerm)
      );
    }

    return filtered;
  }, [payslips, selectedCompany, dateRange, searchTerm]);

  // 準備分析數據
  const analyticsData = useMemo((): AnalyticsData => {
    if (!filteredData.length) {
      return { monthlyData: [], yearlyData: [], deductionBreakdown: [] };
    }

    const sortedPayslips = [...filteredData].sort((a, b) => 
      new Date(a.pay_period) - new Date(b.pay_period)
    );

    // 月度數據
    const monthlyData = sortedPayslips.map(slip => ({
      period: format(parseISO(slip.pay_period), "MMM yyyy"),
      month: format(parseISO(slip.pay_period), "yyyy-MM"),
      grossSalary: slip.earnings?.gross_salary || 0,
      deductions: slip.deductions?.total_deduct || 0,
      netPay: slip.payment?.net_pay || 0,
      baseSalary: slip.earnings?.base_salary || 0,
      allowances: slip.earnings?.allowances || 0,
      overtimePay: slip.earnings?.overtime_pay || 0,
      healthIns: slip.deductions?.health_ins || 0,
      employIns: slip.deductions?.employ_ins || 0,
      incomeTax: slip.deductions?.income_tax || 0
    }));

    // 年度聚合
    const yearlyMap: Record<string, any> = {};
    sortedPayslips.forEach(slip => {
      const year = format(parseISO(slip.pay_period), "yyyy");
      if (!yearlyMap[year]) {
        yearlyMap[year] = {
          year,
          totalGross: 0,
          totalDeductions: 0,
          totalNet: 0,
          months: 0
        };
      }
      yearlyMap[year].totalGross += slip.earnings?.gross_salary || 0;
      yearlyMap[year].totalDeductions += slip.deductions?.total_deduct || 0;
      yearlyMap[year].totalNet += slip.payment?.net_pay || 0;
      yearlyMap[year].months += 1;
    });

    const yearlyData = Object.values(yearlyMap).map(year => ({
      ...year,
      avgGross: year.totalGross / year.months,
      avgNet: year.totalNet / year.months
    }));

    // 扣除明細（平均值）
    const totalPayslips = filteredData.length;
    const deductionBreakdown = [
      {
        name: 'Health Insurance',
        value: filteredData.reduce((sum, slip) => sum + (slip.deductions?.health_ins || 0), 0) / totalPayslips,
        color: '#3b82f6'
      },
      {
        name: 'Employment Insurance',
        value: filteredData.reduce((sum, slip) => sum + (slip.deductions?.employ_ins || 0), 0) / totalPayslips,
        color: '#10b981'
      },
      {
        name: 'Income Tax',
        value: filteredData.reduce((sum, slip) => sum + (slip.deductions?.income_tax || 0), 0) / totalPayslips,
        color: '#f59e0b'
      },
      {
        name: 'Other',
        value: filteredData.reduce((sum, slip) => sum + ((slip.deductions?.total_deduct || 0) - 
          (slip.deductions?.health_ins || 0) - (slip.deductions?.employ_ins || 0) - (slip.deductions?.income_tax || 0)), 0) / totalPayslips,
        color: '#ef4444'
      }
    ].filter(item => item.value > 0);

    return { monthlyData, yearlyData, deductionBreakdown };
  }, [filteredData]);

  // 計算統計數據
  const stats = useMemo((): Stats => {
    if (!filteredData.length) {
      return {
        totalPayslips: 0,
        totalGrossSalary: 0,
        totalNetPay: 0,
        averageGrossSalary: 0,
        averageNetPay: 0,
        totalDeductions: 0,
        averageDeductions: 0
      };
    }

    const totalGrossSalary = filteredData.reduce((sum, slip) => sum + (slip.earnings?.gross_salary || 0), 0);
    const totalNetPay = filteredData.reduce((sum, slip) => sum + (slip.payment?.net_pay || 0), 0);
    const totalDeductions = filteredData.reduce((sum, slip) => sum + (slip.deductions?.total_deduct || 0), 0);

    return {
      totalPayslips: filteredData.length,
      totalGrossSalary,
      totalNetPay,
      averageGrossSalary: totalGrossSalary / filteredData.length,
      averageNetPay: totalNetPay / filteredData.length,
      totalDeductions,
      averageDeductions: totalDeductions / filteredData.length
    };
  }, [filteredData]);

  // 初始化加載
  useEffect(() => {
    loadPayslips();
  }, [loadPayslips]);

  return {
    payslips,
    isLoading,
    error,
    refreshData,
    filteredData,
    analyticsData,
    stats
  };
}
