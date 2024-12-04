const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware'); // Импортируйте middleware для проверки токена

const router = express.Router();

// Определите маршруты
router.get('/', verifyToken, getUserProfile); // Использование verifyToken для защиты маршрута
router.put('/', verifyToken, updateUserProfile); // Аналогично для обновления пользователя

module.exports = router;


