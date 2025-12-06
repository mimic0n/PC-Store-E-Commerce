import api from './api';

// Đăng nhập Admin
export const adminLogin = async (credentials) => {
    const response = await api.post('/api/users/login', {
        email: credentials.email,
        password: credentials.password,
    });
    
    // Kiểm tra role admin
    if (response.data.success && response.data.data.user.role !== 'admin') {
        throw new Error('Bạn không có quyền truy cập Admin Dashboard');
    }
    
    return response.data;
};

// Đăng ký Admin (cần được approve bởi super admin)
export const adminRegister = async (userData) => {
    const response = await api.post('/api/users/register', {
        fullName: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        role: 'admin', // Backend cần xử lý logic approve
    });
    return response.data;
};

export const verifyEmail = async (email, otp) => {
    const response = await api.post('/api/users/verify-email', {
        email,
        otp,
    });
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await api.post('/api/users/forgot-password', { email });
    return response.data;
};

export const verifyForgotPasswordOTP = async (email, otp) => {
    const response = await api.post('/api/users/verify-forgot-password-otp', {
        email,
        otp,
    });
    return response.data;
};

export const resetPassword = async (email, otp, newPassword, confirmPassword) => {
    const response = await api.post('/api/users/reset-password', {
        email,
        otp,
        newPassword,
        confirmPassword,
    });
    return response.data;
};

export const adminLogout = async () => {
    const response = await api.post('/api/users/logout');
    return response.data;
};

export const getAdminProfile = async () => {
    const response = await api.get('/api/users/get-profile');
    return response.data;
};

export const resendOTP = async (email) => {
    const response = await api.post('/api/users/resend-otp', { email });
    return response.data;
};

export const updateAdminProfile = async (profileData) => {
    const response = await api.put('/api/users/update-profile', {
        fullName: profileData.fullName,
        phone: profileData.phone,
    });
    return response.data;
};

export const changePassword = async (passwordData) => {
    const response = await api.put('/api/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
    });
    return response.data;
};