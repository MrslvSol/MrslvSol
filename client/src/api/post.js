import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3001/api/posts',
});

export const getPosts = () => API.get('/');
export const createPost = (data) => API.post('/', data);
