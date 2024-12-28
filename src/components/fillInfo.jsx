import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../css/loginAndRegister.css';


function fillInfo() {

    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        phone: '',
        address: '',
        geo: '',
        website: '',
        company: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        
            <form onSubmit={handleSubmit}  >
                <input
                    type="text"
                    name="userName"
                    placeholder="Name"
                    value={formData.userName}
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
                    name="website"
                    placeholder="Website"
                    value={formData.website}
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

                <button type="submit" className="connect">Login</button>
            </form>
            )

}

export default fillInfo;