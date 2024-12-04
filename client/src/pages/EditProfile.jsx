import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../api/user';

function EditProfile() {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');

    useEffect(() => {
        getUserProfile(1) // Пример: id пользователя = 1
            .then((response) => {
                setUser(response.data);
                setEmail(response.data.email);
            })
            .catch((err) => console.error(err));
    }, []);

    const handleUpdate = () => {
        updateUserProfile(1, { email }) // Пример: id пользователя = 1
            .then(() => alert('Profile updated successfully'))
            .catch((err) => console.error(err));
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Edit Profile</h2>
            <p>Name: {user.first_name} {user.last_name}</p>
            <p>Address: {user.address}</p>
            <p>Age: {calculateAge(user.birth_date)}</p>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Update email"
            />
            <button onClick={handleUpdate} style={{ marginTop: '10px' }}>Save</button>
        </div>
    );
}

function calculateAge(birthDate) {
    const birth = new Date(birthDate);
    const now = new Date();
    return now.getFullYear() - birth.getFullYear();
}

export default EditProfile;
