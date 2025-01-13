import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userNameExist } from "../../db-api";

import "../../style/registerStyle.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [error, setError] = useState("");
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

    const existuserName = await userNameExist(username, setError); // Check if user exists

    if (!existuserName) {
      setError("המשתמש כבר קיים");
      return;
    }

    // Navigate to fullInfo page with user data as state
    navigate("/fullInfo", { state: { username, password } });
  };

  const handleLogInClick = () => {
    navigate("/login");
  };

  return (
    <div className="register-container">
      <h1 className="register-title">רישום</h1>
      <form onSubmit={handleRegister} className="register-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Verify Password"
          value={verifyPassword}
          onChange={(e) => setVerifyPassword(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="submit-button">
          רשום
        </button>
        <button type="button" onClick={handleLogInClick} className="login-button">
          התחבר
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Register;
