const db = require('../models/db');

exports.getUserProfile = async (req, res) => {
    const userId = req.userId; // Получаем ID пользователя из токена

    try {
        const user = await db.query(`SELECT avatar, first_name, last_name, address, birth_date FROM users WHERE id = $1`, [userId]);
        if (user.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    const userId = req.userId; // Получаем ID пользователя из токена
    const { email, first_name, last_name, address, birth_date } = req.body; // Извлекаем данные из запроса

    try {
        // Выполняем обновление профиля
        await db.query(`UPDATE users SET email = $1, first_name = $2, last_name = $3, address = $4, birth_date = $5 WHERE id = $6`, 
            [email, first_name, last_name, address, birth_date, userId]);
        
        res.status(200).json({ message: "Profile updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


