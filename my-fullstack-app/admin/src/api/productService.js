import api from "./api"

export const uploadProductImages = async (files) => {
    const formData = new FormData();
    files.forEach(file => {
        formData.append('images', file);
    });
    
    const response = await api.post('/api/products/uploadImages', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
}

export const createProduct = async (productData) => {
    const response = await api.post('/api/products/create', productData);
    return response.data;
}

export const getAllProducts = async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.order) queryParams.append('order', params.order);
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive);
    
    const response = await api.get(`/api/products/getAllProducts?${queryParams.toString()}`);
    return response.data;
}

export const getProductById = async (id) => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
}

export const updateProduct = async (id, productData) => {
    const response = await api.put(`/api/products/updateProduct/${id}`, productData);
    return response.data;
}

export const deleteProduct = async (id) => {
    const response = await api.delete(`/api/products/${id}`);
    return response.data;
}

export const removeImage = async (publicId) => {
    const response = await api.delete('/api/products/deleteImage', {
        data: { publicId }
    });
    return response.data;
}

export const getProductsCount = async () => {
    const response = await api.get('/api/products/getAllProductsCount');
    return response.data;
}

export const getFeaturedProducts = async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit);
    
    const response = await api.get(`/api/products/getAllFeaturedProducts?${queryParams.toString()}`);
    return response.data;
}