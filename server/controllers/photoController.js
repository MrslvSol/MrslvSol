const pool = require('../models/db');

const uploadPhoto = async ({ userId, imageUrl }) => {
    try {
        // Пример запроса для сохранения фото в базу данных
        const query = 'INSERT INTO photos (user_id, image_url) VALUES ($1, $2) RETURNING *';
        const { rows } = await pool.query(query, [userId, imageUrl]);

        console.log('Фото сохранено в базе данных:', rows[0]); // Логирование успешного сохранения
        return rows[0]; // Возвращаем первую запись (сохранённую информацию о фото)
    } catch (error) {
        console.error('Ошибка при сохранении фото в базу данных:', error);
        throw new Error('Ошибка при сохранении фото');
    }
};

module.exports = { uploadPhoto };





