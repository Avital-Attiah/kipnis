import React, { useEffect, useState } from "react";

const Info = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // שליפת המשתמש מ-localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (Array.isArray(parsedUser) && parsedUser.length > 0) {
          setUser(parsedUser[0]); // משתמש ראשון במערך
        } else {
          console.error("User data is invalid");
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
      }
    }
  }, []);

  if (!user) {
    return <div>לא נמצא מידע על המשתמש.</div>;
  }

  return (
    <div>
      <h1>פרטי המשתמש</h1>
      <ul>
        <li><strong>מזהה:</strong> {user.id}</li>
        <li><strong>שם:</strong> {user.name}</li>
        <li><strong>שם משתמש:</strong> {user.username}</li>
        <li><strong>אימייל:</strong> {user.email}</li>
        <li><strong>טלפון:</strong> {user.phone}</li>
        <li><strong>כתובת:</strong> {user.address}</li>
        <li><strong>חברה:</strong> {user.company}</li>
      </ul>
    </div>
  );
};

export default Info;
