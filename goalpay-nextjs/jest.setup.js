import '@testing-library/jest-dom'

// Mock Web APIs for Next.js
global.Request = class Request {
  constructor(input, init = {}) {
    // Use Object.defineProperty to properly set url as a getter
    Object.defineProperty(this, 'url', {
      value: input,
      writable: false,
      enumerable: true,
      configurable: false
    })
    
    this.method = init?.method || 'GET'
    this.headers = new Map(Object.entries(init?.headers || {}))
    this.body = init?.body
  }
  
  async json() {
    return JSON.parse(this.body || '{}')
  }
}

global.Response = class Response {
  constructor(body, init) {
    this.body = body
    this.status = init?.status || 200
    this.statusText = init?.statusText || 'OK'
    this.headers = new Map(Object.entries(init?.headers || {}))
  }
  
  async json() {
    return JSON.parse(this.body || '{}')
  }
  
  // Static method for NextResponse.json
  static json(data, init = {}) {
    return new Response(JSON.stringify(data), {
      status: init.status || 200,
      statusText: init.statusText || 'OK',
      headers: {
        'Content-Type': 'application/json',
        ...init.headers
      }
    })
  }
}

global.Headers = class Headers {
  constructor(init) {
    this.map = new Map(Object.entries(init || {}))
  }
  
  get(name) {
    return this.map.get(name.toLowerCase())
  }
  
  set(name, value) {
    this.map.set(name.toLowerCase(), value)
  }
  
  append(name, value) {
    const existing = this.map.get(name.toLowerCase())
    if (existing) {
      this.map.set(name.toLowerCase(), existing + ', ' + value)
    } else {
      this.map.set(name.toLowerCase(), value)
    }
  }
  
  has(name) {
    return this.map.has(name.toLowerCase())
  }
  
  delete(name) {
    this.map.delete(name.toLowerCase())
  }
  
  entries() {
    return this.map.entries()
  }
  
  keys() {
    return this.map.keys()
  }
  
  values() {
    return this.map.values()
  }
}

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Next.js cookies
jest.mock('next/headers', () => ({
  cookies: () => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  }),
}))

// Mock Prisma - 使用動態 mock
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  company: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  payrollSlip: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  payrollItem: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}

// Mock the Prisma client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}))

// Mock the db module
jest.mock('@/lib/db', () => ({
  __esModule: true,
  default: mockPrisma,
}))

// Mock authentication
jest.mock('@/lib/auth', () => ({
  verifyToken: jest.fn(),
  generateToken: jest.fn(),
  authenticateUser: jest.fn(),
  createUser: jest.fn(),
}))

// Mock environment variables
process.env.JWT_SECRET = 'test-secret-key'
process.env.NODE_ENV = 'test'

// Global test utilities
global.testUtils = {
  createMockUser: () => ({
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedpassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  
  createMockCompany: () => ({
    id: 1,
    userId: 1,
    name: 'Test Company',
    industry: 'Technology',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  
  createMockPayrollSlip: () => ({
    id: 1,
    userId: 1,
    companyId: 1,
    period: '2024-01',
    totalIncome: 500000,
    totalDeductions: 100000,
    netIncome: 400000,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  
  createMockPayrollItem: () => ({
    id: 1,
    payrollSlipId: 1,
    itemType: 'income',
    itemName: '基本薪資',
    amount: 400000,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
}

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks()
})
