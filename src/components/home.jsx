import { useEffect, useState } from "react"; 
import { useNavigate, Outlet } from "react-router-dom"; 
import "../style/homeStyle.css"; 
import { useUser } from "../UserContext";

const Home = () => {
  const { user } = useUser();
 // const [user, setUser] = useState(null); // הגדרת מצב למשתמש
  const navigate = useNavigate(); 
 
  

  const handleLogout = () => {
    localStorage.removeItem("user"); // הסרת המידע על המשתמש מ-localStorage
    navigate("/login"); 
  };

  return (
    <div className="home-container">
      <h1 className="home-title">עמוד הבית</h1>
      {user && <h2 className="home-user-greeting">שלום {user.username}!</h2>} {/* הצגת ברכת שלום אם המשתמש קיים */}

      {/* כפתורי ניווט */}
      <div className="navigation">
        <button className="nav-link" onClick={() => navigate(`/${user?.username}/${user?.id}/info`)}>Info</button>
        <button className="nav-link" onClick={() => navigate(`/${user?.username}/${user?.id}/todos`)}>Todos</button>
        <button className="nav-link" onClick={() => navigate(`/${user?.username}/${user?.id}/posts`)}>Posts</button>
        <button className="nav-link" onClick={() => navigate(`/${user?.username}/${user?.id}/albums`)}>Albums</button>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      {/* אזור התוכן המוצג */}
      <Outlet />
    </div>
  );
};

export default Home; 
