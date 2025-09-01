export interface Company {
  id: number;
  name: string;
  employeeId: string;
  position: string;
  isCurrent: boolean;
  startDate: string;
  endDate?: string;
  paydayType: 'month_end' | 'custom_day' | 'custom_period';
  customPayday?: number;
  periodStartDay?: number;
  periodEndDay?: number;
  currency: 'JPY' | 'USD' | 'EUR' | 'CNY';
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyRequest {
  name: string;
  employeeId: string;
  position: string;
  isCurrent: boolean;
  startDate: string;
  endDate?: string;
  paydayType: 'month_end' | 'custom_day' | 'custom_period';
  customPayday?: number;
  periodStartDay?: number;
  periodEndDay?: number;
  currency: 'JPY' | 'USD' | 'EUR' | 'CNY';
}

export interface UpdateCompanyRequest extends Partial<CreateCompanyRequest> {
  id: number;
}
