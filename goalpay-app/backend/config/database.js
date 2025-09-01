const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// 測試連接
pool.on('connect', () => {
  console.log('✅ 數據庫連接成功');
});

pool.on('error', (err) => {
  console.error('❌ 數據庫連接錯誤:', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
