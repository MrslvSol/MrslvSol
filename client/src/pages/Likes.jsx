import React, { useState, useEffect } from 'react';

const Likes = () => {
    const [likes, setLikes] = useState([]);

    // Пример использования useEffect для загрузки лайков из API или другого источника
    useEffect(() => {
        // Это только пример, измените на реальный запрос к серверу
        const fetchLikes = async () => {
            // Вместо этого используйте ваш API запрос для получения лайков
            const response = await fetch('/api/likes');
            const data = await response.json();
            setLikes(data);
        };
        fetchLikes();
    }, []);

    return (
        <div>
            <h1>Likes</h1>
            {likes.length === 0 ? (
                <p>No likes yet!</p>
            ) : (
                <ul>
                    {likes.map((like, index) => (
                        <li key={index}>{like.userName} liked your post!</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Likes;
