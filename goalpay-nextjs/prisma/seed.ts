import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const salaryTerms = [
  {
    key: 'GROSS_SALARY',
    en: 'Gross Salary',
    jp: '総支給額',
    zh: '總薪資',
    descriptionEn: 'Total salary before deductions',
    descriptionJp: '控除前の給与総額',
    descriptionZh: '扣除前的薪資總額',
  },
  {
    key: 'BASE_SALARY',
    en: 'Base Salary',
    jp: '基本給',
    zh: '基本薪資',
    descriptionEn: 'Fixed base amount before allowances',
    descriptionJp: '手当を含まない基本的な支給額',
    descriptionZh: '不含津貼的基本薪資',
  },
  {
    key: 'ALLOWANCE',
    en: 'Allowance',
    jp: '手当',
    zh: '津貼',
    descriptionEn: 'Additional pay such as commuting or housing',
    descriptionJp: '通勤・住宅などの追加支給',
    descriptionZh: '交通、住房等額外補助',
  },
  {
    key: 'OVERTIME',
    en: 'Overtime Pay',
    jp: '残業代',
    zh: '加班費',
    descriptionEn: 'Payment for hours worked beyond regular time',
    descriptionJp: '所定労働時間を超えた勤務の支給',
    descriptionZh: '超過正常工時的報酬',
  },
  {
    key: 'HOLIDAY_WORK',
    en: 'Holiday Work',
    jp: '休日出勤手当',
    zh: '假日出勤津貼',
    descriptionEn: 'Extra pay for working on holidays',
    descriptionJp: '休日に勤務した場合の追加支給',
    descriptionZh: '假日上班時的額外報酬',
  },
  {
    key: 'NIGHT_WORK',
    en: 'Midnight Allowance',
    jp: '深夜勤務手当',
    zh: '夜班津貼',
    descriptionEn: 'Extra pay for night shifts',
    descriptionJp: '深夜時間帯に勤務した場合の追加支給',
    descriptionZh: '夜班工作額外給付',
  },
  {
    key: 'TAXABLE_GROSS',
    en: 'Taxable Gross Income',
    jp: '課税対象額',
    zh: '課稅總額',
    descriptionEn: 'Amount subject to taxation',
    descriptionJp: '課税対象となる給与額',
    descriptionZh: '需課稅的薪資總額',
  },
  {
    key: 'INCOME_TAX',
    en: 'Income Tax',
    jp: '所得税',
    zh: '所得稅',
    descriptionEn: 'Government income tax deduction',
    descriptionJp: '政府に納める税金',
    descriptionZh: '政府徵收的稅金',
  },
  {
    key: 'RESIDENT_TAX',
    en: 'Resident Tax',
    jp: '住民税',
    zh: '居民稅',
    descriptionEn: 'Local tax based on residence',
    descriptionJp: '居住地に基づく地方税',
    descriptionZh: '依居住地徵收的地方稅',
  },
  {
    key: 'HEALTH_INS',
    en: 'Health Insurance',
    jp: '健康保険',
    zh: '健康保險',
    descriptionEn: 'National health insurance deduction',
    descriptionJp: '健康保険料の控除',
    descriptionZh: '全民健保扣款',
  },
  {
    key: 'PENSION_INS',
    en: 'Pension Insurance',
    jp: '厚生年金保険',
    zh: '年金保險',
    descriptionEn: 'Public pension system contribution',
    descriptionJp: '公的年金制度の拠出金',
    descriptionZh: '公共年金制度扣款',
  },
  {
    key: 'UNEMPLOY_INS',
    en: 'Unemployment Insurance',
    jp: '雇用保険',
    zh: '失業保險',
    descriptionEn: 'Insurance for unemployment protection',
    descriptionJp: '失業時の補償のための保険料',
    descriptionZh: '失業保障保險',
  },
  {
    key: 'CARE_INS',
    en: 'Nursing Care Insurance',
    jp: '介護保険',
    zh: '介護保險',
    descriptionEn: 'Insurance for elderly care',
    descriptionJp: '高齢者介護のための保険料',
    descriptionZh: '長照保險扣款',
  },
  {
    key: 'TOTAL_DEDUCT',
    en: 'Total Deductions',
    jp: '控除合計',
    zh: '扣款總額',
    descriptionEn: 'Total of all deductions',
    descriptionJp: 'すべての控除の合計',
    descriptionZh: '所有扣款的總額',
  },
  {
    key: 'NET_INCOME',
    en: 'Net Income',
    jp: '差引支給額',
    zh: '實領金額',
    descriptionEn: 'Final take-home pay after deductions',
    descriptionJp: '控除後に受け取る実際の金額',
    descriptionZh: '扣除後實際拿到的金額',
  },
  {
    key: 'BANK_TRANSFER',
    en: 'Bank Transfer',
    jp: '振込額',
    zh: '銀行轉帳',
    descriptionEn: 'Salary transferred to employee\'s account',
    descriptionJp: '銀行口座に振り込まれる金額',
    descriptionZh: '轉入銀行帳戶的金額',
  },
  {
    key: 'CASH_PAYMENT',
    en: 'Cash Payment',
    jp: '現金支給',
    zh: '現金發放',
    descriptionEn: 'Salary paid in cash',
    descriptionJp: '現金で支給される給与',
    descriptionZh: '以現金發放的薪資',
  },
  {
    key: 'YTD_TOTAL',
    en: 'Year-to-Date Total',
    jp: '年累計',
    zh: '年度累計',
    descriptionEn: 'Total salary received in the year',
    descriptionJp: '年間で累計された給与額',
    descriptionZh: '一年累計的薪資總額',
  },
  {
    key: 'BONUS',
    en: 'Bonus',
    jp: '賞与',
    zh: '獎金',
    descriptionEn: 'Special payment (e.g., seasonal bonus)',
    descriptionJp: '季節ごとや特別に支給される金額',
    descriptionZh: '季節性或特別獎金',
  },
];

async function main() {
  console.log('Start seeding...');
  
  // Create test user
  console.log('Creating test user...');
  const hashedPassword = await bcrypt.hash('test123', 10);
  
  const testUser = await prisma.user.upsert({
    where: { email: 'test@goalpay.com' },
    update: {},
    create: {
      email: 'test@goalpay.com',
      password: hashedPassword,
      name: 'Test User',
    },
  });
  
  console.log('Test user created:', testUser.email);
  
  // Seed salary terms
  console.log('Start seeding salary terms...');
  
  for (const term of salaryTerms) {
    await prisma.salaryTerm.upsert({
      where: { key: term.key },
      update: term,
      create: term,
    });
  }
  
  console.log('Seeding completed!');
  console.log('Test account: test@goalpay.com / test123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
