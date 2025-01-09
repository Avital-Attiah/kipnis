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
