import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/todoStyle.css';

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ userId: 1, id: '', title: '', completed: false });
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();
  const userId = 1;

  useEffect(() => {
    fetch(`http://localhost:3001/todos?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setTodos(data);
        setFilteredTodos(data);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, [userId]);

  useEffect(() => {
    let filteredTodosList = todos;

    if (searchQuery) {
      filteredTodosList = filteredTodosList.filter((todo) =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.id.toString().includes(searchQuery) ||
        todo.completed.toString().includes(searchQuery)
      );
    }

    setFilteredTodos(filteredTodosList);
  }, [searchQuery, todos]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTodo({ ...newTodo, [name]: value });
  };

  const handleAddTodo = () => {
    if (newTodo.title) {
      const maxId = todos.reduce((max, todo) => {
        return Math.max(max, parseInt(todo.id, 10));
      }, 0);
      const newId = (maxId + 1);
      const todoToAdd = { ...newTodo, id: newId.toString() };

      fetch('http://localhost:3001/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoToAdd),
      })
        .then((response) => response.json())
        .then((data) => {
          setTodos([...todos, data]);
          setFilteredTodos([...todos, data]);
          setShowForm(false);
          setNewTodo({ userId: 1, id: '', title: '', completed: false });
        })
        .catch((error) => {
          alert('הייתה שגיאה בהוספת המטלה');
          console.error(error);
        });
    } else {
      alert('אנא מלאי את כל השדות');
    }
  };

  const handleCompleteTodo = (todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    fetch(`http://localhost:3001/todos/${todo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTodo),
    })
      .then((response) => response.json())
      .then((data) => {
        setTodos(todos.map((t) => (t.id === data.id ? data : t)));
        setFilteredTodos(filteredTodos.map((t) => (t.id === data.id ? data : t)));
      })
      .catch((error) => {
        console.error('Error updating todo:', error);
      });
  };

  const handleDeleteTodo = (id) => {
    fetch(`http://localhost:3001/todos/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        // בוצע מחיקה בשרת, עכשיו עדכון הסטייט
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
        setFilteredTodos(updatedTodos);
      })
      .catch((error) => {
        console.error('Error deleting todo:', error);
      });
  };
  

  const handleSort = (criteria) => {
    let sortedTodos = [...filteredTodos];

    switch (criteria) {
      case 'id':
        sortedTodos.sort((a, b) => a.id - b.id);
        break;
      case 'title':
        sortedTodos.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'completed':
        sortedTodos.sort((a, b) => a.completed - b.completed);
        break;
      case 'random':
        sortedTodos.sort(() => Math.random() - 0.5);
        break;
      default:
        break;
    }

    setFilteredTodos(sortedTodos);
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setIsEditing(true);
  };

  const handleUpdateTodo = () => {
    const updatedTodo = { ...editingTodo };

    fetch(`http://localhost:3001/todos/${editingTodo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTodo),
    })
      .then((response) => response.json())
      .then((data) => {
        setTodos(todos.map((t) => (t.id === data.id ? data : t)));
        setFilteredTodos(filteredTodos.map((t) => (t.id === data.id ? data : t)));
        setIsEditing(false);
        setEditingTodo(null);
      })
      .catch((error) => {
        console.error('Error updating todo:', error);
      });
  };

  return (
    <div className="todos-container">
      <h1 className="todos-header">Todos</h1>
      <button className="exit-btn" onClick={() => navigate('/home')}>יציאה</button>
      <button className="add-todo-btn" onClick={() => setShowForm(!showForm)}>הוסף מטלה חדשה</button>

      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="חיפוש לפי כותרת, מספר מזהה או מצב ביצוע"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <select className="sort-select" onChange={(e) => handleSort(e.target.value)}>
        <option value="">מיין לפי</option>
        <option value="id">מספר מזהה</option>
        <option value="title">כותרת</option>
        <option value="completed">ביצוע</option>
        <option value="random">אקראי</option>
      </select>

      {showForm && (
        <div className="add-todo-form">
          <h3>הוסף מטלה חדשה</h3>
          <input
            className="todo-input"
            type="text"
            name="title"
            placeholder="Title"
            value={newTodo.title}
            onChange={handleInputChange}
          />
          <button className="save-btn" onClick={handleAddTodo}>שמור</button>
        </div>
      )}

      {isEditing && (
        <div className="edit-todo-form">
          <h3>ערוך כותרת מטלה</h3>
          <input
            className="todo-input"
            type="text"
            value={editingTodo.title}
            onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
          />
          <button className="update-btn" onClick={handleUpdateTodo}>עדכן</button>
          <button className="cancel-btn" onClick={() => setIsEditing(false)}>בטל</button>
        </div>
      )}

<ul className="todo-list">
  {filteredTodos.map((todo) => (
    <li key={todo.id} className="todo-item">
      {todo.id}. {todo.title} - {todo.completed ? '✔' : 'לא בוצע'}
      <input
        className="todo-checkbox"
        type="checkbox"
        checked={todo.completed}
        onChange={() => handleCompleteTodo(todo)}
      />
      <button className="delete-btn" onClick={() => handleDeleteTodo(todo.id)}>מחק</button>
      <button className="edit-btn" onClick={() => handleEditTodo(todo)}>ערוך</button>
    </li>
  ))}
</ul>

    </div>
  );
};

export default Todos;
