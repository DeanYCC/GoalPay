import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Dashboard from '../../pages/Dashboard'

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

// Mock i18n before importing components
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'dashboard.title': '儀表板',
        'dashboard.subtitle': '管理您的薪資單和收入追蹤',
        'dashboard.totalIncome': '總收入',
        'dashboard.totalDeductions': '總扣除',
        'dashboard.netIncome': '淨收入',
        'dashboard.monthlyAverage': '月平均',
        'dashboard.recentPayrolls': '最近薪資單',
        'dashboard.uploadPayslip': '上傳薪資單',
        'dashboard.viewReports': '查看報告',
        'dashboard.exportData': '匯出數據',
        'dashboard.salaryTrend': '薪資趨勢',
        'dashboard.quickActions': '快速操作',
        'common.loading': '載入中...',
        'common.error': '錯誤',
        'common.success': '成功',
        'common.cancel': '取消',
        'common.save': '儲存',
        'common.delete': '刪除',
        'common.edit': '編輯',
        'common.view': '查看',
        'common.add': '新增',
        'common.back': '返回',
        'common.next': '下一步',
        'common.previous': '上一步',
        'common.submit': '提交',
        'common.currency': '貨幣',
        'common.saving': '儲存中...',
        'common.actions': '操作',
        'auth.login': '登入',
        'auth.logout': '登出',
        'auth.loginWithGoogle': '使用 Google 登入',
        'auth.welcome': '歡迎來到 GoalPay',
        'auth.subtitle': '您的薪資分析助手',
        'auth.or': '或',
        'auth.testLogin': '測試登入',
        'auth.testNote': '測試模式：使用預設數據進行功能測試',
        'error.loadingError': '載入數據時發生錯誤',
        'error.retry': '重試',
        'error.networkError': '網路連線錯誤',
        'error.serverError': '伺服器錯誤',
        'error.unauthorized': '未授權',
        'error.forbidden': '禁止訪問',
        'error.notFound': '找不到資源',
        'error.validationError': '驗證錯誤',
        'error.unknownError': '未知錯誤',
      }
      return translations[key] || key
    },
    i18n: {
      changeLanguage: vi.fn(),
      language: 'zh',
    },
  }),
}))

// Mock Context hooks directly
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, email: 'test@example.com', name: 'Test User' },
    token: 'mock-token',
    login: vi.fn(),
    logout: vi.fn(),
    updateUser: vi.fn(),
  }),
}))

vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: vi.fn(),
    setTheme: vi.fn(),
  }),
}))

vi.mock('../../contexts/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'zh',
    setLanguage: vi.fn(),
    t: (key: string) => key,
  }),
}))

// Mock axios with proper methods
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
    head: vi.fn(),
    options: vi.fn(),
    request: vi.fn(),
    interceptors: {
      request: {
        use: vi.fn(),
        eject: vi.fn(),
      },
      response: {
        use: vi.fn(),
        eject: vi.fn(),
      },
    },
    defaults: {
      baseURL: '',
      headers: {},
      timeout: 0,
    },
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      patch: vi.fn(),
      head: vi.fn(),
      options: vi.fn(),
      request: vi.fn(),
      interceptors: {
        request: { use: vi.fn(), eject: vi.fn() },
        response: { use: vi.fn(), eject: vi.fn() },
      },
      defaults: { baseURL: '', headers: {}, timeout: 0 },
    })),
  },
  create: vi.fn(() => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
    head: vi.fn(),
    options: vi.fn(),
    request: vi.fn(),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
    defaults: { baseURL: '', headers: {}, timeout: 0 },
  })),
}))

// Mock the API endpoints
vi.mock('../../config/api', () => ({
  API_ENDPOINTS: {
    DASHBOARD: {
      SUMMARY: '/api/dashboard/summary',
      TEST_DATA: '/api/dashboard/test-data',
    },
  },
}))

// Mock payroll calculations
vi.mock('../../services/companyService', () => ({
  payrollCalculations: {
    runTests: vi.fn(),
  },
}))

// Mock dashboard components with proper structure
vi.mock('../../components/dashboard/StatsCard', () => ({
  default: ({ title, value, currency }: { title: string; value: number; currency: string }) => (
    <div data-testid="stats-card" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {currency} {value?.toLocaleString() || '0'}
      </div>
    </div>
  ),
}))

