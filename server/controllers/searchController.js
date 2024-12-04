const { searchUsers } = require('../models/searchModels');

const getSearchResults = async (req, res) => {
    const { name, age, address } = req.query; // Используйте req.query для параметров

    const searchQuery = {
        name: name || null,
        age: age || null,
        address: address || null,
    };

    try {
        const results = await searchUsers(searchQuery);
        res.status(200).json(results);  // Отправляем результаты поиска
    } catch (error) {
        console.error('Ошибка при поиске пользователей:', error);  // Логирование ошибки
        res.status(500).json({ message: 'Ошибка сервера. Попробуйте позже.' });
    }
};

module.exports = { getSearchResults };
