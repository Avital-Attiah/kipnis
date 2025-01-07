import React, { useReducer, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/todoStyle.css';

const initialState = {
  todos: [],
  filteredTodos: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_TODOS':
      return { ...state, todos: action.payload, filteredTodos: action.payload };
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.payload],
        filteredTodos: [...state.todos, action.payload],
      };
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? { ...todo, ...action.payload } : todo
        ),
        filteredTodos: state.todos.map(todo =>
          todo.id === action.payload.id ? { ...todo, ...action.payload } : todo
        ),
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
        filteredTodos: state.filteredTodos.filter(todo => todo.id !== action.payload),
      };
    case 'SET_FILTERED_TODOS':
      return {
        ...state,
        filteredTodos: action.payload,
      };
    default:
      return state;
  }
};

const Todos = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showForm, setShowForm] = useState(false);
  const [newTodo, setNewTodo] = useState({
    userId: 1,
    id: '',
    title: '',
    completed: false,
  });
  const [sortCriteria, setSortCriteria] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const navigate = useNavigate();
  const userId = 1;

  useEffect(() => {
    fetch(`http://localhost:3001/todos?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => {
        dispatch({ type: 'SET_TODOS', payload: data });
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTodo({ ...newTodo, [name]: value });
  };

  const handleAddTodo = () => {
    if (newTodo.title) {
      const newId = state.todos.length + 1;
      const todoToAdd = { ...newTodo, id: newId };

      fetch('http://localhost:3001/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoToAdd),
      })
        .then((response) => response.json())
        .then((data) => {
          dispatch({ type: 'ADD_TODO', payload: data });
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
        dispatch({ type: 'UPDATE_TODO', payload: data });
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
        dispatch({ type: 'DELETE_TODO', payload: id });
      })
      .catch((error) => {
        console.error('Error deleting todo:', error);
      });
  };

  const handleSearch = () => {
    let filteredTodos = state.todos;

    if (searchQuery) {
      filteredTodos = filteredTodos.filter((todo) =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.id.toString().includes(searchQuery) ||
        todo.completed.toString().includes(searchQuery)
      );
    }

    dispatch({ type: 'SET_FILTERED_TODOS', payload: filteredTodos });
  };

  const handleSort = (criteria) => {
    let sortedTodos = [...state.filteredTodos];

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

    dispatch({ type: 'SET_FILTERED_TODOS', payload: sortedTodos });
  };

  const handleEditTodo = (todo) => {
    setIsEditing(true);
    setEditingTodo(todo);
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
        dispatch({ type: 'UPDATE_TODO', payload: data });
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
        <button className="search-btn" onClick={handleSearch}>חפש</button>
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
        {state.filteredTodos.map((todo) => (
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
