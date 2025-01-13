import React, { createContext, useState, useEffect, useContext } from 'react';

// יצירת ה-Context
const UserContext = createContext();

// Provider של ה-Context
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // מצב טעינה

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const currentUser = JSON.parse(storedUser);
        setUser(currentUser); // שמירה ב-state
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
      }
    }
    setLoading(false); // טעינה הושלמה
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook לשימוש ב-Context
export const useUser = () => useContext(UserContext);
