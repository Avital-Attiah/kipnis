import { useEffect, useState } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (Array.isArray(parsedUser) && parsedUser.length > 0 && parsedUser[0].username) {
          setUser(parsedUser[0]); // שליפת האובייקט הראשון מתוך המערך
        } else {
          console.error("User array is empty or missing username");
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        setUser(null);
      }
    } else {
      navigate("/login");
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
