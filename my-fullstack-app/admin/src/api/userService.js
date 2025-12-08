import api from './api.js';

// Lấy tất cả users với phân trang và filter
export const getAllUsers = async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.order) queryParams.append('order', params.order);
    
    const response = await api.get(`/api/admin/users?${queryParams.toString()}`);
    return response.data;
};

// Lấy thông tin chi tiết user
export const getUserById = async (userId) => {
    const response = await api.get(`/api/admin/users/${userId}`);
    return response.data;
};

// Cập nhật thông tin user
export const updateUser = async (userId, userData) => {
    const response = await api.put(`/api/admin/users/${userId}`, userData);
    return response.data;
};

// Block/Unblock user
export const toggleUserStatus = async (userId, status) => {
    const response = await api.put(`/api/admin/users/${userId}/status`, { status });
    return response.data;
};

// Xóa user
export const deleteUser = async (userId) => {
    const response = await api.delete(`/api/admin/users/${userId}`);
    return response.data;
};

// Lấy thống kê users
export const getUserStats = async () => {
    const response = await api.get('/api/admin/users/stats');
    return response.data;
};

// Export users ra CSV/Excel
export const exportUsers = async (format = 'csv') => {
    const response = await api.get(`/api/admin/users/export?format=${format}`, {
        responseType: 'blob'
    });
    return response.data;
};

// Lấy lịch sử đơn hàng của user
export const getUserOrders = async (userId, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const response = await api.get(`/api/admin/users/${userId}/orders?${queryParams.toString()}`);
    return response.data;
};