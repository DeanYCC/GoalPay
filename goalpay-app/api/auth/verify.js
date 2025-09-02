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
      message: '模擬驗證成功'
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
