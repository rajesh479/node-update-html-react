import React, { useState } from 'react';

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editText.trim() && editText !== todo.text) {
      onEdit(editText);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="edit-form">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="edit-input"
            autoFocus
          />
          <div className="edit-buttons">
            <button type="submit" className="save-btn">Save</button>
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="todo-content">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={onToggle}
              className="checkbox"
            />
            <span className="todo-text">{todo.text}</span>
          </div>
          <div className="todo-actions">
            <button onClick={() => setIsEditing(true)} className="edit-btn">
              Edit
            </button>
            <button onClick={onDelete} className="delete-btn">
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}

export default TodoItem;
