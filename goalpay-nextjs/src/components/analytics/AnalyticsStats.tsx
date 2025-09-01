import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Users, Calendar, Calculator } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Stats {
  totalPayslips: number;
  totalGrossSalary: number;
  totalNetPay: number;
  averageGrossSalary: number;
  averageNetPay: number;
  totalDeductions: number;
  averageDeductions: number;
}

interface AnalyticsStatsProps {
  stats: Stats;
  className?: string;
}

export function AnalyticsStats({ stats, className = "" }: AnalyticsStatsProps) {
  const statCards = [
    {
      title: "Total Payslips",
      value: stats.totalPayslips,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      title: "Total Gross Salary",
      value: formatCurrency(stats.totalGrossSalary),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20"
    },
    {
      title: "Total Net Pay",
      value: formatCurrency(stats.totalNetPay),
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/20"
    },
    {
      title: "Average Gross Salary",
      value: formatCurrency(stats.averageGrossSalary),
      icon: Calculator,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20"
    },
    {
      title: "Average Net Pay",
      value: formatCurrency(stats.averageNetPay),
      icon: TrendingUp,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/20"
    },
    {
      title: "Total Deductions",
      value: formatCurrency(stats.totalDeductions),
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20"
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {statCards.map((stat, index) => (
        <Card key={index} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
