import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface YearlyComparisonChartProps {
  data: any[];
}

export function YearlyComparisonChart({ data }: YearlyComparisonChartProps) {
  if (!data.length) {
    return (
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-lg">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">Yearly Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-slate-500">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-lg">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-white">Yearly Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="year" 
                stroke="#64748b"
                tick={{ fill: '#64748b' }}
              />
              <YAxis 
                stroke="#64748b" 
                tickFormatter={(value) => `¥${(value / 1000000).toFixed(1)}M`}
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
              <Bar 
                dataKey="totalGross" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
                name="Total Gross"
              />
              <Bar 
                dataKey="totalNet" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]}
                name="Total Net"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
