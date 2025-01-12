import { BrowserRouter, Routes, Route } from "react-router-dom";
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
          {/* דף ההתחברות הראשי */}
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/full-registration" element={<FullInfo />} />

          {/* דף הבית ונתיבים מקוננים */}
           
            <Route path="/:user/:id/home" element={<Home />} />
            <Route path="/:user/:id/info" element={<Info />} />
            <Route path="/:user/:id/todos" element={<Todos />} />
            <Route path="/:user/:id/posts" element={<Posts />} />
            <Route path="/:user/:id/albums" element={<Albums />} />
            <Route path="/:user/:id/otherPosts" element={<OtherPosts />} />
         
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;
