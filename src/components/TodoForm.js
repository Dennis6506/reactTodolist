import React, { useState } from "react";

export const TodoForm = ({ addTodo }) => {
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    
    setIsSubmitting(true);
    try {
      await addTodo(value);
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
        placeholder="今天的工作是什麼?"
        onChange={(e) => setValue(e.target.value)}
        disabled={isSubmitting}
      />
      <button type="submit" className="todo-btn" disabled={isSubmitting}>
        {isSubmitting ? '新增中...' : '新增工作'}
      </button>
    </form>
  );
};