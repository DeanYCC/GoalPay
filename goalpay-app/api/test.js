export default function handler(req, res) {
  // 設置CORS頭
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 處理OPTIONS請求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 只允許GET請求
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // 簡單的測試響應
  const testResponse = {
    message: '測試API正常工作',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    headers: req.headers,
    environment: process.env.NODE_ENV || 'development',
    vercel: {
      region: process.env.VERCEL_REGION || 'unknown',
      function: process.env.VERCEL_FUNCTION_NAME || 'unknown',
      deployment: process.env.VERCEL_DEPLOYMENT_ID || 'unknown'
    }
  };

  res.status(200).json(testResponse);
}
