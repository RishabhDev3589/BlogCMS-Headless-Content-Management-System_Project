import axios from 'axios';

// Create axios instance
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Make sure this matches backend port
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Simple token storage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 (Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token invalid or expired - logout user
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            // Ideally redirect to login, but we'll let the UI handle the missing token state
        }
        return Promise.reject(error);
    }
);

export default api;
