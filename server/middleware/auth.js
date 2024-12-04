const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Получаем токен из заголовка

    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    jwt.verify(token, '123456', (err, decoded) => {
        if (err) {
            console.error('Ошибка верификации токена:', err);
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.user = decoded; // Добавляем информацию о пользователе в req
        next();
    });
};

module.exports = authenticateUser;
