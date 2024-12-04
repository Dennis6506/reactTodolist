const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });  // 明確指定 .env 檔案路徑

// 診斷印出
console.log('Current working directory:', process.cwd());
console.log('Environment variables loaded:', {
    DATABASE_URL: process.env.DATABASE_URL ? 'Found (hidden)' : 'Not found',
    NODE_ENV: process.env.NODE_ENV
});

// 確保連接配置正確
const config = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
};

console.log('Connection config (without sensitive data):', {
    ...config,
    connectionString: config.connectionString ? 'Found (hidden)' : 'Not found'
});

const pool = new Pool(config);

// 添加更多錯誤處理
pool.on('error', (err) => {
    console.error('Unexpected database error:', err);
});

// 測試連接
async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('Successfully connected to database');
        client.release();
    } catch (err) {
        console.error('Database connection error:', {
            message: err.message,
            code: err.code,
            stack: err.stack
        });
    }
}

testConnection();

module.exports = pool;