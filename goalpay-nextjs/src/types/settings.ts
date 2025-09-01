export interface UserSettings {
  id?: string;
  language: string;
  theme: 'light' | 'dark';
  default_currency: string;
  date_format: string;
  notifications_enabled?: boolean;
  email_notifications?: boolean;
  timezone?: string;
}

export interface Company {
  id?: string;
  company_name: string;
  industry: string;
  location: string;
  employee_count: string;
  website?: string;
  phone?: string;
  founded_year?: number;
}

export interface SettingsFormData {
  userSettings: UserSettings;
  company: Company;
}

export interface SettingsValidationErrors {
  company_name?: string;
  industry?: string;
  location?: string;
  [key: string]: string | undefined;
}

export type Currency = 'JPY' | 'USD' | 'CNY' | 'TWD' | 'EUR' | 'GBP';
export type Language = 'zh' | 'jp' | 'en';
export type DateFormat = 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY';
export type Theme = 'light' | 'dark' | 'system';

export const CURRENCIES: Record<Currency, { name: string; symbol: string }> = {
  JPY: { name: 'Japanese Yen', symbol: '¥' },
  USD: { name: 'US Dollar', symbol: '$' },
  CNY: { name: 'Chinese Yuan', symbol: '¥' },
  TWD: { name: 'Taiwan Dollar', symbol: 'NT$' },
  EUR: { name: 'Euro', symbol: '€' },
  GBP: { name: 'British Pound', symbol: '£' }
};

export const LANGUAGES: Record<Language, { name: string; native: string }> = {
  'zh': { name: 'Traditional Chinese', native: '繁體中文' },
  'jp': { name: 'Japanese', native: '日本語' },
  'en': { name: 'English', native: 'English' }
};

export const DATE_FORMATS: Record<DateFormat, string> = {
  'YYYY-MM-DD': 'YYYY-MM-DD (ISO)',
  'DD/MM/YYYY': 'DD/MM/YYYY (European)',
  'MM/DD/YYYY': 'MM/DD/YYYY (US)'
};

export const COMPANY_SIZES = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1000+', label: '1000+ employees' }
];

export const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Manufacturing',
  'Retail',
  'Consulting',
  'Media',
  'Real Estate',
  'Transportation',
  'Energy',
  'Other'
];
