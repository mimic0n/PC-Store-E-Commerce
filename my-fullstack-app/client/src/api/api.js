import axios from 'axios';

// Base URL của backend
const API_BASE_URL = 'http://localhost:5000';

// Tạo axios instance với config mặc định
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // cho phép gửi cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor để tự động thêm token vào header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor để xử lý response và refresh token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Nếu token hết hạn (401) và chưa retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                // Gọi API refresh token
                const response = await axios.post(
                    `${API_BASE_URL}/api/users/refresh-token`,
                    {},
                    { withCredentials: true }
                );
                
                const { accessToken } = response.data.data;
                localStorage.setItem('accessToken', accessToken);
                
                // Retry request với token mới
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh token cũng hết hạn -> logout
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                window.location.href = '/Login';
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;