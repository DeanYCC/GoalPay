import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface DataFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  dateRange: string;
  onDateRangeChange: (value: string) => void;
  selectedCompany: string;
  onCompanyChange: (value: string) => void;
}

export function DataFilters({
  searchTerm,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  selectedCompany,
  onCompanyChange
}: DataFiltersProps) {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-6 shadow-lg">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Search className="w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search payslips..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <Select value={dateRange} onValueChange={onDateRangeChange}>
            <SelectTrigger className="w-32 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedCompany} onValueChange={onCompanyChange}>
            <SelectTrigger className="w-40 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <SelectValue placeholder="Select Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              {/* 這裡可以動態加載公司列表 */}
              <SelectItem value="company1">Company A</SelectItem>
              <SelectItem value="company2">Company B</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
