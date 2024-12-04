const express = require('express');
const router = express.Router();
const db = require('../models/db'); // Ваш файл подключения к базе данных

router.get('/search', async (req, res) => {
    try {
        const query = req.query.q || ''; // Получаем строку поиска из query-параметра

        // Используем COALESCE, чтобы вернуть дефолтное изображение, если avatar пустой
        const results = await db.query(
            `SELECT 
                first_name, 
                last_name, 
                address, 
                birth_date, 
                COALESCE(avatar, 'images/default-avatar.svg') AS avatar 
            FROM users 
            WHERE first_name ILIKE $1 OR last_name ILIKE $1`,
            [`%${query}%`]
        );
        
        res.json(results.rows); // Отправляем данные, включая avatar
    } catch (error) {
        console.error('Error fetching search results:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
