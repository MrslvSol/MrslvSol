import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../logo/default-avatar.svg'; // Импорт логотипа


function Home() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();

    const sendFile = React.useCallback(async (file) => {
        if (!file || !user) {
            console.error('Изображение или пользователь не выбраны');
            return;
        }

        setIsUploading(true);
        try {
            const data = new FormData();
            data.append('avatar', file);

            const token = localStorage.getItem('authToken');
            const res = await axios.post('http://localhost:3001/api/upload', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (res.data && res.data.path) {
                console.log('Путь к аватару:', res.data.path);
                setAvatar(res.data.path);
                const userRes = await axios.get('http://localhost:3001/api/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setUser(userRes.data);
            } else {
                console.error('Ошибка загрузки файла');
            }
        } catch (error) {
            console.error('Ошибка при загрузке:', error);
        } finally {
            setIsUploading(false);
        }
    }, [user]);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
        } else {
            axios.get('http://localhost:3001/api/user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then((response) => {
                    setUser(response.data);
                    setAvatar(response.data.avatar);
                    setError(null);
                })
                .catch((err) => {
                    console.error(err);
                    setError('Ошибка загрузки данных пользователя');
                    if (err.response && err.response.status === 401) {
                        localStorage.removeItem('authToken');
                        navigate('/login');
                    }
                });
        }
    }, [navigate]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            sendFile(file);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <div>
            <header className="header">
                <button className="header__logout-button" onClick={handleLogout}>
                    Выйти
                </button>
            </header>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {user && (
                <div className="user-profile">
                    <div className="avatar">
                        <label htmlFor="avatar-upload">
                            {avatar ? (
                                <img
                                    className="avatar-img"
                                    src={`http://localhost:3001/${avatar}`}
                                    alt="avatar"
                                />
                            ) : (
                                <img className="avatar-img" src={logo} alt="avatar" />
                            )}
                            <div className="avatar-plus">+</div>
                        </label>
                        <input
                            id="avatar-upload"
                            type="file"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="user-details">
                        <p className="user-name">{user.first_name} {user.last_name}</p>
                        <p className="user-address">
                            {user.address}, {new Date().getFullYear() - new Date(user.birth_date).getFullYear()} лет
                        </p>
                    </div>
                </div>
            )}

            {!user && !error && <p>Загружаем данные...</p>}

            <div>
  <button onClick={() => navigate('/myalbum')}>Album</button>
</div>

            <Navbar />
        </div>
    );
}

export default Home;










