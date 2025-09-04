import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const AuthCallback: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t } = useTranslation()

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (token) {
      // 保存 token 到本地存儲
      localStorage.setItem('token', token)
      
      // 重定向到儀表板
      navigate('/dashboard', { replace: true })
    } else {
      // 沒有 token，重定向到登入頁面
      navigate('/login', { replace: true })
    }
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">
          {t('common.loading')}...
        </p>
      </div>
    </div>
  )
}

export default AuthCallback
