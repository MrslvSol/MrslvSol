import React, { useState } from 'react';
import axios from 'axios'; // Убедитесь, что axios установлен
import '../App.css'; // Импортируем стили

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    const handleSearchChange = async (event) => {
        const query = event.target.value;
        setSearchQuery(query);

        if (query) {
            try {
                // Запрос к серверу
                const response = await axios.get(`http://localhost:3001/api/search?q=${query}`);
                setFilteredUsers(response.data); // Устанавливаем данные из API
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        } else {
            setFilteredUsers([]); // Очищаем список, если запрос пустой
        }
    };

    return (
        <div className="search-container">
            <h2>Search Page</h2>
            <input
                type="text"
                placeholder="Search for a user..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
            />
            {filteredUsers.length > 0 && (
                <div className="results-container">
                    <ul className="results-list">
                        {filteredUsers.map((user, index) => (
                            <li key={index} className="result-item">
                               <img
    src={`http://localhost:3001/${user.avatar}`}
    alt={`${user.first_name} ${user.last_name}`}
    className="user-avatar"
/>

                                <strong>
                                    {user.first_name} {user.last_name}
                                </strong>{' '}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Search;






