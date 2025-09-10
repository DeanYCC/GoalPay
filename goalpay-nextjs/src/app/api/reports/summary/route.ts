import { NextRequest, NextResponse } from 'next/server';
import { getYearlySummary, getMonthlyBreakdown, getCustomDateRangeSummary } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

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
    const year = searchParams.get('year') || new Date().getFullYear().toString();
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // 如果有自訂日期範圍，使用日期範圍查詢
    if (startDate && endDate) {
      const customSummary = await getCustomDateRangeSummary(payload.userId, startDate, endDate);
      return NextResponse.json(customSummary);
    }

    // 否則使用年度查詢
    const [yearlySummary, monthlyBreakdown] = await Promise.all([
      getYearlySummary(payload.userId, year),
      getMonthlyBreakdown(payload.userId, year),
    ]);

    return NextResponse.json({
      yearlySummary,
      monthlyBreakdown,
      year,
    });
  } catch (error) {
    console.error('Get reports error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
