import React, { useState, useEffect } from 'react';
import { getMessages, sendMessage } from '../api/message';

function Messages() {
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState('');

    useEffect(() => {
        getMessages(1, 2) // Пример: пользователь 1 и 2
            .then((response) => setMessages(response.data))
            .catch((err) => console.error(err));
    }, []);

    const handleSendMessage = () => {
        sendMessage({ senderId: 1, receiverId: 2, content }) // Пример: отправитель = 1
            .then((response) => setMessages([...messages, response.data]))
            .catch((err) => console.error(err));
    };

    return (
        <div>
            <h2>Messages</h2>
            <ul>
                {messages.map((message) => (
                    <li key={message.id}>
                        <p>{message.content}</p>
                    </li>
                ))}
            </ul>
            <input
                type="text"
                placeholder="Type your message"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
}

export default Messages;
