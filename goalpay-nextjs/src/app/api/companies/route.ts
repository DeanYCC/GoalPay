import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { CreateCompanyRequest } from '@/types/company';

// GET /api/companies - Get user's companies
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const companies = await prisma.company.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ companies });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/companies - Create new company
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const companyData: CreateCompanyRequest = await request.json();

    if (!companyData.name || !companyData.startDate) {
      return NextResponse.json(
        { error: 'Company name and start date are required' },
        { status: 400 }
      );
    }

    const company = await prisma.company.create({
      data: {
        userId: payload.userId,
        name: companyData.name,
        industry: companyData.industry,
        employee_count: companyData.employee_count,
        location: companyData.location,
        default_currency: companyData.default_currency || "JPY",
        startDate: new Date(companyData.startDate),
        endDate: companyData.endDate ? new Date(companyData.endDate) : null,
        position: companyData.position,
      },
    });

    return NextResponse.json({ company }, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
