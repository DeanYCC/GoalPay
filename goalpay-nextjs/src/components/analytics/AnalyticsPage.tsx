import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, Download, Calendar, Search, Filter } from "lucide-react";
import { format, parseISO, startOfYear, endOfYear, subMonths } from "date-fns";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { SalaryChart } from "./SalaryChart";
import { DeductionPieChart } from "./DeductionPieChart";
import { YearlyComparisonChart } from "./YearlyComparisonChart";
import { TrendsChart } from "./TrendsChart";
import { BreakdownChart } from "./BreakdownChart";
import { AnalyticsStats } from "./AnalyticsStats";
import { DataFilters } from "./DataFilters";

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('1y');
  const [selectedView, setSelectedView] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('all');

  const {
    payslips,
    isLoading,
    error,
    refreshData,
    filteredData,
    analyticsData,
    stats
  } = useAnalyticsData({
    searchTerm,
    dateRange,
    selectedCompany
  });

  const handleExport = useCallback(async () => {
    try {
      // 實現導出邏輯
      console.log('Exporting data...');
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, []);

  if (error) {
    return (
      <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-red-200 dark:border-red-700">
            <CardContent className="p-8 text-center">
              <div className="text-red-500 mb-4">
                <BarChart3 className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-2">
                Error Loading Analytics
              </h3>
              <p className="text-red-600 dark:text-red-300 mb-4">
                {error.message || 'Failed to load analytics data'}
              </p>
              <Button onClick={refreshData} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics</h1>
              <p className="text-slate-600 dark:text-slate-400">
                Detailed insights into your payroll data
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Tabs value={selectedView} onValueChange={setSelectedView}>
              <TabsList className="bg-white dark:bg-slate-800">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button 
              onClick={handleExport}
              variant="outline" 
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
              disabled={isLoading || payslips.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <DataFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          selectedCompany={selectedCompany}
          onCompanyChange={setSelectedCompany}
        />

        {/* Stats Cards */}
        {!isLoading && payslips.length > 0 && (
          <AnalyticsStats stats={stats} className="mb-6" />
        )}

        {/* Content */}
        {payslips.length === 0 ? (
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-lg">
            <CardContent className="p-12">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  No Analytics Data Available
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Upload some payslips to see detailed analytics and insights
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Upload Your First Payslip
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {selectedView === 'overview' && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SalaryChart data={analyticsData.monthlyData} />
                  <DeductionPieChart data={analyticsData.deductionBreakdown} />
                </div>
                <YearlyComparisonChart data={analyticsData.yearlyData} />
              </>
            )}

            {selectedView === 'trends' && (
              <TrendsChart data={analyticsData.monthlyData} />
            )}

            {selectedView === 'breakdown' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BreakdownChart 
                  data={analyticsData.monthlyData} 
                  type="earnings" 
                  title="Earnings Breakdown" 
                />
                <BreakdownChart 
                  data={analyticsData.monthlyData} 
                  type="deductions" 
                  title="Deductions Breakdown" 
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
