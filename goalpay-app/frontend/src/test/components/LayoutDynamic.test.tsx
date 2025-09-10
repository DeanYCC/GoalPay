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

// Create dynamic mock functions
const createAuthMock = (user: any) => ({
  useAuth: () => ({
    user,
    token: user ? 'mock-token' : null,
    login: vi.fn(),
    logout: vi.fn(),
    updateUser: vi.fn(),
  }),
})

const createThemeMock = (theme: string) => ({
  useTheme: () => ({
    theme: theme as 'light' | 'dark',
    toggleTheme: vi.fn(),
    setTheme: vi.fn(),
  }),
})

describe('Layout Component - Dynamic Context Switching', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders layout with sidebar and header when user is authenticated', () => {
    // Mock authenticated user
    vi.doMock('../../contexts/AuthContext', () => createAuthMock({ id: 1, email: 'test@example.com', name: 'Test User' }))
    vi.doMock('../../contexts/ThemeContext', () => createThemeMock('light'))

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
    // Mock unauthenticated user
    vi.doMock('../../contexts/AuthContext', () => createAuthMock(null))
    vi.doMock('../../contexts/ThemeContext', () => createThemeMock('light'))

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
    // Mock authenticated user with dark theme
    vi.doMock('../../contexts/AuthContext', () => createAuthMock({ id: 1, email: 'test@example.com', name: 'Test User' }))
    vi.doMock('../../contexts/ThemeContext', () => createThemeMock('dark'))

    render(
      <TestWrapper>
        <Layout />
      </TestWrapper>
    )

    const layoutContainer = screen.getByTestId('sidebar').closest('.min-h-screen')
    expect(layoutContainer).toHaveClass('dark')
  })

  it('applies light theme class when theme is light', () => {
    // Mock authenticated user with light theme
    vi.doMock('../../contexts/AuthContext', () => createAuthMock({ id: 1, email: 'test@example.com', name: 'Test User' }))
    vi.doMock('../../contexts/ThemeContext', () => createThemeMock('light'))

    render(
      <TestWrapper>
        <Layout />
      </TestWrapper>
    )

    const layoutContainer = screen.getByTestId('sidebar').closest('.min-h-screen')
    expect(layoutContainer).not.toHaveClass('dark')
  })

  it('handles different user states dynamically', () => {
    // Test with different user states
    const testCases = [
      { user: null, expectedRedirect: true },
      { user: { id: 1, email: 'test@example.com', name: 'Test User' }, expectedRedirect: false },
      { user: { id: 2, email: 'admin@example.com', name: 'Admin User' }, expectedRedirect: false },
    ]

    testCases.forEach(({ user, expectedRedirect }) => {
      vi.doMock('../../contexts/AuthContext', () => createAuthMock(user))
      vi.doMock('../../contexts/ThemeContext', () => createThemeMock('light'))

      const { unmount } = render(
        <TestWrapper>
          <Layout />
        </TestWrapper>
      )

      if (expectedRedirect) {
        expect(screen.getByTestId('navigate')).toBeInTheDocument()
      } else {
        expect(screen.getByTestId('sidebar')).toBeInTheDocument()
        expect(screen.getByTestId('header')).toBeInTheDocument()
      }

      unmount()
    })
  })

  it('handles different theme states dynamically', () => {
    // Test with different theme states
    const testCases = [
      { theme: 'light', expectedDarkClass: false },
      { theme: 'dark', expectedDarkClass: true },
    ]

    testCases.forEach(({ theme, expectedDarkClass }) => {
      vi.doMock('../../contexts/AuthContext', () => createAuthMock({ id: 1, email: 'test@example.com', name: 'Test User' }))
      vi.doMock('../../contexts/ThemeContext', () => createThemeMock(theme))

      const { unmount } = render(
        <TestWrapper>
          <Layout />
        </TestWrapper>
      )

      const layoutContainer = screen.getByTestId('sidebar').closest('.min-h-screen')
      
      if (expectedDarkClass) {
        expect(layoutContainer).toHaveClass('dark')
      } else {
        expect(layoutContainer).not.toHaveClass('dark')
      }

      unmount()
    })
  })
})
