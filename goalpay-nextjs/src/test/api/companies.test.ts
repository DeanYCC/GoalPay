import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/companies/route'
import { verifyToken } from '@/lib/auth'
import prisma from '@/lib/db'

// Mock the dependencies
jest.mock('@/lib/auth')
jest.mock('@/lib/db')

describe('/api/companies', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('should return user companies when authenticated', async () => {
      const mockUser = global.testUtils.createMockUser()
      const mockCompanies = [
        global.testUtils.createMockCompany(),
        { ...global.testUtils.createMockCompany(), id: 2, name: 'Company 2' },
      ]
      const mockPayload = { userId: mockUser.id, email: mockUser.email }

      verifyToken.mockReturnValue(mockPayload)
      prisma.company.findMany.mockResolvedValue(mockCompanies)

      const request = new NextRequest('http://localhost:3000/api/companies', {
        method: 'GET',
        headers: {
          Cookie: 'token=mock-token',
        },
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.companies).toEqual(mockCompanies)
      expect(prisma.company.findMany).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
        orderBy: { createdAt: 'desc' },
      })
    })

    it('should return 401 when not authenticated', async () => {
      const request = new NextRequest('http://localhost:3000/api/companies', {
        method: 'GET',
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 500 for server error', async () => {
      const mockPayload = { userId: 1, email: 'test@example.com' }

      verifyToken.mockReturnValue(mockPayload)
      prisma.company.findMany.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/companies', {
        method: 'GET',
        headers: {
          Cookie: 'token=mock-token',
        },
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })
  })

  describe('POST', () => {
    it('should create new company when authenticated', async () => {
      const mockUser = global.testUtils.createMockUser()
      const mockCompany = global.testUtils.createMockCompany()
      const mockPayload = { userId: mockUser.id, email: mockUser.email }

      verifyToken.mockReturnValue(mockPayload)
      prisma.company.create.mockResolvedValue(mockCompany)

      const request = new NextRequest('http://localhost:3000/api/companies', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test Company',
          industry: 'Technology',
        }),
        headers: {
          'Content-Type': 'application/json',
          Cookie: 'token=mock-token',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.company).toEqual(mockCompany)
      expect(prisma.company.create).toHaveBeenCalledWith({
        data: {
          name: 'Test Company',
          industry: 'Technology',
          userId: mockUser.id,
        },
      })
    })

    it('should return 400 for missing required fields', async () => {
      const mockPayload = { userId: 1, email: 'test@example.com' }

      verifyToken.mockReturnValue(mockPayload)

      const request = new NextRequest('http://localhost:3000/api/companies', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test Company',
          // Missing industry
        }),
        headers: {
          'Content-Type': 'application/json',
          Cookie: 'token=mock-token',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Name and industry are required')
    })

    it('should return 401 when not authenticated', async () => {
      const request = new NextRequest('http://localhost:3000/api/companies', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test Company',
          industry: 'Technology',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })
  })
})
