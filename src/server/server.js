const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const pool = require("./db");
require("dotenv").config();

const app = express();
app.options("*", cors());

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use(express.json());

// 測試路由放在前面
app.get("/test", (req, res) => {
    res.json({ message: "Server is working!" });
});

app.get("/test-db", async (req, res) => {
    try {
        const [rows] = await pool.execute("SELECT 1");
        res.json({ message: "資料庫連線成功", data: rows });
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
        console.log("收到登入請求:", { username, password });

        const [users] = await pool.execute(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );
        console.log("查詢到的使用者:", users);

        if (users.length === 0) {
            console.log("找不到使用者");
            return res.status(401).json({ message: "使用者名稱或密碼錯誤" });
        }

        const user = users[0];
        console.log("資料庫中的密碼:", user.password);
        console.log("使用者輸入的密碼:", password);

        const isValid = await bcrypt.compare(password, user.password);
        console.log("密碼比對結果:", isValid);

        if (!isValid) {
            console.log("密碼不正確");
            return res.status(401).json({ message: "使用者名稱或密碼錯誤" });
        }

        console.log("登入成功");
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

        await pool.execute(
            "INSERT INTO users (username, password) VALUES ($1, $2)",
            [username, hashedPassword]
        );

        res.status(201).json({ message: "註冊成功" });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "使用者名稱已存在" });
        }
        console.error(error);
        res.status(500).json({ message: "伺服器錯誤" });
    }
});

// 獲取指定用戶的所有待辦事項
app.get("/api/todos", async (req, res) => {
    try {
        const userId = req.query.userId;
        console.log("Fetching todos for user:", userId); // 添加日誌

        const [todos] = await pool.execute(
            "SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC",
            [userId]
        );

        console.log("Found todos:", todos); // 添加日誌
        res.json(todos); // 確保使用 res.json()
    } catch (error) {
        console.error("獲取待辦事項失敗:", error);
        res.status(500).json({ message: "伺服器錯誤" });
    }
});

// 創建新的待辦事項
app.post("/api/todos", async (req, res) => {
    try {
        const { userId, task } = req.body;
        const id = require("uuid").v4(); // 生成 UUID

        await pool.execute(
            "INSERT INTO todos (id, user_id, task) VALUES ($1, $2, $3)",
            [id, userId, task]
        );

        const [newTodo] = await pool.execute(
            "SELECT * FROM todos WHERE id = $1",
            [id]
        );

        res.status(201).json(newTodo[0]);
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

        await pool.execute(
            "UPDATE todos SET task = $1, completed = $2 WHERE id = $3",
            [task, completed, id]
        );

        const [updatedTodo] = await pool.execute(
            "SELECT * FROM todos WHERE id = $1",
            [id]
        );

        if (updatedTodo.length === 0) {
            return res.status(404).json({ message: "找不到該待辦事項" });
        }

        res.json(updatedTodo[0]);
    } catch (error) {
        console.error("更新待辦事項失敗:", error);
        res.status(500).json({ message: "伺服器錯誤" });
    }
});

// 刪除待辦事項
app.delete("/api/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.execute("DELETE FROM todos WHERE id = $1", [
            id,
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "找不到該待辦事項" });
        }

        res.json({ message: "成功刪除待辦事項" });
    } catch (error) {
        console.error("刪除待辦事項失敗:", error);
        res.status(500).json({ message: "伺服器錯誤" });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`伺服器運行在 port ${PORT}`);
});
