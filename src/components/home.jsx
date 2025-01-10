import { useEffect, useState } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";
import '../style/homeStyle.css'

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        if (Array.isArray(parsedUser) && parsedUser.length > 0) {
          const lastUser = parsedUser[parsedUser.length - 1]; // משתמש אחרון במערך
          setUser(lastUser);
          console.log("User set successfully:", lastUser);
        } else {
          console.error("Parsed data is not an array or is empty:", parsedUser);
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        setUser(null);
      }
    } else {
      console.warn("No user found in localStorage. Redirecting to login.");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="home-container">
      <h1 className="home-title">עמוד הבית</h1>
      {user && <h2 className="home-user-greeting">שלום {user.username}!</h2>}
      
      {/* כפתורים לניווט */}
      <nav className="navigation">
        <Link to="info" className="nav-link">Info</Link> | 
        <Link to="todos" className="nav-link">Todos</Link> | 
        <Link to="posts" className="nav-link">Posts</Link> | 
        <Link to="albums" className="nav-link">Albums</Link> | 
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </nav>

      {/* הצגת תוכן בהתאם לניווט */}
      <Outlet />
    </div>
  );
};

export default Home;
