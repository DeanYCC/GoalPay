export interface Company {
  id: string;
  userId: string;
  name: string;
  industry?: string;
  employee_count?: CompanySize;
  location?: string;
  default_currency: Currency;
  startDate: Date;
  endDate?: Date;
  position?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CompanySize = 
  | "1-10"
  | "11-50" 
  | "51-200"
  | "201-500"
  | "501-1000"
  | "1000+";

export type Currency = "JPY" | "USD" | "CNY" | "TWD";

export interface CreateCompanyRequest {
  name: string;
  industry?: string;
  employee_count?: CompanySize;
  location?: string;
  default_currency?: Currency;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  position?: string;
}

export interface UpdateCompanyRequest extends Partial<CreateCompanyRequest> {
  isActive?: boolean;
}

// Base44-style schema definition
export const CompanySchema = {
  name: "Company",
  type: "object",
  properties: {
    company_name: {
      type: "string",
      description: "Company name"
    },
    industry: {
      type: "string",
      description: "Industry sector"
    },
    employee_count: {
      type: "string",
      enum: [
        "1-10",
        "11-50", 
        "51-200",
        "201-500",
        "501-1000",
        "1000+"
      ],
      description: "Company size"
    },
    location: {
      type: "string",
      description: "Company location"
    },
    default_currency: {
      type: "string",
      enum: [
        "JPY",
        "USD", 
        "CNY",
        "TWD"
      ],
      default: "JPY",
      description: "Default currency"
    },
    start_date: {
      type: "string",
      format: "date",
      description: "Employment start date"
    },
    end_date: {
      type: "string", 
      format: "date",
      description: "Employment end date (optional)"
    },
    position: {
      type: "string",
      description: "Job position/title"
    }
  },
  required: ["company_name", "start_date"]
} as const;
