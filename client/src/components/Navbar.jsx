import React from 'react';
import { Link } from 'react-router-dom';
import HomeIcon from '../assets/icons/home.svg';
import MessagesIcon from '../assets/icons/messages.svg';
import LikesIcon from '../assets/icons/likes.svg';
import SearchIcon from '../assets/icons/search.svg';

import './Navbar.css';  // Подключение стилей

function Navbar() {
    return (
        <nav className="navbar">
            <Link to="/" className="navbar__link">
                <img src={HomeIcon} alt="Home" className="navbar__icon" />
            </Link>
            <Link to="/messages" className="navbar__link">
                <img src={MessagesIcon} alt="Messages" className="navbar__icon" />
            </Link>
            <Link to="/likes" className="navbar__link">
                <img src={LikesIcon} alt="Likes" className="navbar__icon" />
            </Link>
            <Link to="/search" className="navbar__link">
                <img src={SearchIcon} alt="Search" className="navbar__icon" />
            </Link>
        </nav>
    );
}

export default Navbar;






