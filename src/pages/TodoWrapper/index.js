import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { TodoForm } from "../../components/TodoForm";
import { Todo } from "../../components/Todo";
import { EditTodoForm } from "../../components/EditTodoForm";

export const TodoWrapper = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || process.env.DATABASE_URL;

    // 載入待辦事項
    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/todos?userId=${user.id}`,
                    {
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setTodos(
                    data.map((todo) => ({
                        ...todo,
                        isEditing: false,
                    }))
                );
            } catch (err) {
                setError(`無法載入待辦事項: ${err.message}`);
                console.log('Current API URL:', process.env.REACT_APP_API_BASE_URL);
                console.error("獲取待辦事項失敗:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) {
            fetchTodos();
        }
    }, [user?.id]);

    // 處理登出
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // 新增待辦事項
    const addTodo = async (task) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/todos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    userId: user.id,
                    task,
                }),
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error(`預期接收 JSON 格式，但收到 ${contentType}`);
            }

            if (!response.ok) {
                const error = await response.text();
                throw new Error(
                    `HTTP error! status: ${response.status}, message: ${error}`
                );
            }

            const newTodo = await response.json();
            setTodos([...todos, { ...newTodo, isEditing: false }]);
        } catch (err) {
            setError(`新增待辦事項失敗: ${err.message}`);
            console.error("新增待辦事項失敗:", err);
        }
    };

    // 切換完成狀態
    const toggleComplete = async (id) => {
        try {
            const todo = todos.find((t) => t.id === id);
            const response = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    task: todo.task,
                    completed: !todo.completed,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update todo");
            }

            const updatedTodo = await response.json();
            setTodos(
                todos.map((todo) =>
                    todo.id === id ? { ...updatedTodo, isEditing: false } : todo
                )
            );
        } catch (err) {
            setError("更新待辦事項失敗");
            console.error("更新待辦事項失敗:", err);
        }
    };

    // 刪除待辦事項
    const deleteTodo = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete todo");
            }

            setTodos(todos.filter((todo) => todo.id !== id));
        } catch (err) {
            setError("刪除待辦事項失敗");
            console.error("刪除待辦事項失敗:", err);
        }
    };

    // 進入編輯模式
    const editTodo = (id) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
            )
        );
    };

    // 更新待辦事項內容
    const editTask = async (task, id) => {
        try {
            const todo = todos.find((t) => t.id === id);
            const response = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    task,
                    completed: todo.completed,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update todo");
            }

            const updatedTodo = await response.json();
            setTodos(
                todos.map((todo) =>
                    todo.id === id ? { ...updatedTodo, isEditing: false } : todo
                )
            );
        } catch (err) {
            setError("更新待辦事項失敗");
            console.error("更新待辦事項失敗:", err);
        }
    };

    if (loading) {
        return <div>載入中...</div>;
    }

    return (
        <div className="TodoWrapper">
            <div className="header-container">
                <h1>待辦清單</h1>
                <button
                    onClick={handleLogout}
                    className="logout-button"
                    onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#c0392b")
                    }
                    onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#e74c3c")
                    }>
                    登出
                </button>
            </div>
            {error && <div className="error-message">{error}</div>}
            <TodoForm addTodo={addTodo} />
            {todos.map((todo) =>
                todo.isEditing ? (
                    <EditTodoForm
                        key={todo.id}
                        editTodo={editTask}
                        task={todo}
                    />
                ) : (
                    <Todo
                        key={todo.id}
                        task={todo}
                        toggleComplete={toggleComplete}
                        deleteTodo={deleteTodo}
                        editTodo={editTodo}
                    />
                )
            )}
        </div>
    );
};
