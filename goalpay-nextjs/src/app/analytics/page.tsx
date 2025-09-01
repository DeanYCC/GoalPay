'use client';

import React from 'react';
import { TrendingUp, BarChart3, PieChart, Calendar } from 'lucide-react';
import Layout from '@/components/Layout';

export default function Analytics() {
  const chartData = [
    { month: '1月', salary: 45000, deductions: 8000, net: 37000 },
    { month: '2月', salary: 48000, deductions: 8500, net: 39500 },
    { month: '3月', salary: 46000, deductions: 8200, net: 37800 },
    { month: '4月', salary: 50000, deductions: 9000, net: 41000 },
    { month: '5月', salary: 47000, deductions: 8300, net: 38700 },
    { month: '6月', salary: 52000, deductions: 9500, net: 42500 },
  ];

  const deductionBreakdown = [
    { category: '所得稅', amount: 4500, percentage: 25 },
    { category: '健保費', amount: 1800, percentage: 10 },
    { category: '勞保費', amount: 2700, percentage: 15 },
    { category: '其他扣除', amount: 900, percentage: 5 },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">薪資分析</h1>
            <p className="text-muted-foreground">深入分析您的薪資數據和趨勢</p>
          </div>
          <div className="flex items-center gap-3">
            <select className="px-3 py-2 border border-border rounded-lg bg-card text-foreground">
              <option>最近6個月</option>
              <option>最近12個月</option>
              <option>今年</option>
            </select>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              匯出報告
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">平均月薪</p>
                <p className="text-2xl font-bold text-foreground">$48,333</p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600 font-medium">+8.5%</span>
              <span className="text-sm text-muted-foreground ml-2">vs 去年同期</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">總扣除額</p>
                <p className="text-2xl font-bold text-foreground">$18,000</p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-blue-600 font-medium">+12.3%</span>
              <span className="text-sm text-muted-foreground ml-2">vs 去年同期</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">淨收入</p>
                <p className="text-2xl font-bold text-foreground">$30,333</p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <PieChart className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-purple-600 font-medium">+6.8%</span>
              <span className="text-sm text-muted-foreground ml-2">vs 去年同期</span>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Salary Trend Chart */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">薪資趨勢</h3>
            <div className="space-y-3">
              {chartData.map((data, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-16 text-sm text-muted-foreground">{data.month}</div>
                  <div className="flex-1 bg-muted rounded-full h-3">
                    <div 
                      className="bg-primary h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(data.net / 50000) * 100}%` }}
                    />
                  </div>
                  <div className="w-20 text-right text-sm font-medium text-foreground">
                    ${data.net.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deduction Breakdown */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">扣除項目分析</h3>
            <div className="space-y-4">
              {deductionBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-sm text-foreground">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">${item.amount.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Analysis */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">最近分析</h3>
          <div className="space-y-4">
            {[
              { title: '薪資增長趨勢分析', date: '2024-01-15', status: '完成' },
              { title: '扣除項目優化建議', date: '2024-01-10', status: '進行中' },
              { title: '年度薪資總結報告', date: '2024-01-05', status: '完成' },
              { title: '稅務規劃分析', date: '2024-01-01', status: '排程中' },
            ].map((analysis, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{analysis.title}</p>
                    <p className="text-xs text-muted-foreground">{analysis.date}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  analysis.status === '完成' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                  analysis.status === '進行中' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                }`}>
                  {analysis.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
