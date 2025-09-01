export default function handler(req, res) {
  const systemStatus = {
    timestamp: new Date().toISOString(),
    services: {
      backend: 'operational',
      database: 'operational',
      fileUpload: 'operational'
    },
    performance: {
      responseTime: 'normal',
      uptime: process.uptime ? process.uptime() : 0
    },
    recentIssues: []
  };

  res.status(200).json(systemStatus);
}
