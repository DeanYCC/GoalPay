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

  // 診斷信息
  const diagnosticInfo = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    headers: req.headers,
    environment: process.env.NODE_ENV || 'development',
    vercel: {
      region: process.env.VERCEL_REGION,
      function: process.env.VERCEL_FUNCTION_NAME,
      deployment: process.env.VERCEL_DEPLOYMENT_ID
    },
    message: 'API診斷端點正常工作'
  };

  res.status(200).json(diagnosticInfo);
}
