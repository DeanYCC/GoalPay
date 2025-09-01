import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { PayrollSlipCreateRequest, PayrollSlipUpdateRequest, PayrollSlipFilters } from '@/types/payroll';

// Mock database - 在實際實作中，您需要連接到真實的資料庫
let payrollSlips: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const data: PayrollSlipCreateRequest = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'company_name', 'employee_no', 'employee_name', 'pay_period', 'currency',
      'work_record', 'salary_breakdown', 'deductions', 'net_pay', 'payment_method'
    ];

    for (const field of requiredFields) {
      if (!data[field] && data[field] !== 0) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate work record
    const workRecordFields = ['days_worked', 'absent_days', 'paid_leave', 'unpaid_leave'];
    for (const field of workRecordFields) {
      if (typeof data.work_record[field] !== 'number') {
        return NextResponse.json(
          { error: `work_record.${field} must be a number` },
          { status: 400 }
        );
      }
    }

    // Validate salary breakdown
    const salaryFields = ['base_salary', 'allowance', 'gross_salary'];
    for (const field of salaryFields) {
      if (typeof data.salary_breakdown[field] !== 'number') {
        return NextResponse.json(
          { error: `salary_breakdown.${field} must be a number` },
          { status: 400 }
        );
      }
    }

    // Validate deductions
    const deductionFields = ['insurance', 'income_tax', 'total_deductions'];
    for (const field of deductionFields) {
      if (typeof data.deductions[field] !== 'number') {
        return NextResponse.json(
          { error: `deductions.${field} must be a number` },
          { status: 400 }
        );
      }
    }

    // Create new payroll slip
    const newPayrollSlip = {
      id: `ps_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...data,
      user_id: payload.userId,
      created_at: new Date(),
      updated_at: new Date()
    };

    payrollSlips.push(newPayrollSlip);

    return NextResponse.json(
      { 
        message: 'Payroll slip created successfully',
        payroll_slip: newPayrollSlip 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create payroll slip error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filters: PayrollSlipFilters = {};
    
    // Parse query parameters
    if (searchParams.get('company_name')) filters.company_name = searchParams.get('company_name')!;
    if (searchParams.get('employee_name')) filters.employee_name = searchParams.get('employee_name')!;
    if (searchParams.get('pay_period_start')) filters.pay_period_start = searchParams.get('pay_period_start')!;
    if (searchParams.get('pay_period_end')) filters.pay_period_end = searchParams.get('pay_period_end')!;
    if (searchParams.get('currency')) filters.currency = searchParams.get('currency') as any;
    if (searchParams.get('min_amount')) filters.min_amount = parseFloat(searchParams.get('min_amount')!);
    if (searchParams.get('max_amount')) filters.max_amount = parseFloat(searchParams.get('max_amount')!);

    // Filter payroll slips for the current user
    let userPayrollSlips = payrollSlips.filter(ps => ps.user_id === payload.userId);

    // Apply filters
    if (filters.company_name) {
      userPayrollSlips = userPayrollSlips.filter(ps => 
        ps.company_name.toLowerCase().includes(filters.company_name!.toLowerCase())
      );
    }

    if (filters.employee_name) {
      userPayrollSlips = userPayrollSlips.filter(ps => 
        ps.employee_name.toLowerCase().includes(filters.employee_name!.toLowerCase())
      );
    }

    if (filters.pay_period_start) {
      userPayrollSlips = userPayrollSlips.filter(ps => 
        ps.pay_period >= filters.pay_period_start!
      );
    }

    if (filters.pay_period_end) {
      userPayrollSlips = userPayrollSlips.filter(ps => 
        ps.pay_period <= filters.pay_period_end!
      );
    }

    if (filters.currency) {
      userPayrollSlips = userPayrollSlips.filter(ps => 
        ps.currency === filters.currency
      );
    }

    if (filters.min_amount !== undefined) {
      userPayrollSlips = userPayrollSlips.filter(ps => 
        ps.net_pay >= filters.min_amount!
      );
    }

    if (filters.max_amount !== undefined) {
      userPayrollSlips = userPayrollSlips.filter(ps => 
        ps.net_pay <= filters.max_amount!
      );
    }

    return NextResponse.json({ 
      payroll_slips: userPayrollSlips,
      total: userPayrollSlips.length
    });
  } catch (error) {
    console.error('Get payroll slips error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const data: PayrollSlipUpdateRequest = await request.json();
    
    if (!data.id) {
      return NextResponse.json(
        { error: 'Payroll slip ID is required' },
        { status: 400 }
      );
    }

    // Find and update the payroll slip
    const index = payrollSlips.findIndex(ps => 
      ps.id === data.id && ps.user_id === payload.userId
    );

    if (index === -1) {
      return NextResponse.json(
        { error: 'Payroll slip not found' },
        { status: 404 }
      );
    }

    payrollSlips[index] = {
      ...payrollSlips[index],
      ...data,
      updated_at: new Date()
    };

    return NextResponse.json({
      message: 'Payroll slip updated successfully',
      payroll_slip: payrollSlips[index]
    });
  } catch (error) {
    console.error('Update payroll slip error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Payroll slip ID is required' },
        { status: 400 }
      );
    }

    // Find and delete the payroll slip
    const index = payrollSlips.findIndex(ps => 
      ps.id === id && ps.user_id === payload.userId
    );

    if (index === -1) {
      return NextResponse.json(
        { error: 'Payroll slip not found' },
        { status: 404 }
      );
    }

    const deletedPayrollSlip = payrollSlips.splice(index, 1)[0];

    return NextResponse.json({
      message: 'Payroll slip deleted successfully',
      deleted_payroll_slip: deletedPayrollSlip
    });
  } catch (error) {
    console.error('Delete payroll slip error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
