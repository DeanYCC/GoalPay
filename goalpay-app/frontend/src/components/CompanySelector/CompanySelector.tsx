import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { companyService } from '../../services/companyService';
import { Company } from '../../types/company';
import { ChevronDown, Building } from 'lucide-react';

interface CompanySelectorProps {
  selectedCompanyId?: number;
  onCompanyChange: (company: Company) => void;
  placeholder?: string;
  disabled?: boolean;
  showCurrentOnly?: boolean;
}

const CompanySelector: React.FC<CompanySelectorProps> = ({
  selectedCompanyId,
  onCompanyChange,
  placeholder = "選擇公司",
  disabled = false,
  showCurrentOnly = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // 獲取公司列表
  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: companyService.getCompanies
  });

  const filteredCompanies = showCurrentOnly 
    ? companies?.filter(company => company.isCurrent) || []
    : companies || [];

  const selectedCompany = companies.find(company => company.id === selectedCompanyId);

  const handleSelect = (company: Company) => {
    onCompanyChange(company);
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-muted-foreground">
        載入中...
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'
        }`}
      >
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-muted-foreground" />
          <span className={selectedCompany ? 'text-foreground' : 'text-muted-foreground'}>
            {selectedCompany ? selectedCompany.name : placeholder}
          </span>
          {selectedCompany?.isCurrent && (
            <span className="px-2 py-1 text-xs bg-primary text-white rounded-full">
              現職
            </span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {filteredCompanies.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              沒有可選擇的公司
            </div>
          ) : (
            filteredCompanies.map((company) => (
              <button
                key={company.id}
                type="button"
                onClick={() => handleSelect(company)}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-muted ${
                  selectedCompanyId === company.id ? 'bg-primary/10 text-primary' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  <span className="font-medium">{company.name}</span>
                  {company.isCurrent && (
                    <span className="px-2 py-1 text-xs bg-primary text-white rounded-full">
                      現職
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {company.employeeId}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CompanySelector;
