import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { ChevronDown, Globe } from 'lucide-react'

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'zh', name: t('settings.traditionalChinese'), flag: '🇹🇼' },
    { code: 'en', name: t('settings.english'), flag: '🇺🇸' },
    { code: 'jp', name: t('settings.japanese'), flag: '🇯🇵' },
  ]

  const currentLanguage = languages.find(lang => lang.code === language)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
      >
        <Globe className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-card-foreground">
          {currentLanguage?.flag} {currentLanguage?.name}
        </span>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
          <div className="py-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code as 'zh' | 'en' | 'jp')
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-muted transition-colors ${
                  language === lang.code
                    ? 'bg-primary text-primary-foreground'
                    : 'text-card-foreground'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="text-sm font-medium">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default LanguageSelector
