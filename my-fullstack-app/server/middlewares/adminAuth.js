import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export const adminAuth = async (request, response, next) => {
    try {
        // Phải chạy qua auth middleware trước
        if (!request.user) {
            return response.status(401).json({
                message: 'Vui lòng đăng nhập',
                error: true,
                success: false
            });
        }

        if (request.user.role !== 'admin') {
            return response.status(403).json({
                message: 'Bạn không có quyền truy cập',
                error: true,
                success: false
            });
        }

        next();
    }
    catch (error) {
        console.error('Admin auth error:', error);
        return response.status(500).json({
            message: 'Lỗi xác thực quyền',
            error: true,
            success: false
        });
    }
};

export default adminAuth;