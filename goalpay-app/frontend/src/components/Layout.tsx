import React from 'react'
import { Outlet, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import Sidebar from './Sidebar'
import Header from './Header'

const Layout: React.FC = () => {
  const { user } = useAuth()
  const { theme } = useTheme()
  const { language } = useLanguage()
  const location = useLocation()

  // 如果用戶未登入，重定向到登入頁面
  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex h-screen bg-background">
        {/* 側邊欄 */}
        <Sidebar />
        
        {/* 主要內容區域 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 頂部導航欄 */}
          <Header />
          
          {/* 主要內容 */}
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default Layout
