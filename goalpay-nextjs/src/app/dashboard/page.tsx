'use client';

import React from 'react';
import { BarChart3, Upload, FileText, TrendingUp } from 'lucide-react';
import Layout from '@/components/Layout';

export default function Dashboard() {
  const stats = [
    {
      name: '總薪資單',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: FileText,
    },
    {
      name: '本月上傳',
      value: '89',
      change: '+5%',
      changeType: 'positive',
      icon: Upload,
    },
    {
      name: '平均薪資',
      value: '$4,567',
      change: '+8%',
      changeType: 'positive',
      icon: BarChart3,
    },
    {
      name: '分析報告',
      value: '12',
      change: '+2',
      changeType: 'positive',
      icon: TrendingUp,
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">儀表板</h1>
            <p className="text-muted-foreground">歡迎回來！這是您的薪資分析概覽。</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              上傳薪資單
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                <span className="text-sm text-muted-foreground ml-2">vs 上月</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">最近活動</h2>
          <div className="space-y-4">
            {[
              { action: '上傳薪資單', user: '張小明', time: '2 小時前', type: 'upload' },
              { action: '生成分析報告', user: '李美玲', time: '4 小時前', type: 'report' },
              { action: '更新薪資條款', user: '王建國', time: '1 天前', type: 'settings' },
              { action: '匯出薪資數據', user: '陳雅婷', time: '2 天前', type: 'export' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Upload className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">由 {activity.user} 執行</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
