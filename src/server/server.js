const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const pool = require("./db");
require("dotenv").config();

const app = express();

// CORS 設定
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://react-todolist-theta-peach.vercel.app']
        : ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// 應用全局中間件
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 測試路由
app.get("/test", (req, res) => {
    res.json({ message: "Server is working!" });
});

// 測試數據庫連接
app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT 1");
        res.json({ message: "資料庫連線成功", data: result.rows });
    } catch (error) {
        res.status(500).json({
            message: "資料庫連線失敗",
            error: error.message,
        });
    }
});

// 登入 API
app.post("/api/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("收到登入請求:", { username });

        const result = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "使用者名稱或密碼錯誤" });
        }

        const user = result.rows[0];
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.status(401).json({ message: "使用者名稱或密碼錯誤" });
        }

        res.json({
            id: user.id,
            username: user.username,
        });
    } catch (error) {
        console.error("登入過程發生錯誤:", error);
        res.status(500).json({ message: "伺服器錯誤" });
    }
});

// 註冊 API
app.post("/api/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
            [username, hashedPassword]
        );

        res.status(201).json({ message: "註冊成功" });
    } catch (error) {
        console.error("註冊錯誤:", error);

        if (error.code === '23505') {
            return res.status(400).json({ message: "使用者名稱已存在" });
        }
        res.status(500).json({ 
            message: "伺服器錯誤",
            detail: error.message
        });
    }
});

// 獲取待辦事項列表
app.get("/api/todos", async (req, res) => {
    try {
        const userId = req.query.userId;
        const result = await pool.query(
            "SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC",
            [userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("獲取待辦事項失敗:", error);
        res.status(500).json({ message: "伺服器錯誤" });
    }
});

// 創建待辦事項
app.post("/api/todos", async (req, res) => {
    try {
        const { userId, task } = req.body;
        const id = require("uuid").v4();

        const result = await pool.query(
            "INSERT INTO todos (id, user_id, task) VALUES ($1, $2, $3) RETURNING *",
            [id, userId, task]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("創建待辦事項失敗:", error);
        res.status(500).json({ message: "伺服器錯誤" });
    }
});

// 更新待辦事項
app.put("/api/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { task, completed } = req.body;

        const result = await pool.query(
            "UPDATE todos SET task = $1, completed = $2 WHERE id = $3 RETURNING *",
            [task, completed, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "找不到該待辦事項" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("更新待辦事項失敗:", error);
        res.status(500).json({ message: "伺服器錯誤" });
    }
});

// 刪除待辦事項
app.delete("/api/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM todos WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "找不到該待辦事項" });
        }

        res.json({ message: "成功刪除待辦事項" });
    } catch (error) {
        console.error("刪除待辦事項失敗:", error);
        res.status(500).json({ message: "伺服器錯誤" });
    }
});

// 啟動服務器
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`伺服器運行在 port ${PORT}`);
});