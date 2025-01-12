import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../style/infoStyle.css';

const Info = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
   
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const currentUser = JSON.parse(storedUser); 
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        setUser(null);
      }
    }
  }, []);

  

  if (!user) {
    return <div className="info-container">לא נמצא מידע על המשתמש.</div>;
  }

  return (
    <div className="info-container">
      {/* כפתור Home */}
      <button className="homeBtn" onClick={() =>navigate(`/${user.username}/${user.id}/home`)}>Home</button>

      <h1 className="info-title">פרטי המשתמש</h1>
      <ul className="info-list">
        <li><strong>מזהה:</strong> {user.id}</li>
        <li><strong>שם:</strong> {user.name}</li>
        <li><strong>שם משתמש:</strong> {user.username}</li>
        <li><strong>אימייל:</strong> {user.email}</li>
        <li><strong>טלפון:</strong> {user.phone}</li>
        <li>
          <strong>כתובת:</strong>
          <ul className="info-sublist">
            <li><strong>רחוב:</strong> {user.address?.street}</li>
            <li><strong>דירה:</strong> {user.address?.suite}</li>
            <li><strong>עיר:</strong> {user.address?.city}</li>
            <li><strong>מיקוד:</strong> {user.address?.zipcode}</li>
            <li><strong>מיקום:</strong> {user.address?.geo ? `(${user.address.geo.lat}, ${user.address.geo.lng})` : "לא זמין"}</li>
          </ul>
        </li>
        <li>
          <strong>חברה:</strong>
          <ul className="info-sublist">
            <li><strong>שם:</strong> {user.company?.name}</li>
            <li><strong>סיסמא:</strong> {user.company?.catchPhrase}</li>
            <li><strong>תחום:</strong> {user.company?.bs}</li>
          </ul>
        </li>
        <li><strong>אתר:</strong> {user.website}</li>
      </ul>
    </div>
  );
};

export default Info;
