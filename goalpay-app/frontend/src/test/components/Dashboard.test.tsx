import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { render } from '../test-utils'
import Dashboard from '../../pages/Dashboard'

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

    // Mock useQuery to return test data
    const { useQuery } = await import('@tanstack/react-query')
    const mockUseQuery = useQuery as any
    mockUseQuery.mockReturnValue({
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
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText('儀表板')).toBeInTheDocument()
    })

    // Check for actual rendered content
    expect(screen.getByText('總收入')).toBeInTheDocument()
    expect(screen.getByText('淨收入')).toBeInTheDocument()
    expect(screen.getByText('JPY 500,000')).toBeInTheDocument()
    expect(screen.getAllByText('JPY 450,000')).toHaveLength(2) // 淨收入和月平均都是450,000
    expect(screen.getAllByTestId('stats-card')).toHaveLength(4) // 4个统计卡片
    expect(screen.getByTestId('salary-chart')).toBeInTheDocument()
    expect(screen.getByTestId('quick-actions')).toBeInTheDocument()
  })

  it('shows loading state initially', async () => {
    // Mock useQuery to return loading state
    const { useQuery } = await import('@tanstack/react-query')
    const mockUseQuery = useQuery as any
    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    })

    render(<Dashboard />)

    expect(screen.getByText('載入中...')).toBeInTheDocument()
  })

  it('shows error state when API call fails', async () => {
    // Mock useQuery to return error state
    const { useQuery } = await import('@tanstack/react-query')
    const mockUseQuery = useQuery as any
    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('API Error'),
      refetch: vi.fn(),
    })

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText('無法載入儀表板數據，請檢查網絡連接')).toBeInTheDocument()
    })
  })

  it('handles null dashboard data gracefully', async () => {
    // Mock useQuery to return null data
    const { useQuery } = await import('@tanstack/react-query')
    const mockUseQuery = useQuery as any
    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText('儀表板')).toBeInTheDocument()
    })

    // Should not crash and show default values
    expect(screen.getByText('總收入')).toBeInTheDocument()
    expect(screen.getByText('淨收入')).toBeInTheDocument()
  })

  it('handles empty dashboard data gracefully', async () => {
    // Mock useQuery to return empty data structure
    const { useQuery } = await import('@tanstack/react-query')
    const mockUseQuery = useQuery as any
    mockUseQuery.mockReturnValue({
      data: {
        summary: null,
        recentPayrolls: [],
        monthlyTrend: []
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText('儀表板')).toBeInTheDocument()
    })

    // Should show default values without crashing
    expect(screen.getByText('總收入')).toBeInTheDocument()
  })
})