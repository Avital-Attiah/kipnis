import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/logIn";
import Register from "./components/register";
import FullInfo from "./components/fullInfo";
import Home from "./components/home";
import Todos from "./components/todos";
import Albums from "./components/albums";
import Info from "./components/Info";
import { UserContextProvider } from "./UserContext";
import Posts from "./components/posts";
import OtherPosts from "./components/otherPosts";

function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/fullinfo" element={<FullInfo />} />
          {/* נתיב עמוד הבית */}
          <Route path="/home" element={<Home />}>
            <Route path="posts" element={<Posts />} />
            <Route path="todos" element={<Todos />} />
            <Route path="albums" element={<Albums />} />
            <Route path="info" element={<Info />} />
          </Route>

          <Route path="otherPosts" element={<OtherPosts />} />
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;
