// client/services/axios.ts
import axios from 'axios';

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

API.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const res = await axios.get('http://localhost:5000/api/auth/refresh', {
                        withCredentials: true,
                    });
                    const newToken = res.data.accessToken;
                    localStorage.setItem('accessToken', newToken);
                    refreshSubscribers.forEach((cb) => cb(newToken));
                    refreshSubscribers = [];
                } catch (err) {
                    localStorage.removeItem('accessToken');
                    window.location.href = '/login';
                    return Promise.reject(err);
                } finally {
                    isRefreshing = false;
                }
            }

            return new Promise((resolve) => {
                refreshSubscribers.push((token: string) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    resolve(API(originalRequest));
                });
            });
        }

        return Promise.reject(error);
    }
);

export default API;
