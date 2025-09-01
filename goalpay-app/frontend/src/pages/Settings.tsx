import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { User, Building, Palette, Globe, Calendar } from 'lucide-react'
import CompanyManagement from '../components/CompanyManagement/CompanyManagement'
import PayrollItemManager from '../components/PayrollItemManager/PayrollItemManager'

const Settings: React.FC = () => {
  const { user, updateUser } = useAuth()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    company_name: user?.company_name || '',
    currency: user?.currency || 'JPY',
    theme: theme,
    language: language,
    paydayType: user?.paydayType || 'month_end',
    customPayday: user?.customPayday || 25,
    periodStartDay: user?.periodStartDay || 1,
    periodEndDay: user?.periodEndDay || 31
  })

  const handleSettingChange = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await updateUser({
        company_name: settings.company_name,
        currency: settings.currency,
        paydayType: settings.paydayType,
        customPayday: settings.customPayday,
        periodStartDay: settings.periodStartDay,
        periodEndDay: settings.periodEndDay
      })
      
      // 更新主題和語言
      setTheme(settings.theme as 'light' | 'dark')
      setLanguage(settings.language as 'zh' | 'en' | 'jp')
      
      // 顯示成功消息
      alert(t('settings.settingsSaved'))
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert(t('settings.saveError'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 頁面標題 */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {t('settings.title')}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t('settings.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 用戶檔案 */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              {t('settings.userProfile')}
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('settings.fullName')}
              </label>
              <input
                type="text"
                value={user?.name || ''}
                disabled
                className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-muted-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('settings.email')}
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-muted-foreground"
              />
            </div>
          </div>
        </div>

        {/* 公司資訊 */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Building className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              {t('settings.companyManagement')}
            </h3>
          </div>

          <CompanyManagement />
        </div>

        {/* 薪資項目管理 */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              {t('settings.payrollItemManagement')}
            </h3>
          </div>

          <PayrollItemManager />
        </div>

        {/* 偏好設定 */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              {t('settings.preferences')}
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('settings.theme')}
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={settings.theme === 'light'}
                    onChange={(e) => handleSettingChange('theme', e.target.value)}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">{t('settings.light')}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={settings.theme === 'dark'}
                    onChange={(e) => handleSettingChange('theme', e.target.value)}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">{t('settings.dark')}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 語言設定 */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              {t('settings.language')}
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('settings.selectLanguage')}
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="language"
                    value="zh"
                    checked={settings.language === 'zh'}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">🇹🇼 繁體中文</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="language"
                    value="en"
                    checked={settings.language === 'en'}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">🇺🇸 English</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="language"
                    value="jp"
                    checked={settings.language === 'jp'}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">🇯🇵 日本語</span>
                </label>
              </div>
            </div>
          </div>
        </div>


      </div>

      {/* 保存按鈕 */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isLoading ? t('settings.saving') : t('settings.saveSettings')}
        </button>
      </div>
    </div>
  )
}

export default Settings
