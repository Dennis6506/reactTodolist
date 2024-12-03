import React, { useState, useEffect } from "react";
import { TodoForm } from "../../components/TodoForm";
import { v4 as uuidv4 } from "uuid";
import { Todo } from "../../components/Todo";
import { EditTodoForm } from "../../components/EditTodoForm";
uuidv4();

export const TodoWrapper = () => {
  // 從 localStorage 讀取初始數據，如果沒有則使用空數組
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos);
      // 確保從 localStorage 讀取的時間是 Date 對象
      return parsedTodos.map(todo => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt)
      }));
    }
    return [];
  });

  // 當 todos 改變時，將數據保存到 localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (todo) => {
    const now = new Date();
    setTodos([
      ...todos,
      { 
        id: uuidv4(), 
        task: todo, 
        completed: false, 
        isEditing: false,
        updatedAt: now
      },
    ]);
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { 
          ...todo, 
          completed: !todo.completed,
          updatedAt: new Date()
        } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { 
          ...todo, 
          isEditing: !todo.isEditing
        } : todo
      )
    );
  };

  const editTask = (task, id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { 
          ...todo, 
          task: task, 
          isEditing: false,
          updatedAt: new Date()
        } : todo
      )
    );
  };

  return (
    <div className="TodoWrapper">
      <h1>代辦清單</h1>
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