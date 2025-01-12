import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TodoItem from './todoItem'; 
import '../style/todoStyle.css';

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ userId: 1, id: '', title: '', completed: false });
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const userId =  currentUser.id;

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
  }, []);

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
      fetch('http://localhost:3001/todos')
        .then((response) => response.json())
        .then((data) => {
          const maxId = data.reduce((max, todo) => Math.max(max, parseInt(todo.id, 10)), 0);
          const newId = (maxId + 1).toString();

          const todoToAdd = {
            userId: newTodo.userId,
            id: newId,
            title: newTodo.title,
            completed: newTodo.completed,
          };

          fetch('http://localhost:3001/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
        })
        .catch((error) => {
          alert('הייתה שגיאה בקריאת המטלות מהשרת');
          console.error(error);
        });
    } else {
      alert('אנא מלאי את כל השדות');
    }
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

      <ul className="todo-list">
        {filteredTodos.map((todo, index) => (
          <TodoItem key={todo.id} todo={todo} index={index} setTodos={setTodos} setFilteredTodos={setFilteredTodos} />
        ))}
      </ul>
    </div>
  );
};

export default Todos;
