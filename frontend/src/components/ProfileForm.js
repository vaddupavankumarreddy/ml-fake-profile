import React, { useState } from 'react';
import axios from 'axios';

const ProfileForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        email: '',
        bio: '',
    });
    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post('http://localhost:5000/addUser', formData);
        setResult(response.data.message);
    };

    return (
        <div>
            <h2>Fake Profile Identification</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
                <input type="number" name="age" placeholder="Age" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <textarea name="bio" placeholder="Bio" onChange={handleChange}></textarea>
                <button type="submit">Add Profile</button>
            </form>
            {result && <p>{result}</p>}
        </div>
    );
};

export default ProfileForm;