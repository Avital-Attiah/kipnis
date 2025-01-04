import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export async function userExist(userName, password, setError) {
    try {
        const url = `http://localhost:3001/users?username=${userName}&website=${password}`;
      
        
        const res = await fetch(url);
        const user = await res.json();
       

        if (res.ok && user && Object.keys(user).length > 0) {
          return user;
        } else {
            return null;
        }
    } catch (err) {
        console.error("Error fetching users", err);
        setError("שגיאה בשרת. נסה שוב.");
    }
}




export async function userNameExist(userName,  setError) {
    try {
        debugger;
        const url = `http://localhost:3001/users?username=${userName}`;
      
        
        const res = await fetch(url);
        const user = await res.json();
       

        if (res.ok && user && Object.keys(user).length > 0) {
          return ture;
        } else {
            return false;
        }
    } catch (err) {
        console.error("Error fetching users", err);
        setError("שגיאה בשרת. נסה שוב.");
    }
}
 // הוספת משתמש חדש
/* function addUser(){
    
     const newUser = { username, website: password };
     await fetch("http://localhost:3001/users", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(newUser),
     });
} */
