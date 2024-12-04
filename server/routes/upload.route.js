// upload.route.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// Подключение к базе данных через переменные окружения
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

// Конфигурация хранения файлов
const storage = multer.diskStorage({
    destination(req, file, cb) {
        const uploadDir = path.join(__dirname, '../images');

        // Проверка на существование папки и создание ее, если не существует
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename(req, file, cb) {
        const fileName = new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname;
        cb(null, fileName);
    }
});

const upload = multer({ storage });

// Проверка токена
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Токен отсутствует' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Неверный токен' });
        req.user = user;
        next();
    });
};

// Маршрут для загрузки аватарки
router.post('/upload', authenticateToken, upload.single('avatar'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Файл не загружен' });
    }

    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(req.file.originalname).toLowerCase());
    const mimetype = fileTypes.test(req.file.mimetype);

    if (!extname || !mimetype) {
        return res.status(400).json({ error: 'Неверный формат файла' });
    }

    const filePath = `images/${req.file.filename}`;
    const userId = req.user.id;

    try {
        console.log('Загруженный файл:', filePath);
        console.log('ID пользователя:', userId); // Выведем ID пользователя для проверки

        // Обновляем аватарку в базе данных для конкретного пользователя
        const query = 'UPDATE users SET avatar = $1 WHERE id = $2';
        const result = await pool.query(query, [filePath, userId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        res.json({ path: filePath, message: 'Аватар успешно обновлен' });
    } catch (error) {
        console.error('Ошибка при обновлении базы данных', error);
        res.status(500).json({ error: 'Ошибка при сохранении пути в базе данных' });
    }
});

// Маршрут для получения данных о пользователе
router.get('/user', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        // Если аватарка не найдена, можно установить дефолтное изображение
        if (!user.avatar) {
            user.avatar = 'images/default-avatar.svg';  // Путь к дефолтному изображению
        }
        console.log(`Данные пользователя: ${JSON.stringify(user)}`);

        res.json(user);  // Отправляем данные только для текущего пользователя
    } catch (err) {
        console.error('Ошибка при получении данных пользователя', err);
        res.status(500).json({ error: 'Ошибка при получении данных' });
    }
});

module.exports = router;