vi.mock('../../components/dashboard/SalaryChart', () => ({
  default: ({ data }: { data: any[] }) => (
    <div data-testid="salary-chart" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">薪資趨勢圖</h3>
      <div className="h-64 flex items-center justify-center text-gray-500">
        圖表數據: {data.length} 筆
      </div>
    </div>
  ),
}))

vi.mock('../../components/dashboard/QuickActions', () => ({
  default: () => (
    <div data-testid="quick-actions" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">快速操作</h3>
      <div className="grid grid-cols-2 gap-4">
        <button className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          上傳薪資單
        </button>
        <button className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600">
          查看報告
        </button>
      </div>
    </div>
  ),
}))

vi.mock('../../components/dashboard/RecentPayrolls', () => ({
  default: ({ payrolls }: { payrolls: any[] }) => (
    <div data-testid="recent-payrolls" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">最近薪資單</h3>
      <div className="space-y-2">
        {payrolls.length > 0 ? (
          payrolls.map((payroll, index) => (
            <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              {payroll.period} - {payroll.netIncome}
            </div>
          ))
        ) : (
          <div className="text-gray-500">尚無薪資單</div>
        )}
      </div>
    </div>
  ),
}))

vi.mock('../../components/SalaryTerms/SalaryTerms', () => ({
  default: () => <div data-testid="salary-terms">Salary Terms Guide</div>,
}))

