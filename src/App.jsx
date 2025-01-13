import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Entry/logIn";
import Register from "./components/Entry/register";
import FullInfo from "./components/Entry/fullInfo";
import Home from "./components/home";
import Todos from "./components/Todos/todos";
import Albums from "./components/Albums/albums";
import Info from "./components/Info";
import Posts from "./components/Posts/posts";
import OtherPosts from "./components/Posts/otherPosts";
import { UserProvider } from "./UserContext";

function App() {
  return (
    <UserProvider> {/* עטיפת כל היישום ב-UserProvider */}
      <BrowserRouter>
        <Routes>
          {/* דפי התחברות */}
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/full-registration" element={<FullInfo />} />

          {/* דפי הבית */}
          <Route path="/:user/:id/home" element={<Home />} />
          <Route path="/:user/:id/info" element={<Info />} />
          <Route path="/:user/:id/todos" element={<Todos />} />
          <Route path="/:user/:id/posts" element={<Posts />} />
          <Route path="/:user/:id/albums" element={<Albums />} />
          <Route path="/:user/:id/otherPosts" element={<OtherPosts />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
