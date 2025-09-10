import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
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
        'common.loading': '載入中...',
        'error.loadingError': '載入數據時發生錯誤',
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

vi.mock('../../components/SalaryTermsGuide', () => ({
  default: () => <div data-testid="salary-terms-guide">Salary Terms Guide</div>,
}))

describe('Dashboard Component', () => {
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
})