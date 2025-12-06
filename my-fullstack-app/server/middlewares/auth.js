import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export const auth = async (request, response, next) => { 
    try {
        // 1. Lấy token từ cookies hoặc header
        const token = request.cookies?.accessToken ||
                    request.headers?.authorization?.split(" ")[1]; // Lấy phần sau "Bearer "
        if (!token) { 
            return response.status(401).json({
                success: false,
                message: 'Hãy đăng nhập để tiếp tục',
                error: true,
                success: false
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.id) {
            return response.status(401).json({
                success: false,
                message: 'Token không hợp lệ',
                error: true
            });
        }   
        
        const user = await User.findOne({
            where: {
                id: decoded.id,
                isActive: true
            },
            attributes: ['id', 'email', 'fullName', 'role', 'isVerified']
        })

        if (!user) { 
            return response.status(401).json({
                success: false,
                message: 'Người dùng không tồn tại hoặc đã bị vô hiệu hóa.',
                error: true
            });
        }

        if (!user.isVerified) {
            return response.status(403).json({
                success: false,
                message: 'Vui lòng xác thực email để tiếp tục.',
                error: true
            });
        }

        // Gắn thông tin user vào request để dùng ở các route tiếp theo
        request.user = {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role
        };
        next(); // Cho phép tiếp tục đến route handler
    }
    catch (error) {
          if (error.name === 'TokenExpiredError') {
            return response.status(401).json({
                message: 'Token đã hết hạn. Vui lòng đăng nhập lại',
                error: true,
                success: false,
                code: 'TOKEN_EXPIRED'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return response.status(401).json({
                message: 'Token không hợp lệ',
                error: true,
                success: false,
                code: 'INVALID_TOKEN'
            });
        }

        console.error('Auth middleware error:', error);
        return response.status(500).json({
            message: 'Lỗi xác thực. Vui lòng thử lại',
            error: true,
            success: false
        });
    }
}

export default auth;