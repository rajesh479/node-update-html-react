import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../api/todoApi';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await getTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch todos. Please try again.');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (text) => {
    try {
      const newTodo = await createTodo(text);
      setTodos([...todos, newTodo]);
      setError(null);
    } catch (err) {
      setError('Failed to add todo. Please try again.');
      console.error('Error adding todo:', err);
    }
  };

  const handleToggleTodo = async (id) => {
    try {
      const todo = todos.find(t => t.id === id);
      const updatedTodo = await updateTodo(id, { completed: !todo.completed });
      setTodos(todos.map(t => t.id === id ? updatedTodo : t));
      setError(null);
    } catch (err) {
      setError('Failed to update todo. Please try again.');
      console.error('Error updating todo:', err);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(t => t.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete todo. Please try again.');
      console.error('Error deleting todo:', err);
    }
  };

  const handleEditTodo = async (id, newText) => {
    try {
      const updatedTodo = await updateTodo(id, { text: newText });
      setTodos(todos.map(t => t.id === id ? updatedTodo : t));
      setError(null);
    } catch (err) {
      setError('Failed to edit todo. Please try again.');
      console.error('Error editing todo:', err);
    }
  };

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;

  return (
    <div className="todo-app">
      <div className="stats">
        <span>{completedCount} of {totalCount} completed</span>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="close-btn">×</button>
        </div>
      )}

      <TodoForm onAddTodo={handleAddTodo} />

      {loading ? (
        <div className="loading">Loading todos...</div>
      ) : (
        <TodoList
          todos={todos}
          onToggleTodo={handleToggleTodo}
          onDeleteTodo={handleDeleteTodo}
          onEditTodo={handleEditTodo}
        />
      )}

      {!loading && todos.length === 0 && (
        <div className="empty-state">
          <p>No todos yet. Add one above to get started!</p>
        </div>
      )}
    </div>
  );
}

export default TodoApp;
