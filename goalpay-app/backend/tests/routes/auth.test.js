const request = require('supertest');
const express = require('express');
const authRoutes = require('../../routes/auth');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  describe('GET /api/auth/google', () => {
    it('should redirect to Google OAuth', async () => {
      const response = await request(app)
        .get('/api/auth/google')
        .expect(302);
      
      expect(response.headers.location).toContain('accounts.google.com');
    });
  });

  describe('GET /api/auth/google/callback', () => {
    it('should handle OAuth callback', async () => {
      // Mock successful OAuth callback
      const response = await request(app)
        .get('/api/auth/google/callback')
        .query({ code: 'test-code' })
        .expect(302);
      
      // Should redirect to frontend
      expect(response.headers.location).toContain('http://localhost:3001');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user info when authenticated', async () => {
      // Mock authenticated user
      const mockUser = global.testUtils.createMockUser();
      
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);
      
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(mockUser.email);
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);
      
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(200);
      
      expect(response.body).toHaveProperty('message', 'Logged out successfully');
    });
  });
});
