import { NextRequest, NextResponse } from 'next/server';

// Mock data extraction function - in production, this would integrate with Base44 or similar AI service
async function extractPayrollData(fileUrl: string, schema: string) {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock extracted data - in production, this would come from AI analysis
  const mockData = {
    status: "success",
    output: {
      pay_period: new Date().toISOString().slice(0, 7) + '-01',
      currency: 'JPY',
      earnings: {
        baseSalary: 250000,
        allowance: 50000,
        overtime: 15000,
        bonus: 0
      },
      deductions: {
        insurance: 25000,
        incomeTax: 30000,
        pension: 20000,
        total: 75000
      },
      payment: {
        netPay: 240000,
        bankTransfer: 200000,
        cash: 40000
      },
      work_record: {
        daysWorked: 22,
        absentDays: 0,
        paidLeave: 1,
        unpaidLeave: 0
      }
    }
  };

  // Add some randomness to make it feel more realistic
  const randomVariation = (base: number, variance: number) => {
    return Math.round(base + (Math.random() - 0.5) * variance);
  };

  mockData.output.earnings.baseSalary = randomVariation(mockData.output.earnings.baseSalary, 10000);
  mockData.output.earnings.allowance = randomVariation(mockData.output.earnings.allowance, 5000);
  mockData.output.deductions.insurance = randomVariation(mockData.output.deductions.insurance, 5000);
  mockData.output.deductions.incomeTax = randomVariation(mockData.output.deductions.incomeTax, 5000);
  mockData.output.payment.netPay = mockData.output.earnings.baseSalary + mockData.output.earnings.allowance - mockData.output.deductions.total;

  return mockData;
}

export async function POST(request: NextRequest) {
  try {
    const { file_url, json_schema } = await request.json();

    if (!file_url) {
      return NextResponse.json(
        { error: 'File URL is required' },
        { status: 400 }
      );
    }

    if (!json_schema) {
      return NextResponse.json(
        { error: 'JSON schema is required' },
        { status: 400 }
      );
    }

    // Extract data from the uploaded file
    const result = await extractPayrollData(file_url, json_schema);

    if (result.status === "success") {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { error: 'Data extraction failed' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Data extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract data' },
      { status: 500 }
    );
  }
}
