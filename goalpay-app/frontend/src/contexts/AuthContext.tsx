import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'
import { API_ENDPOINTS } from '../config/api'

interface User {
  id: number
  email: string
  name: string
  picture?: string
  company_name?: string
  currency?: string
  theme?: string
  language?: string
  paydayType?: string
  customPayday?: number
  periodStartDay?: number
  periodEndDay?: number
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (userData?: User, userToken?: string) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))

  // 設置 axios 默認 headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  // 驗證 token 並獲取用戶信息
  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        // 檢查是否為測試用戶
        const user = localStorage.getItem('user');
        if (user) {
          const userData = JSON.parse(user);
          if (userData.email === 'test@goalpay.com') {
            // 測試用戶，直接設置用戶數據
            setUser(userData);
            return;
          }
        }
        
        try {
          const response = await axios.get(API_ENDPOINTS.AUTH.VERIFY)
          if (response.data.valid) {
            const userResponse = await axios.get(API_ENDPOINTS.USERS.PROFILE)
            setUser(userResponse.data)
          } else {
            // Token 無效，清除本地存儲
            localStorage.removeItem('token')
            setToken(null)
            setUser(null)
          }
        } catch (error) {
          console.error('Token validation failed:', error)
          localStorage.removeItem('token')
          setToken(null)
          setUser(null)
        }
      }
    }

    validateToken()
  }, [token])

  const login = (userData?: User, userToken?: string) => {
    if (userData && userToken) {
      // 測試登入 - 立即更新狀態
      console.log('AuthContext: 設置用戶數據', userData);
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
      
      // 強制觸發重新渲染
      setTimeout(() => {
        console.log('AuthContext: 用戶狀態已更新');
      }, 0);
    } else {
      // Google OAuth 登入
      window.location.href = API_ENDPOINTS.AUTH.GOOGLE;
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    window.location.href = '/login'
  }

  const updateUser = async (userData: Partial<User>) => {
    try {
      const response = await axios.put(API_ENDPOINTS.USERS.PROFILE, userData)
      setUser(response.data)
    } catch (error) {
      console.error('Failed to update user:', error)
      throw error
    }
  }

  const value = {
    user,
    token,
    login,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
