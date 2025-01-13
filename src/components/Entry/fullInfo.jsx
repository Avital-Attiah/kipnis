import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "../../style/fullInfoStyle.css";

function FullInfo() {
  const location = useLocation();
  const { username, password } = location.state || {}; // Extract data from state
  const [formData, setFormData] = useState({
    name: "",
    username: username || "",
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
    website: password || "",
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
      {/* שאר הקוד */}
    </div>
  );
}

export default FullInfo;
