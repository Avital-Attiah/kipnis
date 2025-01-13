import React, { useState } from 'react';

const TodoItem = ({ todo, index, setTodos, setFilteredTodos }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTodo, setEditingTodo] = useState(todo);

  const handleUpdateTodo = (updatedTodo) => {
    fetch(`http://localhost:3001/todos/${updatedTodo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTodo),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // עדכון המצב כך שה-React ירנדר מחדש
        setTodos((prevTodos) =>
          prevTodos.map((t) => (t.id === data.id ? data : t))
        );
        setFilteredTodos((prevFilteredTodos) =>
          prevFilteredTodos.map((t) => (t.id === data.id ? data : t))
        );
        setIsEditing(false); // סיום מצב העריכה
      })
      .catch((error) => {
        console.error('Error updating todo:', error);
      });
  };
  
  const handleCompleteTodo = (todo) => {
    if (!todo.id) {
      console.error('Invalid todo ID:', todo);
      return;
    }
  
    const updatedTodo = { ...todo, completed: !todo.completed };
    handleUpdateTodo(updatedTodo);
  };
  
  const handleEditTodo = () => {
    setIsEditing(true);
  };
  
  const handleSaveEditTodo = () => {
    handleUpdateTodo(editingTodo); // עדכון ה-TODO עם הערך החדש
  };
  

  const handleDeleteTodo = () => {
    fetch(`http://localhost:3001/todos/${todo.id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
        setFilteredTodos((prevFilteredTodos) =>
          prevFilteredTodos.filter((t) => t.id !== todo.id)
        );
      })
      .catch((error) => {
        console.error('Error deleting todo:', error);
      });
  };

  
  return (
    <li className="todo-item">
    {index + 1}. {isEditing ? (
      <input
        type="text"
        value={editingTodo.title}
        onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
      />
    ) : (
      <span className={todo.completed ? 'completed' : ''}>{todo.title}</span>
    )}
  
    <button
      className="edit-btn"
      onClick={isEditing ? handleSaveEditTodo : handleEditTodo}
    >
      {isEditing ? 'עדכן' : 'ערוך'}
    </button>
    <button className="delete-btn" onClick={handleDeleteTodo}>מחק</button>
  
    {/* CheckBox for completed task */}
    <label className="complete-checkbox">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => handleCompleteTodo(todo)}
      />
      {todo.completed ? '✔' : ''}
    </label>
  </li>
  
  );
};

export default TodoItem;
