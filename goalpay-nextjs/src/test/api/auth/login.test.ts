import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/auth/login/route'
import { verifyToken, generateToken, authenticateUser } from '@/lib/auth'

// Mock the auth module
jest.mock('@/lib/auth')

describe('/api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUser = global.testUtils.createMockUser()
      const mockToken = 'mock-jwt-token'

      authenticateUser.mockResolvedValue(mockUser)
      generateToken.mockReturnValue(mockToken)

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('Login successful')
      expect(data.user.email).toBe('test@example.com')
      expect(authenticateUser).toHaveBeenCalledWith('test@example.com', 'password123')
      expect(generateToken).toHaveBeenCalledWith({
        userId: mockUser.id,
        email: mockUser.email,
      })
    })

    it('should return 400 for missing email', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          password: 'password123',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Email and password are required')
    })

    it('should return 400 for missing password', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Email and password are required')
    })

    it('should return 401 for invalid credentials', async () => {
      authenticateUser.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'wrongpassword',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Invalid email or password')
    })

    it('should return 500 for server error', async () => {
      authenticateUser.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })
  })
})
