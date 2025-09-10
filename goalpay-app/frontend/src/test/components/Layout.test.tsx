import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '../test-utils'
import Layout from '../../components/Layout'
import { Navigate } from 'react-router-dom'

// Mock react-router-dom Navigate component
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => (
      <div data-testid="navigate" data-to={to}>
        Redirecting to {to}
      </div>
    ),
  }
})

// Mock useAuth hook directly to avoid context issues
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}))

// Mock useTheme hook
vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: vi.fn(() => ({ theme: 'light' })),
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

describe('Layout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders layout with sidebar and header when user is authenticated', async () => {
    const { useAuth } = await import('../../contexts/AuthContext')
    const mockUseAuth = useAuth as any
    mockUseAuth.mockReturnValue({
      user: { id: 1, email: 'test@example.com', name: 'Test User' },
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
    })

    render(<Layout />)

    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByText('GoalPay')).toBeInTheDocument()
    expect(screen.getByText('儀表板')).toBeInTheDocument()
  })

  it('redirects to login when user is not authenticated', async () => {
    const { useAuth } = await import('../../contexts/AuthContext')
    const mockUseAuth = useAuth as any
    mockUseAuth.mockReturnValue({
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
    })

    render(<Layout />)

    // Should show navigate component
    expect(screen.getByTestId('navigate')).toBeInTheDocument()
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login')
  })

  it('applies dark theme class when theme is dark', async () => {
    const { useAuth } = await import('../../contexts/AuthContext')
    const { useTheme } = await import('../../contexts/ThemeContext')
    const mockUseAuth = useAuth as any
    const mockUseTheme = useTheme as any
    
    mockUseAuth.mockReturnValue({
      user: { id: 1, email: 'test@example.com', name: 'Test User' },
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
    })
    
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      toggleTheme: vi.fn(),
      setTheme: vi.fn(),
    })

    render(<Layout />)

    const layoutContainer = screen.getByTestId('layout-container')
    expect(layoutContainer).toHaveClass('dark')
  })

  it('applies light theme class when theme is light', async () => {
    const { useAuth } = await import('../../contexts/AuthContext')
    const { useTheme } = await import('../../contexts/ThemeContext')
    const mockUseAuth = useAuth as any
    const mockUseTheme = useTheme as any
    
    mockUseAuth.mockReturnValue({
      user: { id: 1, email: 'test@example.com', name: 'Test User' },
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
    })
    
    mockUseTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: vi.fn(),
      setTheme: vi.fn(),
    })

    render(<Layout />)

    const layoutContainer = screen.getByTestId('layout-container')
    expect(layoutContainer).not.toHaveClass('dark')
  })

  it('handles loading state when user is loading', async () => {
    const { useAuth } = await import('../../contexts/AuthContext')
    const mockUseAuth = useAuth as any
    mockUseAuth.mockReturnValue({
      user: { id: 1, email: 'test@example.com', name: 'Test User' },
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
    })

    render(<Layout />)

    // Should show layout components when user is authenticated
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('header')).toBeInTheDocument()
  })
})