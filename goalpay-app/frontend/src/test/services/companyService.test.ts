import { describe, it, expect, vi } from 'vitest'

// Mock localStorage utility
vi.mock('../../utils/storage', () => ({
  getAuthToken: vi.fn(() => 'mock-token'),
}))

// Mock the API configuration
vi.mock('../../config/api', () => ({
  API_ENDPOINTS: {
    COMPANIES: {
      LIST: '/api/companies',
      CREATE: '/api/companies',
    },
  },
}))

// Now import the service after mocking
import { payrollCalculations } from '../../services/companyService'

describe('Payroll Calculations', () => {
  describe('calculateTotalIncome', () => {
    it('should calculate total income correctly', () => {
      const items = [
        { item_type: 'income', amount: 400000 },
        { item_type: 'deduction', amount: 45000 },
        { item_type: 'income', amount: 100000 },
      ]

      const result = payrollCalculations.calculateTotalIncome(items)
      expect(result).toBe(500000)
    })

    it('should return 0 for empty items', () => {
      const result = payrollCalculations.calculateTotalIncome([])
      expect(result).toBe(0)
    })
  })

  describe('calculateTotalDeductions', () => {
    it('should calculate total deductions correctly', () => {
      const items = [
        { item_type: 'income', amount: 400000 },
        { item_type: 'deduction', amount: 45000 },
        { item_type: 'deduction', amount: 5000 },
      ]

      const result = payrollCalculations.calculateTotalDeductions(items)
      expect(result).toBe(50000)
    })

    it('should return 0 for no deductions', () => {
      const items = [
        { item_type: 'income', amount: 400000 },
      ]

      const result = payrollCalculations.calculateTotalDeductions(items)
      expect(result).toBe(0)
    })
  })

  describe('calculateNetIncome', () => {
    it('should calculate net income correctly', () => {
      const items = [
        { item_type: 'income', amount: 400000 },
        { item_type: 'deduction', amount: 45000 },
      ]

      const result = payrollCalculations.calculateNetIncome(items)
      expect(result).toBe(355000)
    })

    it('should handle negative net income', () => {
      const items = [
        { item_type: 'income', amount: 100000 },
        { item_type: 'deduction', amount: 150000 },
      ]

      const result = payrollCalculations.calculateNetIncome(items)
      expect(result).toBe(-50000)
    })
  })

  describe('validatePayrollData', () => {
    it('should validate correct payroll data', () => {
      const payroll = {
        companyId: 1,
        period: '2024-01',
        items: [
          { item_type: 'income', amount: 500000 },
          { item_type: 'deduction', amount: 50000 }
        ],
        netIncome: 450000
      }

      const result = payrollCalculations.validatePayrollData(payroll)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect missing items array', () => {
      const payroll = {
        companyId: 1,
        period: '2024-01',
        netIncome: 450000
      }

      const result = payrollCalculations.validatePayrollData(payroll)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('薪資項目數據格式錯誤')
    })

    it('should detect missing netIncome', () => {
      const payroll = {
        companyId: 1,
        period: '2024-01',
        items: [
          { item_type: 'income', amount: 500000 },
          { item_type: 'deduction', amount: 50000 }
        ]
      }

      const result = payrollCalculations.validatePayrollData(payroll)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('淨收入數據缺失')
    })

    it('should detect netIncome calculation mismatch', () => {
      const payroll = {
        companyId: 1,
        period: '2024-01',
        items: [
          { item_type: 'income', amount: 500000 },
          { item_type: 'deduction', amount: 50000 }
        ],
        netIncome: 400000 // Wrong calculation
      }

      const result = payrollCalculations.validatePayrollData(payroll)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('淨收入計算不匹配: 計算值 450000, 實際值 400000')
    })

    it('should handle zero netIncome', () => {
      const payroll = {
        companyId: 1,
        period: '2024-01',
        items: [
          { item_type: 'income', amount: 50000 },
          { item_type: 'deduction', amount: 50000 }
        ],
        netIncome: 0
      }

      const result = payrollCalculations.validatePayrollData(payroll)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should handle empty items array', () => {
      const payroll = {
        companyId: 1,
        period: '2024-01',
        items: [],
        netIncome: 0
      }

      const result = payrollCalculations.validatePayrollData(payroll)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  describe('runTests', () => {
    it('should run tests without errors', () => {
      // Mock console.log to avoid test output
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      payrollCalculations.runTests()
      
      expect(consoleSpy).toHaveBeenCalledWith('🧪 開始執行薪資計算測試...')
      
      consoleSpy.mockRestore()
    })
  })
})