const db = require('../models/db');

exports.getMessages = async (req, res) => {
    const { senderId, receiverId } = req.query;

    try {
        const messages = await db.query(
            `SELECT * FROM messages WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1) ORDER BY created_at ASC`,
            [senderId, receiverId]
        );
        res.status(200).json(messages.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.sendMessage = async (req, res) => {
    const { senderId, receiverId, content } = req.body;

    try {
        const newMessage = await db.query(
            `INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *`,
            [senderId, receiverId, content]
        );
        res.status(201).json(newMessage.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
