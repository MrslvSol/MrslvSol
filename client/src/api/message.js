import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3001/api/messages',
});

export const getMessages = (senderId, receiverId) =>
    API.get('/', { params: { senderId, receiverId } });
export const sendMessage = (data) => API.post('/', data);
