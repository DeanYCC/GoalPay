import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useTranslation } from 'react-i18next'
import { Moon, Sun, LogOut, User } from 'lucide-react'
import LanguageSelector from './LanguageSelector'

const Header: React.FC = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation()

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-card-foreground">
            {t('dashboard.title')}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {/* 語言選擇器 */}
          <LanguageSelector />

          {/* 主題切換 */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            title={theme === 'light' ? t('settings.dark') : t('settings.light')}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Sun className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          {/* 用戶菜單 */}
          <div className="flex items-center gap-3">
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
            
            <div className="hidden md:block">
              <p className="text-sm font-medium text-card-foreground">
                {user?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.email}
              </p>
            </div>

            <button
              onClick={logout}
              className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              title={t('auth.logout')}
            >
              <LogOut className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
