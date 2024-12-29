import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/logIn";
import Register from "./components/register";
import Home from "./components/home";
import Todos from "./components/todos";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      {/* ניווט אוטומטי לעמוד login ברגע שמטעינים את האתר */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* דף המטלות */}
      <Route path="/todos" element={<Todos />} />
      
      {/* דף הבית לא מקבל את /todos כחלק ממנו */}
      <Route path="/home" element={<Home />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
