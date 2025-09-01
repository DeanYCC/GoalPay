import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getUserPayrolls } from '@/lib/db';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import { promises as fs } from 'fs';

interface PayrollData {
  id: string;
  companyName: string;
  name: string;
  grossSalary: number;
  netPay: number;
  deductions: number;
  insurance: number;
  incomeTax: number;
  payrollDate: Date;
}

interface AutoTableOptions {
  startY: number;
  head: string[][];
  body: string[][];
  theme: string;
}

interface ExtendedJsPDF extends jsPDF {
  lastAutoTable: { finalY: number };
  autoTable: (options: AutoTableOptions) => void;
}

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

    const { format, includeCharts, includeTables, startDate, endDate } = await request.json();

    // Get payroll data
    const payrolls = await getUserPayrolls(payload.userId);
    
    // Filter by date range if provided
    let filteredPayrolls = payrolls;
    if (startDate && endDate) {
      filteredPayrolls = payrolls.filter((payroll: PayrollData) => {
        const payrollDate = new Date(payroll.payrollDate);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return payrollDate >= start && payrollDate <= end;
      });
    }

    if (format === 'pdf') {
      return await generatePDF(filteredPayrolls, includeCharts, includeTables);
    } else if (format === 'csv') {
      return await generateCSV(filteredPayrolls);
    } else {
      return NextResponse.json(
        { error: 'Invalid format. Use "pdf" or "csv"' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function generatePDF(payrolls: PayrollData[], includeCharts: boolean, includeTables: boolean) {
  const doc = new jsPDF() as ExtendedJsPDF;
  
  // Title
  doc.setFontSize(20);
  doc.text('GoalPay Salary Report', 20, 20);
  
  // Date range
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
  
  let yPosition = 50;

  if (includeTables) {
    // Summary table
    const totalSalary = payrolls.reduce((sum, p) => sum + p.grossSalary, 0);
    const totalDeductions = payrolls.reduce((sum, p) => sum + p.deductions + p.insurance + p.incomeTax, 0);
    const netIncome = payrolls.reduce((sum, p) => sum + p.netPay, 0);

    const summaryData = [
      ['Total Payrolls', payrolls.length.toString()],
      ['Total Salary', `¥${totalSalary.toLocaleString()}`],
      ['Total Deductions', `¥${totalDeductions.toLocaleString()}`],
      ['Net Income', `¥${netIncome.toLocaleString()}`]
    ];

    doc.autoTable({
      startY: yPosition,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid'
    });

    yPosition = doc.lastAutoTable.finalY + 20;

    // Payroll details table
    if (payrolls.length > 0) {
      const payrollData = payrolls.map((payroll: PayrollData) => [
        new Date(payroll.payrollDate).toLocaleDateString(),
        payroll.companyName,
        payroll.name,
        `¥${payroll.grossSalary.toLocaleString()}`,
        `¥${payroll.netPay.toLocaleString()}`,
        `¥${(payroll.deductions + payroll.insurance + payroll.incomeTax).toLocaleString()}`
      ]);

      doc.autoTable({
        startY: yPosition,
        head: [['Date', 'Company', 'Name', 'Gross', 'Net', 'Deductions']],
        body: payrollData,
        theme: 'grid'
      });
    }
  }

  // Footer
  doc.setFontSize(10);
  doc.text(`GoalPay - Financial Assistant App`, 20, doc.internal.pageSize.height - 20);

  const pdfBuffer = doc.output('arraybuffer');
  
  return new NextResponse(Buffer.from(pdfBuffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="goalpay-report-${new Date().toISOString().split('T')[0]}.pdf"`
    }
  });
}

async function generateCSV(payrolls: PayrollData[]) {
  const csvWriter = createCsvWriter({
    path: 'temp/goalpay-report.csv',
    header: [
      { id: 'date', title: 'Date' },
      { id: 'companyName', title: 'Company' },
      { id: 'name', title: 'Employee Name' },
      { id: 'grossSalary', title: 'Gross Salary' },
      { id: 'netPay', title: 'Net Pay' },
      { id: 'deductions', title: 'Total Deductions' },
      { id: 'insurance', title: 'Insurance' },
      { id: 'incomeTax', title: 'Income Tax' }
    ]
  });

  const records = payrolls.map((payroll: PayrollData) => ({
    date: new Date(payroll.payrollDate).toLocaleDateString(),
    companyName: payroll.companyName,
    name: payroll.name,
    grossSalary: payroll.grossSalary,
    netPay: payroll.netPay,
    deductions: payroll.deductions,
    insurance: payroll.insurance,
    incomeTax: payroll.incomeTax
  }));

  await csvWriter.writeRecords(records);

  // Read the CSV file and return it
  const csvContent = await fs.readFile('temp/goalpay-report.csv', 'utf8');
  
  // Clean up temp file
  await fs.unlink('temp/goalpay-report.csv');

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="goalpay-report-${new Date().toISOString().split('T')[0]}.csv"`
    }
  });
}
