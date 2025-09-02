export default function handler(req, res) {
  if (req.method === 'GET') {
    // 模擬用戶驗證
    const mockUser = {
      id: 'user-123',
      email: 'test@goalpay.com',
      name: '測試用戶',
      avatar: 'https://via.placeholder.com/150',
      isAuthenticated: true,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      user: mockUser,
      message: '模擬登入成功'
    });
  } else if (req.method === 'POST') {
    // 模擬登入
    const { email, password } = req.body;
    
    // 簡單的模擬驗證
    if (email && password) {
      const mockUser = {
        id: 'user-123',
        email: email,
        name: '測試用戶',
        avatar: 'https://via.placeholder.com/150',
        isAuthenticated: true,
        role: 'user',
        createdAt: new Date().toISOString()
      };

      res.status(200).json({
        success: true,
        user: mockUser,
        token: 'mock-jwt-token-' + Date.now(),
        message: '模擬登入成功'
      });
    } else {
      res.status(400).json({
        success: false,
        message: '請提供有效的電子郵件和密碼'
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