describe('Dashboard Component - Extended Test Coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders dashboard with test data when user is test user', async () => {
    // Mock localStorage to simulate test user
    const mockUser = { id: 1, email: 'test@goalpay.com', name: 'Test User' }
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => JSON.stringify(mockUser)),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    })

    const axios = await import('axios')
    
    axios.default.get.mockResolvedValue({
      data: {
        summary: {
          totalIncome: 500000,
          totalDeductions: 50000,
          netIncome: 450000,
          monthlyAverage: 450000,
          currency: 'JPY',
          monthlyGrowth: 5.2
        },
        recentPayrolls: [],
        monthlyTrend: []
      }
    })

    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('儀表板')).toBeInTheDocument()
    })

    // Check for actual rendered content
    expect(screen.getByText('總收入')).toBeInTheDocument()
    expect(screen.getByText('淨收入')).toBeInTheDocument()
    expect(screen.getByText('JPY 500,000')).toBeInTheDocument()
    expect(screen.getByText('JPY 450,000')).toBeInTheDocument()
    expect(screen.getByTestId('stats-card')).toBeInTheDocument()
    expect(screen.getByTestId('salary-chart')).toBeInTheDocument()
    expect(screen.getByTestId('quick-actions')).toBeInTheDocument()
  })

  it('renders dashboard with regular user data', async () => {
    // Mock localStorage to simulate regular user
    const mockUser = { id: 1, email: 'user@example.com', name: 'Regular User' }
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => JSON.stringify(mockUser)),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    })

    const axios = await import('axios')
    
    axios.default.get.mockResolvedValue({
      data: {
        summary: {
          totalIncome: 300000,
          totalDeductions: 30000,
          netIncome: 270000,
          monthlyAverage: 270000,
          currency: 'JPY',
          monthlyGrowth: 2.1
        },
        recentPayrolls: [
          { period: '2024-01', netIncome: 270000 },
          { period: '2023-12', netIncome: 265000 }
        ],
        monthlyTrend: [
          { month: '2023-12', income: 265000 },
          { month: '2024-01', income: 270000 }
        ]
      }
    })

    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('儀表板')).toBeInTheDocument()
    })

    expect(screen.getByText('總收入')).toBeInTheDocument()
    expect(screen.getByText('JPY 300,000')).toBeInTheDocument()
    expect(screen.getByText('JPY 270,000')).toBeInTheDocument()
  })

  it('shows loading state initially', async () => {
    const axios = await import('axios')
    axios.default.get.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    )

    expect(screen.getByText('載入中...')).toBeInTheDocument()
  })

  it('shows error state when API call fails', async () => {
    const axios = await import('axios')
    axios.default.get.mockRejectedValue(new Error('API Error'))

    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('載入數據時發生錯誤')).toBeInTheDocument()
    })
  })

  it('handles null dashboard data gracefully', async () => {
    const axios = await import('axios')
    axios.default.get.mockResolvedValue({ data: null })

    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('儀表板')).toBeInTheDocument()
    })

    // Should not crash and show default values
    expect(screen.getByText('總收入')).toBeInTheDocument()
    expect(screen.getByText('淨收入')).toBeInTheDocument()
  })

  it('handles empty dashboard data gracefully', async () => {
    const axios = await import('axios')
    axios.default.get.mockResolvedValue({ 
      data: {
        summary: null,
        recentPayrolls: [],
        monthlyTrend: []
      }
    })

    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('儀表板')).toBeInTheDocument()
    })

    // Should show default values without crashing
    expect(screen.getByText('總收入')).toBeInTheDocument()
  })

  it('handles network error gracefully', async () => {
    const axios = await import('axios')
    axios.default.get.mockRejectedValue(new Error('Network Error'))

    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('載入數據時發生錯誤')).toBeInTheDocument()
    })
  })

  it('handles server error gracefully', async () => {
    const axios = await import('axios')
    axios.default.get.mockRejectedValue(new Error('Server Error'))

    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('載入數據時發生錯誤')).toBeInTheDocument()
    })
  })

  it('handles timeout error gracefully', async () => {
    const axios = await import('axios')
    axios.default.get.mockRejectedValue(new Error('Timeout'))

    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('載入數據時發生錯誤')).toBeInTheDocument()
    })
  })

  it('handles unauthorized error gracefully', async () => {
    const axios = await import('axios')
    axios.default.get.mockRejectedValue(new Error('Unauthorized'))

    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('載入數據時發生錯誤')).toBeInTheDocument()
    })
  })

  it('handles different currency formats', async () => {
    const axios = await import('axios')
    
    axios.default.get.mockResolvedValue({
      data: {
        summary: {
          totalIncome: 5000,
          totalDeductions: 500,
          netIncome: 4500,
          monthlyAverage: 4500,
          currency: 'USD',
          monthlyGrowth: 5.2
        },
        recentPayrolls: [],
        monthlyTrend: []
      }
    })

    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('儀表板')).toBeInTheDocument()
    })

    expect(screen.getByText('USD 5,000')).toBeInTheDocument()
    expect(screen.getByText('USD 4,500')).toBeInTheDocument()
  })

  it('handles large numbers correctly', async () => {
    const axios = await import('axios')
    
    axios.default.get.mockResolvedValue({
      data: {
        summary: {
          totalIncome: 1000000,
          totalDeductions: 100000,
          netIncome: 900000,
          monthlyAverage: 900000,
          currency: 'JPY',
          monthlyGrowth: 5.2
        },
        recentPayrolls: [],
        monthlyTrend: []
      }
    })

    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('儀表板')).toBeInTheDocument()
    })

    expect(screen.getByText('JPY 1,000,000')).toBeInTheDocument()
    expect(screen.getByText('JPY 900,000')).toBeInTheDocument()
  })

  it('handles zero values correctly', async () => {
    const axios = await import('axios')
    
    axios.default.get.mockResolvedValue({
      data: {
        summary: {
          totalIncome: 0,
          totalDeductions: 0,
          netIncome: 0,
          monthlyAverage: 0,
          currency: 'JPY',
          monthlyGrowth: 0
        },
        recentPayrolls: [],
        monthlyTrend: []
      }
    })

    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('儀表板')).toBeInTheDocument()
    })

    expect(screen.getByText('JPY 0')).toBeInTheDocument()
  })

  it('handles negative values correctly', async () => {
    const axios = await import('axios')
    
    axios.default.get.mockResolvedValue({
      data: {
        summary: {
          totalIncome: 500000,
          totalDeductions: 600000,
          netIncome: -100000,
          monthlyAverage: -100000,
          currency: 'JPY',
          monthlyGrowth: -5.2
        },
        recentPayrolls: [],
        monthlyTrend: []
      }
    })

    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('儀表板')).toBeInTheDocument()
    })

    expect(screen.getByText('JPY 500,000')).toBeInTheDocument()
    expect(screen.getByText('JPY -100,000')).toBeInTheDocument()
  })
})
