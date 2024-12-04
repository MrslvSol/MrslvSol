const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadPhoto } = require('../controllers/photoController');
const pool = require('../models/db'); // Подключаем пул для работы с базой данных
const verifyToken = require('../middleware/authMiddleware'); // Подключаем middleware для проверки токена

// Настройка хранения файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Папка для сохранения файлов
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Уникальное имя файла
    },
});

const upload = multer({ storage });

// Маршрут для загрузки фото
router.post('/upload', upload.single('image'), uploadPhoto);

// Маршрут для получения всех фото пользователя с использованием verifyToken
router.get('/user/photos', verifyToken, async (req, res) => {
    try {
        // Получаем userId из токена
        const userId = req.userId;

        if (!userId) {
            return res.status(401).send('Пользователь не авторизован');
        }

        // Запрос к базе данных для получения всех фото пользователя
        const query = 'SELECT id, image_url FROM photos WHERE user_id = $1';
        const { rows } = await pool.query(query, [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Фотографии не найдены' });
        }

        // Отправляем список фотографий
        res.json({ photos: rows });
    } catch (error) {
        console.error('Ошибка при получении фотографий:', error);
        res.status(500).json({ message: 'Ошибка при получении фотографий' });
    }
});

module.exports = router;
