// file.js

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

// Подключение к базе данных через переменные окружения
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Конфигурация хранения файлов с уникальными именами
const storage = multer.diskStorage({
    destination(req, file, cb) {
        const uploadDir = path.join(__dirname, '../images');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename(req, file, cb) {
        const fileName = req.user.id + '-' + new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname;
        cb(null, fileName); // Уникальное имя файла для каждого пользователя
    }
});

// Допустимые типы файлов
const types = ['image/png', 'image/jpeg', 'image/jpg'];

// Фильтр для проверки типа файла
const fileFilter = (req, file, cb) => {
    if (types.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Недопустимый тип файла'), false);
    }
};

// Настройки multer
const upload = multer({
    storage,
    fileFilter
});

// Создаем Express-приложение
const app = express();

// Раздаем папку с изображениями через HTTP
app.use('/images', express.static(path.join(__dirname, '../images')));

// Middleware для проверки токена JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Извлекаем токен после "Bearer"
    
    if (!token) return res.status(401).json({ error: 'Токен отсутствует' });

    jwt.verify(token, '123456', (err, user) => {
        if (err) {
            const statusCode = err.name === 'TokenExpiredError' ? 403 : 401;
            return res.status(statusCode).json({ error: err.message });
        }
        req.user = user;
        next();
    });
};

// Эндпоинт для загрузки аватарки
app.post('/api/upload', authenticateToken, upload.single('avatar'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Файл не загружен' });
    }

    const filePath = `images/${req.file.filename}`; // Относительный путь к файлу
    const userId = req.user.id; // Получаем ID текущего пользователя

    try {
        // Обновляем запись в таблице users для этого пользователя
        const result = await pool.query('UPDATE users SET avatar = $1 WHERE id = $2 RETURNING *', [filePath, userId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        // Возвращаем успешный ответ с данными пользователя, включая путь к аватару
        const updatedUser = result.rows[0];  // Получаем обновленного пользователя
        res.status(200).json({
            message: 'Аватар обновлен',
            path: filePath,
            avatar: updatedUser.avatar  // Возвращаем путь к новому аватару
        });
    } catch (error) {
        console.error('Ошибка сохранения в базу данных:', error);
        res.status(500).json({ error: 'Ошибка сохранения файла в базе данных' });
    }
});

// Эндпоинт для получения аватарки пользователя
app.get('/api/avatar', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        // Получаем информацию о пользователе, включая аватар
        const result = await pool.query('SELECT avatar FROM users WHERE id = $1', [userId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        const avatar = result.rows[0].avatar;  // Путь к аватарке
        res.status(200).json({ avatar });
    } catch (error) {
        console.error('Ошибка получения данных о пользователе:', error);
        res.status(500).json({ error: 'Ошибка при получении аватара' });
    }
});


// Запуск сервера
app.listen(3001, () => {
    console.log('Server running on port 3001');
});


