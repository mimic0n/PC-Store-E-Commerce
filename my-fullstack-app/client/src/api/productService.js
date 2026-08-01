import api from "./api";

export const getAllProducts = async (params = {}) => {
    const cache = new Map();
    const CACHE_DURATION = 5 * 60 * 1000;

    const cacheKey = JSON.stringify(params);
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    
    const response = await api.get(`/api/products/getAllProducts?...`);
    cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
    });
    
    return response.data;
};

export const getProductById = async (id) => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
};

export const getProductsByCategoryId = async (categoryId, params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.order) queryParams.append('order', params.order);
    
    const response = await api.get(`/api/products/getAllProductsByCatId/${categoryId}?${queryParams.toString()}`);
    return response.data;
};

export const getProductsByCategoryName = async (categoryName, params = {}) => {
    const queryParams = new URLSearchParams();
    
    queryParams.append('name', categoryName);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.order) queryParams.append('order', params.order);
    
    const response = await api.get(`/api/products/getAllProductsByCatName?${queryParams.toString()}`);
    return response.data;
};

export const getProductsBySubCategoryId = async (subCatId, params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.order) queryParams.append('order', params.order);
    
    const response = await api.get(`/api/products/getAllProductsBySubCatId/${subCatId}?${queryParams.toString()}`);
    return response.data;
};

export const getProductsByPrice = async (minPrice, maxPrice, params = {}) => {
    const queryParams = new URLSearchParams();
    
    queryParams.append('minPrice', minPrice);
    queryParams.append('maxPrice', maxPrice);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const response = await api.get(`/api/products/getAllProductsByPrice?${queryParams.toString()}`);
    return response.data;
};

export const getFeaturedProducts = async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.limit) queryParams.append('limit', params.limit);
    
    const response = await api.get(`/api/products/getAllFeaturedProducts?${queryParams.toString()}`);
    return response.data;
};

export const getProductsCount = async () => {
    const response = await api.get('/api/products/getAllProductsCount');
    return response.data;
};

// Search products by keyword
export const searchProducts = async (keyword, params = {}) => {
    const queryParams = new URLSearchParams();
    
    queryParams.append('search', keyword);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.order) queryParams.append('order', params.order);
    
    const response = await api.get(`/api/products/getAllProducts?${queryParams.toString()}`);
    return response.data;
};