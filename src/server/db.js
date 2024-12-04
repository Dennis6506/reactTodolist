const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // 在開發環境中可能需要
  }
});

// 測試資料庫連線
pool.connect()
  .then(client => {
    console.log('成功連接到 PostgreSQL 資料庫');
    client.release();
  })
  .catch(err => {
    console.error('無法連接到資料庫:', err);
  });

module.exports = pool;