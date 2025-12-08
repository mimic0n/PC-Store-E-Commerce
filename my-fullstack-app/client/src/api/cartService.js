import api from './api.js';

// Lấy giỏ hàng
export const getCart = async () => {
    const response = await api.get('/api/cart');
    return response.data;
};

export const getCartItemsCount = async () => {
    const response = await api.get('/api/cart/count');
    return response.data;
};

export const addToCart = async (productId, quantity = 1) => {
    const response = await api.post('/api/cart/add', { productId, quantity });
    return response.data;
};

export const updateCartItem = async (cartItemId, quantity) => {
    const response = await api.put(`/api/cart/update/${cartItemId}`, { quantity });
    return response.data;
};

export const removeFromCart = async (cartItemId) => {
    const response = await api.delete(`/api/cart/remove/${cartItemId}`);
    return response.data;
};

export const clearCart = async () => {
    const response = await api.delete('/api/cart/clear');
    return response.data;
};

export const syncCart = async (items) => {
    const response = await api.post('/api/cart/sync', { items });
    return response.data;
};