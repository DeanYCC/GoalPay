import { NextRequest } from 'next/server'
import { GET } from '@/app/api/auth/me/route'
import { verifyToken } from '@/lib/auth'
import prisma from '@/lib/db'

// Mock the dependencies
jest.mock('@/lib/auth')
jest.mock('@/lib/db')

describe('/api/auth/me', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('should return user info when authenticated', async () => {
      const mockUser = global.testUtils.createMockUser()
      const mockPayload = { userId: mockUser.id, email: mockUser.email }

      verifyToken.mockReturnValue(mockPayload)
      prisma.user.findUnique.mockResolvedValue(mockUser)

      const request = new NextRequest('http://localhost:3000/api/auth/me', {
        method: 'GET',
        headers: {
          Cookie: 'token=mock-token',
        },
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.user).toEqual(mockUser)
      expect(verifyToken).toHaveBeenCalledWith('mock-token')
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      })
    })

    it('should return 401 when no token provided', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/me', {
        method: 'GET',
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Authentication required')
    })

    it('should return 401 when token is invalid', async () => {
      verifyToken.mockReturnValue(null)

      const request = new NextRequest('http://localhost:3000/api/auth/me', {
        method: 'GET',
        headers: {
          Cookie: 'token=invalid-token',
        },
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Invalid token')
    })

    it('should return 404 when user not found', async () => {
      const mockPayload = { userId: 999, email: 'nonexistent@example.com' }

      verifyToken.mockReturnValue(mockPayload)
      prisma.user.findUnique.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/auth/me', {
        method: 'GET',
        headers: {
          Cookie: 'token=mock-token',
        },
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('User not found')
    })

    it('should return 500 for server error', async () => {
      const mockPayload = { userId: 1, email: 'test@example.com' }

      verifyToken.mockReturnValue(mockPayload)
      prisma.user.findUnique.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/auth/me', {
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
})
