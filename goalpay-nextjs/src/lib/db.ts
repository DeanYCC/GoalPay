import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PayrollData {
  userId: string;
  companyName: string;
  division?: string;
  employeeNo: string;
  name: string;
  daysWorked: number;
  absentDays: number;
  paidLeave: number;
  unpaidLeave: number;
  baseSalary: number;
  allowance: number;
  grossSalary: number;
  deductions: number;
  insurance: number;
  incomeTax: number;
  netPay: number;
  bankTransfer: number;
  cash: number;
  customFields?: Record<string, string | number | boolean | null>;
  payrollDate: Date;
  paymentMonth: string;
  paymentYear: string;
}

export async function createPayroll(data: PayrollData) {
  return prisma.payroll.create({
    data,
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function getUserPayrolls(userId: string) {
  return prisma.payroll.findMany({
    where: { userId },
    orderBy: { payrollDate: 'desc' },
  });
}

export async function getPayrollById(id: string, userId: string) {
  return prisma.payroll.findFirst({
    where: { id, userId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function updatePayroll(id: string, userId: string, data: Partial<PayrollData>) {
  return prisma.payroll.updateMany({
    where: { id, userId },
    data,
  });
}

export async function deletePayroll(id: string, userId: string) {
  return prisma.payroll.deleteMany({
    where: { id, userId },
  });
}

export async function getYearlySummary(userId: string, year: string) {
  const payrolls = await prisma.payroll.findMany({
    where: { 
      userId,
      paymentYear: year,
    },
  });

  const totalSalary = payrolls.reduce((sum, p) => sum + p.grossSalary, 0);
  const totalDeductions = payrolls.reduce((sum, p) => sum + p.deductions + p.insurance + p.incomeTax, 0);
  const netIncome = payrolls.reduce((sum, p) => sum + p.netPay, 0);

  return {
    totalSalary,
    totalDeductions,
    netIncome,
    count: payrolls.length,
  };
}

export async function getMonthlyBreakdown(userId: string, year: string) {
  const payrolls = await prisma.payroll.findMany({
    where: { 
      userId,
      paymentYear: year,
    },
    orderBy: { paymentMonth: 'asc' },
  });

  const monthlyData = payrolls.reduce((acc, payroll) => {
    const month = payroll.paymentMonth;
    if (!acc[month]) {
      acc[month] = {
        month,
        payment: 0,
        deduction: 0,
        net: 0,
      };
    }
    
    acc[month].payment += payroll.grossSalary;
    acc[month].deduction += payroll.deductions + payroll.insurance + payroll.incomeTax;
    acc[month].net += payroll.netPay;
    
    return acc;
  }, {} as Record<string, { month: string; payment: number; deduction: number; net: number }>);

  return Object.values(monthlyData);
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });
}

export default prisma;
