const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const pool = require('./db');  // 引入資料庫配置
require('dotenv').config();

const app = express();
app.options('*', cors())

app.use(cors());

app.use(express.json());

// 測試路由放在前面
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT 1');
        res.json({ message: '資料庫連線成功', data: rows });
    } catch (error) {
        res.status(500).json({ message: '資料庫連線失敗', error: error.message });
    }
});

// 登入 API
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('收到登入請求:', { username, password });

        const [users] = await pool.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        console.log('查詢到的使用者:', users);

        if (users.length === 0) {
            console.log('找不到使用者');
            return res.status(401).json({ message: '使用者名稱或密碼錯誤' });
        }

        const user = users[0];
        console.log('資料庫中的密碼:', user.password);
        console.log('使用者輸入的密碼:', password);

        const isValid = await bcrypt.compare(password, user.password);
        console.log('密碼比對結果:', isValid);
        
        if (!isValid) {
            console.log('密碼不正確');
            return res.status(401).json({ message: '使用者名稱或密碼錯誤' });
        }

        console.log('登入成功');
        res.json({
            id: user.id,
            username: user.username
        });
    } catch (error) {
        console.error('登入過程發生錯誤:', error);
        res.status(500).json({ message: '伺服器錯誤' });
    }
});

// 註冊 API
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await pool.execute(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );

        res.status(201).json({ message: '註冊成功' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: '使用者名稱已存在' });
        }
        console.error(error);
        res.status(500).json({ message: '伺服器錯誤' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`伺服器運行在 port ${PORT}`);
});
