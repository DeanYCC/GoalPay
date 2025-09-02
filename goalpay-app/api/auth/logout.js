export default function handler(req, res) {
  if (req.method === 'POST') {
    // 模擬登出
    res.status(200).json({
      success: true,
      message: '模擬登出成功'
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
