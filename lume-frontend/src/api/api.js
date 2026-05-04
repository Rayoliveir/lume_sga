// src/api/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:5251/api"
});

export default api;