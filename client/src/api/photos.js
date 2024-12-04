import axios from 'axios';
let token = localStorage.getItem("authToken")

const config = {
    headers: { Authorization: `Bearer ${token}` }
};
const API = axios.create({
    baseURL: 'http://localhost:3001/photos'
});

export const getPhotos = () => API.get(`/user/photos`, config);
