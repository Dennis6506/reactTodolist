import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import React from "react";

export const Todo = ({ task, toggleComplete, deleteTodo, editTodo }) => {
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${month}/${day}`;
  };

  return (
    <div className="Todo">
      <div className="todo-content">
        <p
          className={`task-text ${task.completed ? "completed" : "incompleted"}`}
          onClick={() => toggleComplete(task.id)}
        >
          {task.task}
        </p>
        <div className="todo-actions">
          <span className="update-time">
            更新：{formatDate(task.updatedAt)}
          </span>
          <div className="icons">
            <FontAwesomeIcon 
              icon={faPenToSquare} 
              onClick={() => editTodo(task.id)}
            />
            <FontAwesomeIcon 
              icon={faTrash} 
              onClick={() => deleteTodo(task.id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};