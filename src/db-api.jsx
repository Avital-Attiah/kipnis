export async function userExist(userName, password, setError, navigate) {
    try {
        const res = await fetch(`http://localhost:3001/users?username=${userName}&website=${password}`);
        if (res.ok) {
            const user = await res.json(); // מניחים שהשרת מחזיר אובייקט יחיד
            if (user && user.id) { // בדיקה אם האובייקט מכיל שדה מזהה (לדוגמה, id)
                localStorage.setItem("user", JSON.stringify(user));
                navigate("/home");
            } else {
                setError("שם משתמש או סיסמה שגויים!");
            }
        } else {
            setError("שגיאה בשרת. נסה שוב.");
        }
    } catch (err) {
        console.error("Error fetching users", err);
        setError("שגיאה בשרת. נסה שוב.");
    }
}
