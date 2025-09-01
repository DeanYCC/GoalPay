import { NextRequest, NextResponse } from 'next/server';
import { createPayroll, getUserPayrolls } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

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

    const data = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'companyName', 'employeeNo', 'name', 'daysWorked', 'absentDays',
      'paidLeave', 'unpaidLeave', 'baseSalary', 'allowance', 'grossSalary',
      'deductions', 'insurance', 'incomeTax', 'netPay', 'bankTransfer', 'cash',
      'payrollDate'
    ];

    for (const field of requiredFields) {
      if (!data[field] && data[field] !== 0) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Calculate payment month and year
    const payrollDate = new Date(data.payrollDate);
    const paymentMonth = payrollDate.toISOString().slice(0, 7); // YYYY-MM
    const paymentYear = payrollDate.getFullYear().toString();

    const payroll = await createPayroll({
      ...data,
      userId: payload.userId,
      payrollDate,
      paymentMonth,
      paymentYear,
    });

    return NextResponse.json(
      { 
        message: 'Payroll created successfully',
        payroll 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create payroll error:', error);
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

    const payrolls = await getUserPayrolls(payload.userId);

    return NextResponse.json({ payrolls });
  } catch (error) {
    console.error('Get payrolls error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
