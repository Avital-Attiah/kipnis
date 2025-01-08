import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/logIn";
import Register from "./components/register";
import FullInfo from "./components/fullInfo";
import Home from "./components/home";
import Todos from "./components/todos";
import Albums from "./components/albums";
import { UserContextProvider } from "./UserContext"; // Correctly import UserContextProvider
import Posts from "./components/posts";
import OtherPosts from "./components/otherPosts";

function App() {
  return (<UserContextProvider>
    <BrowserRouter>
      <Routes>
        {/* ניווט אוטומטי לעמוד login ברגע שמטעינים את האתר */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/fullinfo" element={<FullInfo />} />
        <Route path="/posts" element={<Posts />} />
        {/* דף המטלות */}
        <Route path="/todos" element={<Todos />} />
        
        {/* דף הבית לא מקבל את /todos כחלק ממנו */}
        <Route path="/home" element={<Home />} />
        <Route path="albums" element={<Albums />} />
        <Route path="otherPosts" element={<OtherPosts />} />

      </Routes>
    </BrowserRouter>
  </UserContextProvider>

  );
}

export default App;
