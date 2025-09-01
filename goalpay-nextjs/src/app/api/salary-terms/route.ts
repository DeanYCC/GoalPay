import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('lang') || 'en';

    const terms = await prisma.salaryTerm.findMany({
      select: {
        key: true,
        en: true,
        jp: true,
        zh: true,
        descriptionEn: true,
        descriptionJp: true,
        descriptionZh: true,
      },
      orderBy: {
        key: 'asc',
      },
    });

    // Transform the data to return only the requested language
    const transformedTerms = terms.map(term => ({
      key: term.key,
      label: term[language as keyof typeof term] as string,
      description: term[`description${language.charAt(0).toUpperCase() + language.slice(1)}` as keyof typeof term] as string,
    }));

    return NextResponse.json({ terms: transformedTerms });
  } catch (error) {
    console.error('Error fetching salary terms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch salary terms' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
