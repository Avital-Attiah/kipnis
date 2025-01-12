import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "../style/homeStyle.css";

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const currentUser = JSON.parse(storedUser);
        setUser(currentUser);
        console.log("User set successfully:", currentUser);
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

      {/* כפתורי הניווט */}
      <div className="navigation">
        <button className="nav-link"  onClick={() => navigate(`/${user?.username}/${user?.id}/info`)}>Info</button>
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
