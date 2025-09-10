import React, { createContext } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi } from 'vitest'

// Create mock contexts
const AuthContext = createContext<any>(null)
const ThemeContext = createContext<any>(null)
const LanguageContext = createContext<any>(null)

// Mock Context Providers for testing
const MockAuthProvider: React.FC<{ children: React.ReactNode; user?: any }> = ({ 
  children, 
  user = null 
}) => {
  const mockAuthContext = {
    user,
    token: user ? 'mock-token' : null,
    login: vi.fn(),
    logout: vi.fn(),
    updateUser: vi.fn(),
  }

  return (
    <AuthContext.Provider value={mockAuthContext}>
      {children}
    </AuthContext.Provider>
  )
}

const MockThemeProvider: React.FC<{ children: React.ReactNode; theme?: string }> = ({ 
  children, 
  theme = 'light' 
}) => {
  const mockThemeContext = {
    theme: theme as 'light' | 'dark',
    toggleTheme: vi.fn(),
    setTheme: vi.fn(),
  }

  return (
    <ThemeContext.Provider value={mockThemeContext}>
      {children}
    </ThemeContext.Provider>
  )
}

const MockLanguageProvider: React.FC<{ children: React.ReactNode; language?: string }> = ({ 
  children, 
  language = 'zh' 
}) => {
  const mockLanguageContext = {
    language: language as 'zh' | 'en' | 'jp',
    setLanguage: vi.fn(),
    t: (key: string) => key, // Simple mock translation
  }

  return (
    <LanguageContext.Provider value={mockLanguageContext}>
      {children}
    </LanguageContext.Provider>
  )
}

// Create a custom render function that includes all providers
const AllTheProviders: React.FC<{ 
  children: React.ReactNode
  user?: any
  theme?: string
  language?: string
}> = ({ children, user, theme, language }) => {
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
        <MockAuthProvider user={user}>
          <MockThemeProvider theme={theme}>
            <MockLanguageProvider language={language}>
              {children}
            </MockLanguageProvider>
          </MockThemeProvider>
        </MockAuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: RenderOptions & {
    user?: any
    theme?: string
    language?: string
  }
) => {
  const { user, theme, language, ...renderOptions } = options || {}
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders user={user} theme={theme} language={language}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  })
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }
