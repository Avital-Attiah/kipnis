import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../UserContext";

function FullInfo() {
  const { userData } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name:"",
    userName: userData.username, // Set initial value from context
    
    email: "",
    phone: "",
    address: "",
    geo: "",
    website: userData.password,
    company: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState(""); // For error messages
  const [success, setSuccess] = useState(""); // For success messages

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset messages
    setError("");
    setSuccess("");

    try {
      console.log("Sending data:", formData);

      // שליחת הנתונים ל-JSON-Server
      const response = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess("המשתמש נוסף בהצלחה!");
        navigate("/home"); // או נתיב אחר לפי הצורך
      } else {
        throw new Error("שגיאה בהוספת המשתמש");
      }
    } catch (error) {
      setError("שגיאה בהתחברות לשרת: " + error.message);
    }
  };

  return (
    <div>
      <h1>Full Information</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="geo"
          placeholder="Geo (Latitude, Longitude)"
          value={formData.geo}
          onChange={handleChange}
          required
        />
       
        <input
          type="text"
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
          required
        />

        <button type="submit" className="connect">Submit</button>
      </form>

      {/* Messages */}
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
      {success && <div style={{ color: "green", marginTop: "10px" }}>{success}</div>}
    </div>
  );
}

export default FullInfo;
