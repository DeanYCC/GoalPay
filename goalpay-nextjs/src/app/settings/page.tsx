'use client';

import React, { useState } from 'react';
import { User, Bell, Shield, Database, Download, Globe, Moon, Sun } from 'lucide-react';
import Layout from '@/components/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { language } = useLanguage();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
    monthly: false,
  });

  const [dataRetention, setDataRetention] = useState('2years');

  const settingsSections = [
    {
      title: '個人設定',
      icon: User,
      items: [
        { label: '姓名', value: '張小明', type: 'text' },
        { label: '電子郵件', value: 'xiaoming@example.com', type: 'email' },
        { label: '職位', value: '薪資分析師', type: 'text' },
        { label: '公司', value: 'GoalPay Inc.', type: 'text' },
      ]
    },
    {
      title: '偏好設定',
      icon: Globe,
      items: [
        { label: '語言', value: language === 'zh' ? '繁體中文' : language === 'jp' ? '日本語' : 'English', type: 'select' },
        { label: '時區', value: 'Asia/Taipei (UTC+8)', type: 'select' },
        { label: '日期格式', value: 'YYYY/MM/DD', type: 'select' },
        { label: '貨幣', value: 'TWD (NT$)', type: 'select' },
      ]
    },
    {
      title: '通知設定',
      icon: Bell,
      items: [
        { label: '電子郵件通知', value: notifications.email, type: 'toggle' },
        { label: '推播通知', value: notifications.push, type: 'toggle' },
        { label: '週報', value: notifications.weekly, type: 'toggle' },
        { label: '月報', value: notifications.monthly, type: 'toggle' },
      ]
    },
    {
      title: '數據管理',
      icon: Database,
      items: [
        { label: '數據保留期限', value: dataRetention, type: 'select' },
        { label: '自動備份', value: true, type: 'toggle' },
        { label: '數據加密', value: true, type: 'toggle' },
        { label: 'API 存取', value: false, type: 'toggle' },
      ]
    },
    {
      title: '安全性',
      icon: Shield,
      items: [
        { label: '雙重認證', value: true, type: 'toggle' },
        { label: '登入通知', value: true, type: 'toggle' },
        { label: '密碼過期提醒', value: true, type: 'toggle' },
        { label: '會話管理', value: '30天', type: 'select' },
      ]
    },
  ];

  const handleToggle = (sectionIndex: number, itemIndex: number) => {
    const section = settingsSections[sectionIndex];
    const item = section.items[itemIndex];
    
    if (item.type === 'toggle') {
      // Update notifications state if it's in the notifications section
      if (section.title === '通知設定') {
        const key = Object.keys(notifications)[itemIndex];
        setNotifications(prev => ({
          ...prev,
          [key]: !prev[key as keyof typeof notifications]
        }));
      }
    }
  };

  const handleDataRetentionChange = (value: string) => {
    setDataRetention(value);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">設定</h1>
            <p className="text-muted-foreground">管理您的帳戶設定和偏好</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
              重設為預設
            </button>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              儲存變更
            </button>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'light' ? (
                <Sun className="w-6 h-6 text-amber-500" />
              ) : (
                <Moon className="w-6 h-6 text-blue-500" />
              )}
              <div>
                <h3 className="text-lg font-semibold text-foreground">主題</h3>
                <p className="text-sm text-muted-foreground">
                  {theme === 'light' ? '淺色主題' : '深色主題'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              切換到 {theme === 'light' ? '深色' : '淺色'} 主題
            </button>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {settingsSections.map((section, sectionIndex) => (
            <div key={section.title} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <section.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
              </div>
              
              <div className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <div key={item.label} className="flex items-center justify-between py-2">
                    <span className="text-sm text-foreground">{item.label}</span>
                    
                    {item.type === 'toggle' ? (
                      <button
                        onClick={() => handleToggle(sectionIndex, itemIndex)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          item.value ? 'bg-primary' : 'bg-muted'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            item.value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    ) : item.type === 'select' ? (
                      <select 
                        className="px-3 py-1 text-sm border border-border rounded-lg bg-card text-foreground"
                        value={item.value as string}
                        onChange={(e) => {
                          if (item.label === '數據保留期限') {
                            handleDataRetentionChange(e.target.value);
                          }
                        }}
                      >
                        {item.label === '數據保留期限' ? (
                          <>
                            <option value="1year">1年</option>
                            <option value="2years">2年</option>
                            <option value="5years">5年</option>
                            <option value="forever">永久</option>
                          </>
                        ) : item.label === '語言' ? (
                          <>
                            <option value="繁體中文">繁體中文</option>
                            <option value="日本語">日本語</option>
                            <option value="English">English</option>
                          </>
                        ) : (
                          <option value={item.value}>{item.value}</option>
                        )}
                      </select>
                    ) : (
                      <span className="text-sm text-muted-foreground">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Data Export */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Download className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">數據匯出</h3>
                <p className="text-sm text-muted-foreground">匯出您的薪資數據和分析報告</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
                CSV 格式
              </button>
              <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
                PDF 格式
              </button>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                全部匯出
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">危險區域</h3>
              <p className="text-sm text-red-600 dark:text-red-300">
                這些操作無法復原，請謹慎操作
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
                刪除帳戶
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                清除所有數據
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
