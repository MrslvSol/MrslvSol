//Myalbum.jsx
import React, {useEffect, useState} from 'react';
import { jwtDecode } from 'jwt-decode';
import { getPhotos }  from '../api/photos'

const MyAlbum = () => {
    const [selectedImage, setSelectedImage] = useState(null); // Выбранное изображение
    const [imageUrl, setImageUrl] = useState(null); // URL загруженного изображения
    const [photos, setPhotos] = useState([]); // Список загруженных фотографий

    useEffect(() => {
        getPhotos()
            .then((response) => {
                setPhotos(response.data.photos);
            })
            .catch((err) => console.error(err));
    }, []);

    //console.log(photos)

    // Функция для получения userId из токена JWT
    const getUserIdFromToken = () => {
        const token = localStorage.getItem('authToken'); // Получаем токен из localStorage
        if (!token) return null; // Если токен отсутствует, возвращаем null
        const decodedToken = jwtDecode(token); // Декодируем токен
        return decodedToken.id; // Возвращаем userId из токена
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0]; // Получаем файл из инпута
        if (!file) return;

        // Проверяем тип файла
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            alert('Недопустимый формат файла! Используйте JPG, PNG или GIF.');
            return;
        }

        // Проверяем размер файла (5 MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('Размер файла не должен превышать 5MB.');
            return;
        }

        setSelectedImage(file); // Сохраняем выбранный файл

        // Получаем userId из токена
        const userId = getUserIdFromToken();
        if (!userId) {
            alert('Пользователь не авторизован');
            return;
        }

        // Создаём FormData и добавляем файл и userId
        const formData = new FormData();
        formData.append('image', file);
        formData.append('userId', userId); // Передаем userId в FormData

        try {
            // Отправляем запрос на сервер
            const response = await fetch('http://localhost:3001/photos/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Ответ сервера:', data); // Лог ответа сервера
                setImageUrl(data.imageUrl); // Устанавливаем URL изображения

                // Добавляем фото в список
                setPhotos([...photos, data.photo]); // Добавляем новое фото в список
            } else {
                const error = await response.json();
                console.error('Ошибка загрузки:', error);
                alert(error.message || 'Не удалось загрузить изображение!');
            }
        } catch (error) {
            console.error('Ошибка при загрузке изображения:', error);
            alert('Ошибка при загрузке изображения. Проверьте подключение к серверу.');
        }
    };

    return (
        <div>
            <h1>Загрузить изображение в мой альбом</h1>
            <input
                type="file"
                name="image"
                accept="image/*" // Разрешаем только изображения
                onChange={handleImageChange}
            />

            {imageUrl && (
                <div>
                    <h3>Загруженное изображение:</h3>
                    <img
                        src={`http://localhost:3001${imageUrl}`} // Добавляем базовый URL
                        alt="Uploaded"
                        style={{ maxWidth: '100%', marginTop: '20px' }}
                    />
                </div>
            )}

<h2>Мои изображения:</h2>
<div>
    {photos.map((photo) => (
        <div key={photo.id}>
            <img
                src={`http://localhost:3001${photo.image_url}`} // Используем правильное имя поля image_url
                alt="User photo"
                style={{ width: '100px', height: '100px', margin: '10px' }}
            />
        </div>
    ))}
</div>
        </div>
    );
};

export default MyAlbum;

