import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock fetch
global.fetch = vi.fn()

// Mock react-i18next
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
        'dashboard.noData': '尚無數據',
        'dashboard.uploadPayslip': '上傳薪資單',
        'dashboard.viewReports': '查看報告',
        'dashboard.exportData': '匯出數據',
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

// Mock axios with complete API simulation
const mockAxiosInstance = {
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
  create: vi.fn(() => mockAxiosInstance),
}

vi.mock('axios', () => ({
  default: mockAxiosInstance,
  create: vi.fn(() => mockAxiosInstance),
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  patch: vi.fn(),
  head: vi.fn(),
  options: vi.fn(),
  request: vi.fn(),
}))

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
    }),
  }
})

// Clean up after each test - keeping only the complete i18n mock above

// Mock @tanstack/react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  })),
  useMutation: vi.fn(() => ({
    mutate: vi.fn(),
    isLoading: false,
    error: null,
  })),
  QueryClient: vi.fn(),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks()
})
