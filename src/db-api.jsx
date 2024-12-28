import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export async function userExist(userName, password, setError, navigate) {
    // קריאה לשרת
    try {
        const res = await fetch(`http://localhost:3001/users?username=${userName}&website=${password}`);

        if (res.ok) {
            const user = await res.json();
            localStorage.setItem("user", JSON.stringify(user));
            navigate("/home");
        } else {
            setError("שם משתמש או סיסמה שגויים!");
        }
    } catch (err) {
        console.error("Error fetching users", err);
        setError("שגיאה בשרת. נסה שוב.");
    }
}
