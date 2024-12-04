import React, { useState } from "react";

export const EditTodoForm = ({ editTodo, task }) => {
  const [value, setValue] = useState(task.task);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await editTodo(value, task.id);
      setValue("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="TodoForm" onSubmit={handleSubmit}>
      <input
        type="text"
        className="todo-input"
        value={value}
        placeholder="更新工作內容"
        onChange={(e) => setValue(e.target.value)}
        disabled={isSubmitting}
      />
      <button type="submit" className="todo-btn" disabled={isSubmitting}>
        {isSubmitting ? '更新中...' : '更新'}
      </button>
    </form>
  );
};