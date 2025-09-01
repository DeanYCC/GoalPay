import React from 'react'
import { NavLink } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  BarChart3, 
  Upload, 
  FileText, 
  Settings,
  TrendingUp
} from 'lucide-react'

const Sidebar: React.FC = () => {
  const { t } = useLanguage()

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
  ]

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-card-foreground">GoalPay</h1>
        </div>
      </div>

      {/* 導航菜單 */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.url}>
              <NavLink
                to={item.url}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
