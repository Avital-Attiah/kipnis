import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { userNameExist } from "../db-api";
import { UserContext } from "../UserContext";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [error, setError] = useState("");
  const { setUserData } = useContext(UserContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    setError(""); // Reset any previous error messages

    if (username.length < 3 || username.length > 20) {
      setError("השם משתמש חייב להיות בין 3 ל-20 תווים");
      return;
    }

    if (password !== verifyPassword) {
      setError("הסיסמאות אינן תואמות");
      return;
    }

    if (password.length < 6) {
      setError("הסיסמה חייבת להיות לפחות 6 תווים");
      return;
    }

    const existuserName = await userNameExist(username,setError); // Check if user exists

    if (existuserName) {
      setError("המשתמש כבר קיים");
      return;
    }

    // Save the user data to context
    setUserData({ username, password });
    navigate("/fullInfo"); // Navigate to full info page
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
        <button type="button" onClick={handleLogInClick}>התחבר</button>
      </form>

      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
    </div>
  );
};

export default Register;
