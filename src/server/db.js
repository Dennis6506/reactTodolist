const mysql = require('mysql2/promise');

// 建立連線池
const pool = mysql.createPool({
    host: 'localhost',
    user: 'admin',
    password: '12345',
    database: 'todo_app',
    waitForConnections: true,
    connectionLimit: 10,  // 最大連線數
    queueLimit: 0
});

// 測試資料庫連線
pool.getConnection()
    .then(connection => {
        console.log('成功連接到 MySQL 資料庫');
        connection.release();
    })
    .catch(err => {
        console.error('無法連接到資料庫:', err);
    });

module.exports = pool;