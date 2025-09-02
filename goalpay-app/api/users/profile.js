export default function handler(req, res) {
  if (req.method === 'GET') {
    // 模擬用戶資料
    const mockProfile = {
      id: 'user-123',
      email: 'test@goalpay.com',
      name: '測試用戶',
      avatar: 'https://via.placeholder.com/150',
      role: 'user',
      preferences: {
        language: 'zh',
        theme: 'light',
        notifications: true
      },
      settings: {
        paydayType: 'month_end',
        customPayday: 25,
        periodStartDay: 1,
        periodEndDay: 31
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    res.status(200).json(mockProfile);
  } else if (req.method === 'PUT') {
    // 模擬更新用戶資料
    const updatedProfile = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      user: updatedProfile,
      message: '用戶資料更新成功'
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
