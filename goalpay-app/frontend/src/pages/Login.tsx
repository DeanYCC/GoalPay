import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentLanguage, setLanguage } = useLanguage();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  // 點擊外部關閉語言選擇器
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.language-selector')) {
        setShowLanguageSelector(false);
      }
    };

    if (showLanguageSelector) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLanguageSelector]);

  const handleGoogleLogin = () => {
    // 重定向到後端 Google OAuth 端點
    window.location.href = API_ENDPOINTS.AUTH.GOOGLE;
  };

  const handleTestLogin = () => {
    console.log('開始測試登入...');
    
    // 創建測試用戶數據
    const testUser = {
      id: 1,
      email: 'test@goalpay.com',
      name: '測試用戶',
      picture: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2QjcyRkYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDkuNzRMMTIgMTZMMTAuOTEgOS43NEw0IDlMMTAuOTEgOC4yNkwxMiAyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo=',
      company_name: '測試公司',
      currency: 'JPY',
      theme: 'light',
      language: 'zh'
    };

    // 創建測試 token
    const testToken = 'test-token-' + Date.now();
    
    console.log('測試用戶數據:', testUser);
    console.log('測試Token:', testToken);
    
    try {
      // 直接設置localStorage
      localStorage.setItem('user', JSON.stringify(testUser));
      localStorage.setItem('token', testToken);
      
      // 使用 auth context 的 login 函數
      login(testUser, testToken);
      console.log('登入成功，準備導航到儀表板...');
      
      // 使用window.location.href而不是navigate
     
      navigate('/dashboard');
    } catch (error) {
      console.error('測試登入失敗:', error);
      alert('測試登入失敗，請檢查控制台錯誤信息');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center p-4">
      {/* 語言選擇器 */}
      <div className="absolute top-4 right-4 language-selector">
        <button
          onClick={() => setShowLanguageSelector(!showLanguageSelector)}
          className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm">
            {currentLanguage === 'zh' ? '中文' : currentLanguage === 'en' ? 'English' : '日本語'}
          </span>
        </button>
        
        {showLanguageSelector && (
          <div className="absolute top-full right-0 mt-2 bg-white/10 backdrop-blur-sm rounded-lg p-2 space-y-1 min-w-[120px] z-50">
            <button
              onClick={() => {
                setLanguage('zh');
                setShowLanguageSelector(false);
              }}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                currentLanguage === 'zh' 
                  ? 'bg-white/20 text-white' 
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              中文
            </button>
            <button
              onClick={() => {
                setLanguage('en');
                setShowLanguageSelector(false);
              }}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                currentLanguage === 'en' 
                  ? 'bg-white/20 text-white' 
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              English
            </button>
            <button
              onClick={() => {
                setLanguage('jp');
                setShowLanguageSelector(false);
              }}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                currentLanguage === 'jp' 
                  ? 'bg-white/20 text-white' 
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              日本語
            </button>
          </div>
        )}
      </div>

      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Logo */}
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-blue-600 to-purple-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
            {/* 條形圖圖標 */}
            <div className="flex items-end space-x-1 h-10">
              <div className="w-2 bg-white rounded-sm" style={{ height: '60%' }}></div>
              <div className="w-2 bg-white rounded-sm" style={{ height: '80%' }}></div>
              <div className="w-2 bg-white rounded-sm" style={{ height: '40%' }}></div>
              <div className="w-2 bg-white rounded-sm" style={{ height: '100%' }}></div>
            </div>
          </div>
          
          {/* 應用程序名稱 */}
          <h1 className="text-4xl font-bold text-white mb-2">
            GoalPay
          </h1>
          
          {/* 標語 */}
          <p className="text-gray-300 text-lg">
            {t('auth.subtitle')}
          </p>
        </div>
        
        <div className="space-y-4">
          {/* Google 登入按鈕 */}
          <button
            onClick={handleGoogleLogin}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {t('auth.loginWithGoogle')}
          </button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-400">
                {t('auth.or')}
              </span>
            </div>
          </div>
          
          {/* 測試登入按鈕 */}
          <button
            onClick={handleTestLogin}
            className="w-full flex justify-center py-3 px-4 border border-gray-600 rounded-md shadow-sm bg-white/10 backdrop-blur-sm text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            🧪 {t('auth.testLogin')}
          </button>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-gray-400">
            {t('auth.testNote')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
