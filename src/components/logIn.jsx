import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userExist } from "../db-api";
import '../style/logInStyle.css';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // קריאה לפונקציה שבודקת אם המשתמש קיים
    var existUser = await userExist(username, password, setError);
    if (existUser) {
      // שמירת פרטי המשתמש בלוקאל סטורג'
      localStorage.setItem("user", JSON.stringify(existUser[0]));

      // ניווט לנתיב הדינמי על בסיס שם המשתמש וה-ID
      navigate(`/${existUser[0].username}/${existUser[0].id}/home`);
    } else {
      // הודעת שגיאה אם המשתמש לא נמצא
      setError("שם משתמש או סיסמה שגויים!");
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <h1 className="login-title">התחברות</h1>
      <form onSubmit={handleSubmit} className="login-form">
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
        <button type="submit" className="submit-button">התחבר</button>
      </form>
      <button onClick={handleRegisterClick} className="register-button">הרשם</button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;
