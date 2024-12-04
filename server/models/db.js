const { Pool } = require('pg'); // Импортируем модуль pg
require('dotenv').config(); // Загружаем переменные окружения из .env

// Настраиваем соединение
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD || '', // Если пароль отсутствует, оставляем пустым
    port: process.env.DB_PORT,
});

// Проверка соединения
pool.connect((err, client, release) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err.stack);
    } else {
        console.log('Успешное подключение к базе данных');
    }
    release();
});

module.exports = pool;

