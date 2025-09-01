'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  BarChart3, 
  Upload, 
  Settings, 
  Moon, 
  Sun, 
  Globe,
  TrendingUp,
  Menu,
  X,
  LogOut,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import LanguageSelector from './LanguageSelector';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    {
      title: t('dashboard.title'),
      url: '/dashboard',
      icon: BarChart3,
    },
    {
      title: t('dashboard.uploadPayslip'),
      url: '/upload',
      icon: Upload,
    },
    {
      title: t('dashboard.viewReports'),
      url: '/reports',
      icon: FileText,
    },
    {
      title: t('dashboard.salaryTrend'),
      url: '/analytics',
      icon: TrendingUp,
    },
    {
      title: t('settings.title'),
      url: '/settings',
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!user) {
    return <>{children}</>;
  }

  return (
    <>
      <style jsx global>{`
        :root {
          --background: 248 250 252;
          --foreground: 15 23 42;
          --card: 255 255 255;
          --card-foreground: 15 23 42;
          --popover: 255 255 255;
          --popover-foreground: 15 23 42;
          --primary: 37 99 235;
          --primary-foreground: 248 250 252;
          --secondary: 100 116 139;
          --secondary-foreground: 255 255 255;
          --muted: 241 245 249;
          --muted-foreground: 100 116 139;
          --accent: 245 158 11;
          --accent-foreground: 15 23 42;
          --destructive: 239 68 68;
          --destructive-foreground: 248 250 252;
          --border: 226 232 240;
          --input: 226 232 240;
          --ring: 37 99 235;
          --radius: 0.75rem;
        }
        
        .dark {
          --background: 2 6 23;
          --foreground: 226 232 240;
          --card: 15 23 42;
          --card-foreground: 226 232 240;
          --popover: 2 6 23;
          --popover-foreground: 226 232 240;
          --primary: 59 130 246;
          --primary-foreground: 226 232 240;
          --secondary: 51 65 85;
          --secondary-foreground: 226 232 240;
          --muted: 30 41 59;
          --muted-foreground: 148 163 184;
          --accent: 251 191 36;
          --accent-foreground: 15 23 42;
          --destructive: 220 38 38;
          --destructive-foreground: 226 232 240;
          --border: 49 46 129;
          --input: 51 65 85;
          --ring: 59 130 246;
        }
        
        * {
          transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
        }
      `}</style>
      
      <div className="min-h-screen flex w-full bg-background text-foreground">
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-card/80 backdrop-blur-sm border-r border-border transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
        `}>
          {/* Sidebar Header */}
          <div className="border-b border-border p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-card-foreground">GoalPay</h2>
                <p className="text-sm text-muted-foreground">
                  {language === 'zh' ? '薪資分析系統' : language === 'jp' ? '給与分析システム' : 'Payroll Analytics'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Sidebar Content */}
          <div className="p-4">
            {/* Navigation */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
                {language === 'zh' ? '導航' : language === 'jp' ? 'ナビゲーション' : 'Navigation'}
              </h3>
              <nav className="space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.url}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                      ${pathname === item.url 
                        ? 'bg-muted dark:bg-muted text-primary dark:text-primary font-medium' 
                        : 'text-card-foreground hover:bg-muted dark:hover:bg-muted hover:text-primary dark:hover:text-primary'
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Preferences */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
                {language === 'zh' ? '偏好設定' : language === 'jp' ? '設定' : 'Preferences'}
              </h3>
              <div className="px-3 py-2 space-y-4">
                {/* Language Selector */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-card-foreground">
                      {language === 'zh' ? '語言' : language === 'jp' ? '言語' : 'Language'}
                    </span>
                  </div>
                  <LanguageSelector />
                </div>
                
                {/* Theme Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {theme === 'light' ? (
                      <Sun className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Moon className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="text-sm text-card-foreground">
                      {language === 'zh' ? '主題' : language === 'jp' ? 'テーマ' : 'Theme'}
                    </span>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="w-8 h-8 p-0 hover:bg-muted rounded-lg transition-colors"
                  >
                    {theme === 'light' ? (
                      <Moon className="w-4 h-4" />
                    ) : (
                      <Sun className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="border-t border-border p-4 mt-auto">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <span className="text-card-foreground font-semibold text-sm">
                  {user.name?.[0] || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-card-foreground text-sm truncate">
                  {user.name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {language === 'zh' ? '薪資分析師' : language === 'jp' ? '給与アナリスト' : 'Payroll Analyst'}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-destructive hover:bg-muted rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {language === 'zh' ? '登出' : language === 'jp' ? 'ログアウト' : 'Logout'}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <header className="bg-card/80 backdrop-blur-sm border-b border-border px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hover:bg-muted p-2 rounded-lg transition-colors duration-200"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <h1 className="text-xl font-bold text-card-foreground">GoalPay</h1>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        </main>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </>
  );
}
