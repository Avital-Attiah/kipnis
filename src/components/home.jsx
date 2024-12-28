import { useEffect, useState } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div>
      <h1>עמוד הבית</h1>
      {user && <h2>שלום {user.username}!</h2>}
      
      {/* כפתורים לניווט */}
      <nav>
        <Link to="info">Info</Link> | 
        <Link to="todos">Todos</Link> | 
        <Link to="posts">Posts</Link> | 
        <Link to="albums">Albums</Link> | 
        <button onClick={handleLogout}>Logout</button>
      </nav>

      {/* הצגת תוכן בהתאם לניווט */}
      <Outlet />
    </div>
  );
};

export default Home;
