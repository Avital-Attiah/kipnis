import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userExist } from "../db-api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // קריאה לפונקציה עם העברת navigate ו-setError כפרמטרים
    var existUser=await userExist(username, password, setError);
    if (existUser){
      localStorage.setItem("user", JSON.stringify(existUser));
      navigate("/home");
    }
    else{
      setError("שם משתמש או סיסמה שגויים!");
     } 
    
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div>
      <h1>התחברות</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">התחבר</button>
      </form>
      <button onClick={handleRegisterClick}>הרשם</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;
