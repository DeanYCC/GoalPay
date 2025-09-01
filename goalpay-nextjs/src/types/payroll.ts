export interface PayrollSlip {
  id?: string;
  company_name: string;
  division?: string;
  employee_no: string;
  employee_name: string;
  pay_period: string; // YYYY-MM-DD format
  currency: 'JPY' | 'USD' | 'CNY' | 'TWD';
  
  // Work record details
  work_record: {
    days_worked: number;
    absent_days: number;
    paid_leave: number;
    unpaid_leave: number;
    overtime_hours?: number;
    holiday_work_hours?: number;
  };
  
  // Salary breakdown
  salary_breakdown: {
    base_salary: number;
    allowance: number;
    overtime_pay?: number;
    holiday_pay?: number;
    gross_salary: number;
  };
  
  // Deductions
  deductions: {
    insurance: number;
    income_tax: number;
    other_deductions?: number;
    total_deductions: number;
  };
  
  // Final amounts
  net_pay: number;
  payment_method: 'bank_transfer' | 'cash' | 'check';
  bank_transfer_amount?: number;
  cash_amount?: number;
  
  // Additional fields
  notes?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface PayrollSlipCreateRequest {
  company_name: string;
  division?: string;
  employee_no: string;
  employee_name: string;
  pay_period: string;
  currency: 'JPY' | 'USD' | 'CNY' | 'TWD';
  work_record: {
    days_worked: number;
    absent_days: number;
    paid_leave: number;
    unpaid_leave: number;
    overtime_hours?: number;
    holiday_work_hours?: number;
  };
  salary_breakdown: {
    base_salary: number;
    allowance: number;
    overtime_pay?: number;
    holiday_pay?: number;
    gross_salary: number;
  };
  deductions: {
    insurance: number;
    income_tax: number;
    other_deductions?: number;
    total_deductions: number;
  };
  net_pay: number;
  payment_method: 'bank_transfer' | 'cash' | 'check';
  bank_transfer_amount?: number;
  cash_amount?: number;
  notes?: string;
}

export interface PayrollSlipUpdateRequest extends Partial<PayrollSlipCreateRequest> {
  id: string;
}

export interface PayrollSlipFilters {
  company_name?: string;
  employee_name?: string;
  pay_period_start?: string;
  pay_period_end?: string;
  currency?: 'JPY' | 'USD' | 'CNY' | 'TWD';
  min_amount?: number;
  max_amount?: number;
}

export interface PayrollSlipSummary {
  total_count: number;
  total_gross_salary: number;
  total_net_pay: number;
  total_deductions: number;
  average_salary: number;
  currency: string;
}
