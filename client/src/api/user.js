import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3001/api/user',
});

export const getUserProfile = (id) => API.get(`/${id}`);
export const updateUserProfile = (id, data) => API.put(`/${id}`, data);
