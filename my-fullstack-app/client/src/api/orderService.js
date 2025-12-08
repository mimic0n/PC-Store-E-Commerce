import api from './api.js';

// Updated: Hỗ trợ gửi selectedProductIds
export const createOrder = async (orderData) => {
    const response = await api.post('/api/orders/checkout', orderData);
    return response.data;
};

export const getUserOrders = async (params = {}) => {
    const response = await api.get('/api/orders', { params });
    return response.data;
};

export const getOrderDetail = async (orderId) => {
    const response = await api.get(`/api/orders/${orderId}`);
    return response.data;
};

export const cancelOrder = async (orderId, reason) => {
    const response = await api.put(`/api/orders/${orderId}/cancel`, { reason });
    return response.data;
};

export const validateVoucher = async (code, subtotal) => {
    const response = await api.post('/api/orders/validate-voucher', { code, subtotal });
    return response.data;
};