import api from './api';

// Đăng ký tài khoản
export const registerUser = async (userData) => {
    const response = await api.post('/api/users/register', {
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
    });
    return response.data;
};

// Xác thực email với OTP
export const verifyEmail = async (email, otp) => {
    const response = await api.post('/api/users/verify-email', {
        email,
        otp,
    });
    return response.data;
};

// Đăng nhập
export const loginUser = async (credentials) => {
    const response = await api.post('/api/users/login', {
        email: credentials.email,
        password: credentials.password,
    });
    return response.data;
};

// Đăng xuất
export const logoutUser = async () => {
    const response = await api.post('/api/users/logout');
    return response.data;
};

// Quên mật khẩu
export const forgotPassword = async (email) => {
    const response = await api.post('/api/users/forgot-password', { email });
    return response.data;
};

// Xác thực OTP quên mật khẩu
export const verifyForgotPasswordOTP = async (email, otp) => {
    const response = await api.post('/api/users/verify-forgot-password-otp', {
        email,
        otp,
    });
    return response.data;
};

// Reset mật khẩu
export const resetPassword = async (email, newPassword, otp) => {
    const response = await api.post('/api/users/reset-password', {
        email,
        newPassword,
        otp,
    });
    return response.data;
};

/// Lấy thông tin user
export const getUserProfile = async () => {
    const response = await api.get('/api/users/get-profile');
    return response.data;
};

// Cập nhật thông tin profile
export const updateUserProfile = async (profileData) => {
    const response = await api.put('/api/users/update-profile', {
        fullName: profileData.fullName,
        phone: profileData.phone,
    });
    return response.data;
};

// Đổi mật khẩu
export const changePassword = async (passwordData) => {
    const response = await api.put('/api/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
    });
    return response.data;
};

export const resendOTP = async (email) => {
    const response = await api.post('/api/users/resend-otp', { email });
    return response.data;
};