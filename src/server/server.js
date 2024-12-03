const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const pool = require('./db');  // 引入資料庫配置
require('dotenv').config();

const app = express();
app.options('*', cors())

// 設定詳細的 CORS 選項
app.use(cors({
    origin: '*', // 允許所有來源
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// 登入 API
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const [users] = await pool.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: '使用者名稱或密碼錯誤' });
        }

        const user = users[0];
        const isValid = await bcrypt.compare(password, user.password);
        
        if (!isValid) {
            return res.status(401).json({ message: '使用者名稱或密碼錯誤' });
        }

        res.json({
            id: user.id,
            username: user.username
        });
    } catch (error) {
        console.error(error);
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

app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});