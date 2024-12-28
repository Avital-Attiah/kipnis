import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    
      // הוספת משתמש חדש
      const newUser = { username, website: password };
      await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      localStorage.setItem("user", JSON.stringify(newUser));
      navigate("/home");
    };

  const handleLogInClick = () => {
    navigate("/login");
  };

  return (
    <div>
      <h1>רישום</h1>
      <form onSubmit={handleRegister}>
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
        <input
          type="password"
          placeholder="Verify Password"
          value={verifyPassword}
          onChange={(e) => setVerifyPassword(e.target.value)}
        />
        <button type="submit">רשום</button>
        <button onClick={handleLogInClick}>התחבר</button>``
     </form>
    </div>
  );
};


export default Register;
