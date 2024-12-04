import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/auth/login', {
                email,
                password
            });
            if (response.status === 200) {
                // Если логин успешен, сохраняем токен в localStorage или sessionStorage
                localStorage.setItem('authToken', response.data.token);
                console.log('Login successful, token saved');

                // Редиректим на домашнюю страницу или на страницу, куда нужно
                navigate('/home');
            }
        } catch (error) {
            console.error(error);
            if (error.response) {
                setErrorMessage(error.response.data.error || 'Login failed');
            } else {
                setErrorMessage('Network error or server is down');
            }
        }
    };

    const handleRegisterRedirect = () => {
        navigate('/register');
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <button type="submit">Login</button>
            </form>

            <div>
                <p>Don't have an account?</p>
                <button onClick={handleRegisterRedirect}>Register</button>
            </div>
        </div>
    );
}

export default Login;



