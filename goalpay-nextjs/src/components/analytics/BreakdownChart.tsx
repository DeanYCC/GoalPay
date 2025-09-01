import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface BreakdownChartProps {
  data: any[];
  type: 'earnings' | 'deductions';
  title: string;
}

export function BreakdownChart({ data, type, title }: BreakdownChartProps) {
  if (!data.length) {
    return (
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-lg">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-slate-500">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const getChartData = () => {
    if (type === 'earnings') {
      return (
        <>
          <Bar dataKey="baseSalary" stackId="earnings" fill="#3b82f6" name="Base Salary" />
          <Bar dataKey="allowances" stackId="earnings" fill="#10b981" name="Allowances" />
          <Bar dataKey="overtimePay" stackId="earnings" fill="#f59e0b" name="Overtime Pay" />
        </>
      );
    } else {
      return (
        <>
          <Bar dataKey="healthIns" stackId="deductions" fill="#3b82f6" name="Health Insurance" />
          <Bar dataKey="employIns" stackId="deductions" fill="#10b981" name="Employment Insurance" />
          <Bar dataKey="incomeTax" stackId="deductions" fill="#f59e0b" name="Income Tax" />
        </>
      );
    }
  };

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-lg">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="period" 
                stroke="#64748b" 
                fontSize={10}
                tick={{ fill: '#64748b' }}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12} 
                tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}K`}
                tick={{ fill: '#64748b' }}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              {getChartData()}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
