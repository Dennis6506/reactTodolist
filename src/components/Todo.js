import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";

export const Todo = ({ task, toggleComplete, deleteTodo, editTodo }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    
    return `${month}/${day} ${hours}:${minutes}`;
  };

  const handleToggleComplete = async () => {
    if (isToggling) return;
    setIsToggling(true);
    try {
      await toggleComplete(task.id);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteTodo(task.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="Todo">
      <div className="todo-content">
        <p
          className={`task-text ${task.completed ? "completed" : "incompleted"} ${isToggling ? "updating" : ""}`}
          onClick={handleToggleComplete}
        >
          {task.task}
        </p>
        <div className="todo-actions">
          <span className="update-time">
            更新：{formatDate(task.updated_at)}
          </span>
          <div className="icons">
            <FontAwesomeIcon 
              icon={faPenToSquare} 
              onClick={() => editTodo(task.id)}
              style={{ opacity: isDeleting ? 0.5 : 1 }}
            />
            <FontAwesomeIcon 
              icon={faTrash} 
              onClick={handleDelete}
              style={{ opacity: isDeleting ? 0.5 : 1 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};