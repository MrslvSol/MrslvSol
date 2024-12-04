const pool = require('./db'); // Подключаем db.js из папки models

// Функция для поиска пользователя по email
const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const values = [email];
  const result = await pool.query(query, values);
  return result.rows[0]; // возвращает пользователя или undefined, если не найден
};

// Функция для создания нового пользователя
const createUser = async (first_name, last_name, address, birth_date, email, password) => {
  const query = `
    INSERT INTO users (first_name, last_name, address, birth_date, email, password)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [first_name, last_name, address, birth_date, email, password];
  const result = await pool.query(query, values);
  return result.rows[0]; // возвращает нового пользователя
};

module.exports = { findUserByEmail, createUser };
