import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from '../../components/Layout'

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
        'common.loading': '載入中...',
        'auth.login': '登入',
        'auth.logout': '登出',
      }
      return translations[key] || key
    },
    i18n: {
      changeLanguage: vi.fn(),
      language: 'zh',
    },
  }),
}))

// Mock Sidebar component with proper structure
vi.mock('../../components/Sidebar', () => ({
  default: () => (
    <div className="w-64 bg-card border-r border-border flex flex-col" data-testid="sidebar">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 17V9" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17V5" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17v-3" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-card-foreground">GoalPay</h1>
        </div>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <a className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-muted-foreground hover:bg-muted hover:text-foreground" href="/dashboard">
              <span className="font-medium">儀表板</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  ),
}))

vi.mock('../../components/Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}))

// Create a more robust Context Mock system
const createContextMocks = (authUser: any, theme: string) => {
  vi.doMock('../../contexts/AuthContext', () => ({
    useAuth: () => ({
      user: authUser,
      token: authUser ? 'mock-token' : null,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
    }),
  }))

  vi.doMock('../../contexts/ThemeContext', () => ({
    useTheme: () => ({
      theme: theme as 'light' | 'dark',
      toggleTheme: vi.fn(),
      setTheme: vi.fn(),
    }),
  }))
}

describe('Layout Component - Improved Context Mock', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders layout with sidebar and header when user is authenticated', () => {
    createContextMocks({ id: 1, email: 'test@example.com', name: 'Test User' }, 'light')

    render(
      <TestWrapper>
        <Layout />
      </TestWrapper>
    )

    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByText('GoalPay')).toBeInTheDocument()
    expect(screen.getByText('儀表板')).toBeInTheDocument()
  })

  it('redirects to login when user is not authenticated', () => {
    createContextMocks(null, 'light')

    render(
      <TestWrapper>
        <Layout />
      </TestWrapper>
    )

    // Should show navigate component
    expect(screen.getByTestId('navigate')).toBeInTheDocument()
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login')
  })

  it('applies dark theme class when theme is dark', () => {
    createContextMocks({ id: 1, email: 'test@example.com', name: 'Test User' }, 'dark')

    render(
      <TestWrapper>
        <Layout />
      </TestWrapper>
    )

    const layoutContainer = screen.getByTestId('sidebar').closest('.min-h-screen')
    expect(layoutContainer).toHaveClass('dark')
  })

  it('applies light theme class when theme is light', () => {
    createContextMocks({ id: 1, email: 'test@example.com', name: 'Test User' }, 'light')

    render(
      <TestWrapper>
        <Layout />
      </TestWrapper>
    )

    const layoutContainer = screen.getByTestId('sidebar').closest('.min-h-screen')
    expect(layoutContainer).not.toHaveClass('dark')
  })

  it('handles different user states correctly', () => {
    // Test authenticated user
    createContextMocks({ id: 1, email: 'test@example.com', name: 'Test User' }, 'light')

    const { unmount } = render(
      <TestWrapper>
        <Layout />
      </TestWrapper>
    )

    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('header')).toBeInTheDocument()
    unmount()

    // Test unauthenticated user
    createContextMocks(null, 'light')

    render(
      <TestWrapper>
        <Layout />
      </TestWrapper>
    )

    expect(screen.getByTestId('navigate')).toBeInTheDocument()
  })

  it('handles different theme states correctly', () => {
    // Test light theme
    createContextMocks({ id: 1, email: 'test@example.com', name: 'Test User' }, 'light')

    const { unmount } = render(
      <TestWrapper>
        <Layout />
      </TestWrapper>
    )

    const layoutContainer = screen.getByTestId('sidebar').closest('.min-h-screen')
    expect(layoutContainer).not.toHaveClass('dark')
    unmount()

    // Test dark theme
    createContextMocks({ id: 1, email: 'test@example.com', name: 'Test User' }, 'dark')

    render(
      <TestWrapper>
        <Layout />
      </TestWrapper>
    )

    const darkLayoutContainer = screen.getByTestId('sidebar').closest('.min-h-screen')
    expect(darkLayoutContainer).toHaveClass('dark')
  })
})
