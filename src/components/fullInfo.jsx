import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import '../style/fullInfoStyle.css'; // Import the CSS file

function FullInfo() {
  const { userData } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: "",
    username: userData.username,
    email: "",
    address: {
      street: "",
      suite: "",
      city: "",
      zipcode: "",
      geo: {
        lat: "",
        lng: "",
      },
    },
    phone: "",
    website: userData.password,
    company: {
      name: "",
      catchPhrase: "",
      bs: "",
    },
  });

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("address.geo.")) {
      const [_, key] = name.split("geo.");
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          geo: {
            ...prevData.address.geo,
            [key]: value,
          },
        },
      }));
    } else if (name.includes("address.")) {
      const key = name.split("address.")[1];
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [key]: value,
        },
      }));
    } else if (name.includes("company.")) {
      const key = name.split("company.")[1];
      setFormData((prevData) => ({
        ...prevData,
        company: {
          ...prevData.company,
          [key]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      console.log("Sending data:", formData);

      const response = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newUser = await response.json();
        const existingUsers = JSON.parse(localStorage.getItem("user")) || [];
        localStorage.setItem("user", JSON.stringify([...existingUsers, newUser]));

        setSuccess("המשתמש נוסף בהצלחה!");
        navigate("/home");
      } else {
        throw new Error("שגיאה בהוספת המשתמש");
      }
    } catch (error) {
      setError("שגיאה בהתחברות לשרת: " + error.message);
    }
  };

  return (
    <div className="full-info-container">
      <h1 className="full-info-title">Full Information</h1>
      <form onSubmit={handleSubmit} className="full-info-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="full-info-input"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="full-info-input"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="full-info-input"
          required
        />
        <input
          type="text"
          name="address.street"
          placeholder="Street"
          value={formData.address.street}
          onChange={handleChange}
          className="full-info-input"
          required
        />
        <input
          type="text"
          name="address.suite"
          placeholder="Suite"
          value={formData.address.suite}
          onChange={handleChange}
          className="full-info-input"
          required
        />
        <input
          type="text"
          name="address.city"
          placeholder="City"
          value={formData.address.city}
          onChange={handleChange}
          className="full-info-input"
          required
        />
        <input
          type="text"
          name="address.zipcode"
          placeholder="Zipcode"
          value={formData.address.zipcode}
          onChange={handleChange}
          className="full-info-input"
          required
        />
        <input
          type="text"
          name="address.geo.lat"
          placeholder="Latitude"
          value={formData.address.geo.lat}
          onChange={handleChange}
          className="full-info-input"
          required
        />
        <input
          type="text"
          name="address.geo.lng"
          placeholder="Longitude"
          value={formData.address.geo.lng}
          onChange={handleChange}
          className="full-info-input"
          required
        />
        <input
          type="text"
          name="company.name"
          placeholder="Company Name"
          value={formData.company.name}
          onChange={handleChange}
          className="full-info-input"
          required
        />
        <input
          type="text"
          name="company.catchPhrase"
          placeholder="Catch Phrase"
          value={formData.company.catchPhrase}
          onChange={handleChange}
          className="full-info-input"
          required
        />
        <input
          type="text"
          name="company.bs"
          placeholder="Business Slogan"
          value={formData.company.bs}
          onChange={handleChange}
          className="full-info-input"
          required
        />
        <button type="submit" className="full-info-button">
          Submit
        </button>
      </form>

      {error && <div className="full-info-error">{error}</div>}
      {success && <div className="full-info-success">{success}</div>}
    </div>
  );
}

export default FullInfo;
