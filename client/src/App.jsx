// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';  
import Home from './pages/Home';  
import Likes from './pages/Likes';
import Messages from './pages/Messages';
import Search from './pages/Search';
import EditProfilePage from './pages/EditProfile'; 
import Register from './pages/Register';
import MyAlbum from './components/MyAlbum';  // Default import of MyAlbum

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

function AppContent() {
    const location = useLocation();

    // Получаем токен из localStorage
    const token = localStorage.getItem('authToken');

    // Проверка, чтобы Navbar не отображался на страницах login, register и главной, если нет токена
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
    const isHomePage = location.pathname === '/';

    return (
        <>
            {/* Показываем Navbar только если мы не на страницах входа, регистрации и главной без токена */}
            {!isAuthPage && !isHomePage && token && <Navbar />}

            <Routes>
                {/* Страница входа (если нет токена, показываем Login) */}
                <Route path="/" element={token ? <Home /> : <Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Проверка на авторизацию для других маршрутов */}
                <Route 
                    path="/home" 
                    element={token ? <Home /> : <Navigate to="/login" replace />} 
                />
                <Route 
                    path="/edit-profile" 
                    element={token ? <EditProfilePage /> : <Navigate to="/login" replace />} 
                />
                <Route 
                    path="/messages" 
                    element={token ? <Messages /> : <Navigate to="/login" replace />} 
                />
                <Route 
                    path="/likes" 
                    element={token ? <Likes /> : <Navigate to="/login" replace />} 
                />
                <Route 
                    path="/search" 
                    element={token ? <Search /> : <Navigate to="/login" replace />} 
                />

                <Route 
                    path="/myalbum" 
                    element={token ? <MyAlbum /> : <Navigate to="/login" replace />} 
                />
            </Routes>
        </>
    );
}

export default App;







