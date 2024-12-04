const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).send('Token is required');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send('Invalid Token');
        }

        req.userId = decoded.id; // Убедитесь, что в токене есть `id`
        console.log('userId из токена:', req.userId); // Лог для проверки
        next();
    });
};

module.exports = verifyToken;

