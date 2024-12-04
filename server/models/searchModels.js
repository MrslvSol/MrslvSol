const express = require('express');
const path = require('path');
const pool = require('../models/db'); // Убедитесь, что у вас есть конфигурация пула

// Поиск пользователей
const searchUsers = async (searchQuery) => {
    const { name, age, address } = searchQuery;

    let query = `SELECT first_name, last_name, birth_date, address, avatar FROM users WHERE 1=1`;
    const values = [];

    if (name) {
        query += ` AND (LOWER(first_name) LIKE $1 OR LOWER(last_name) LIKE $1)`;
        values.push(`%${name.toLowerCase()}%`);
    }

    if (age) {
        query += ` AND EXTRACT(YEAR FROM AGE(birth_date)) = $${values.length + 1}`;
        values.push(age);
    }

    if (address) {
        query += ` AND LOWER(address) LIKE $${values.length + 1}`;
        values.push(`%${address.toLowerCase()}%`);
    }

    try {
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        console.error('Ошибка при поиске пользователей:', error);
        throw error;
    }
};

module.exports = { searchUsers };
