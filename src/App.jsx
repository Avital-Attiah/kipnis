import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import Login from "./components/logIn";
import Register from "./components/register";
import Home from "./components/home";
// import Info from "./components/info";
// import Todos from "./components/todos";
// import Posts from "./components/posts";
// import Albums from "./components/albums";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />}>
            {/* <Route path="info" element={<Info />} />
          <Route path="todos" element={<Todos />} />
          <Route path="posts" element={<Posts />} />
          <Route path="albums" element={<Albums />} /> */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
