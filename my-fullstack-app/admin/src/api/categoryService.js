import api from "./api"

export const getAllCategories = async (params = {}) => { 
    const queryParams = new URLSearchParams()

    if (params.page) { 
        queryParams.append("page", params.page)
    }

    if (params.limit) { 
        queryParams.append("limit", params.limit)
    }

    if (params.search) { 
        queryParams.append("search", params.search)
    }

    if (params.isActive !== undefined) { 
        queryParams.append("isActive", params.isActive)
    }

    if (params.parentId !== undefined) { 
        queryParams.append("parentId", params.parentId)
    }

    if (params.includeChildren) { 
        queryParams.append("includeChildren", params.includeChildren)
    }

    const response = await api.get(`/api/categories?${queryParams.toString()}`)
    return response.data
}

export const getCategoryTree = async () => { 
    const response = await api.get('/api/categories/tree');
    return response.data;
}

export const getCategoryById = async (id) => {
    const response = await api.get(`/api/categories/id/${id}`);
    return response.data;
}

export const getCategoryBySlug = async (slug) => {
    const response = await api.get(`/api/categories/slug/${slug}`);
    return response.data;
}

export const createCategory = async (categoryData) => {
    const response = await api.post('/api/categories/create', categoryData);
    return response.data;
}

export const updateCategory = async (id, categoryData) => {
    const response = await api.put(`/api/categories/update/${id}`, categoryData);
    return response.data;
}

export const deleteCategory = async (id) => {
    const response = await api.delete(`/api/categories/delete/${id}`);
    return response.data;  
}