import User from '../models/User.model.js';
import { Order, OrderItem } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/connectDB.js';

// Lấy tất cả users (Admin only)
export async function getAllUsers(request, response) {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            status = '',
            sortBy = 'createdAt',
            order = 'DESC'
        } = request.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);
        
        // Build where clause
        const whereClause = {
            role: 'user' // Chỉ lấy users, không lấy admin
        };

        // Search theo name hoặc email
        if (search) {
            whereClause[Op.or] = [
                { fullName: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { phone: { [Op.like]: `%${search}%` } }
            ];
        }

        // Filter theo status
        if (status && status !== 'all') {
            if (status === 'active') {
                whereClause.isActive = true;
            } else if (status === 'blocked') {
                whereClause.isActive = false;
            }
        }

        // Validate sort field
        const allowedSortFields = ['createdAt', 'fullName', 'email', 'status', 'lastLoginDate'];
        const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
        const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        const { count, rows: users } = await User.findAndCountAll({
            where: whereClause,
            attributes: [
                'id', 
                'fullName', 
                'email', 
                'phone', 
                'avatar', 
                'isActive',  
                'isEmailVerified',
                'lastLoginAt', 
                'createdAt',
                'updatedAt'
            ],
            order: [[sortField, sortOrder]],
            limit: parseInt(limit),
            offset: offset
        });

        // Lấy thêm thông tin orders cho mỗi user
        const usersWithStats = await Promise.all(users.map(async (user) => {
            const orderStats = await Order.findAll({
                where: { userId: user.id },
                attributes: [
                    [sequelize.fn('COUNT', sequelize.col('id')), 'totalOrders'],
                    [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalSpent']
                ],
                raw: true
            });

            return {
                ...user.toJSON(),
                status: user.isActive ? 'active' : 'blocked',  // Map cho frontend
                lastLoginDate: user.lastLoginAt,  // Map cho frontend
                totalOrders: parseInt(orderStats[0]?.totalOrders) || 0,
                totalSpent: parseFloat(orderStats[0]?.totalSpent) || 0
            };
        }));

        const totalPages = Math.ceil(count / parseInt(limit));

        return response.status(200).json({
            success: true,
            data: {
                users: usersWithStats,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems: count,
                    itemsPerPage: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Get all users error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: 'Lỗi khi lấy danh sách người dùng'
        });
    }
}

// Lấy thống kê users
export async function getUserStats(request, response) {
    try {
        const totalUsers = await User.count({ where: { role: 'user' } });
        const activeUsers = await User.count({ where: { role: 'user', isActive: true } });
        const blockedUsers = await User.count({ where: { role: 'user', isActive: false } });


        // Users đăng ký trong 30 ngày qua
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const newUsersThisMonth = await User.count({
            where: {
                role: 'user',
                createdAt: { [Op.gte]: thirtyDaysAgo }
            }
        });

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const activeThisWeek = await User.count({
            where: {
                role: 'user',
                lastLoginAt: { [Op.gte]: sevenDaysAgo }
            }
        });

        return response.status(200).json({
            success: true,
            data: {
                totalUsers,
                activeUsers,
                blockedUsers,
                pendingUsers: 0, 
                newUsersThisMonth,
                activeThisWeek
            }
        });

    } catch (error) {
        console.error('Get user stats error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: 'Lỗi khi lấy thống kê người dùng'
        });
    }
}

// Lấy chi tiết user
export async function getUserById(request, response) {
    try {
        const { userId } = request.params;

        const user = await User.findOne({
            where: { id: userId, role: 'user' },
            attributes: { exclude: ['password', 'refreshToken', 'otp', 'otpExpiry'] }
        });

        if (!user) {
            return response.status(404).json({
                success: false,
                error: true,
                message: 'Không tìm thấy người dùng'
            });
        }

        // Lấy thống kê orders
        const orderStats = await Order.findAll({
            where: { userId: user.id },
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalOrders'],
                [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalSpent']
            ],
            raw: true
        });

        // Lấy 5 orders gần nhất
        const recentOrders = await Order.findAll({
            where: { userId: user.id },
            order: [['createdAt', 'DESC']],
            limit: 5,
            include: [{
                model: OrderItem,
                as: 'items'
            }]
        });

        return response.status(200).json({
            success: true,
            data: {
                user: {
                    ...user.toJSON(),
                    totalOrders: parseInt(orderStats[0]?.totalOrders) || 0,
                    totalSpent: parseFloat(orderStats[0]?.totalSpent) || 0
                },
                recentOrders
            }
        });

    } catch (error) {
        console.error('Get user by id error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: 'Lỗi khi lấy thông tin người dùng'
        });
    }
}

// Cập nhật user (Admin)
export async function updateUser(request, response) {
    try {
        const { userId } = request.params;
        const { fullName, phone, status } = request.body;

        const user = await User.findOne({
            where: { id: userId, role: 'user' }
        });

        if (!user) {
            return response.status(404).json({
                success: false,
                error: true,
                message: 'Không tìm thấy người dùng'
            });
        }

        // Cập nhật fields
        if (fullName) user.fullName = fullName;
        if (phone) user.phone = phone;
        if (status && ['active', 'blocked', 'pending'].includes(status)) {
            user.status = status;
        }

        await user.save();

        return response.status(200).json({
            success: true,
            message: 'Cập nhật người dùng thành công',
            data: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                status: user.status
            }
        });

    } catch (error) {
        console.error('Update user error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: 'Lỗi khi cập nhật người dùng'
        });
    }
}

// Toggle user status (Block/Unblock)
export async function toggleUserStatus(request, response) {
    try {
        const { userId } = request.params;
        const { status } = request.body;

        if (!['active', 'blocked'].includes(status)) {
            return response.status(400).json({
                success: false,
                error: true,
                message: 'Trạng thái không hợp lệ'
            });
        }

        const user = await User.findOne({
            where: { id: userId, role: 'user' }
        });

        if (!user) {
            return response.status(404).json({
                success: false,
                error: true,
                message: 'Không tìm thấy người dùng'
            });
        }

        user.status = status;
        await user.save();

        return response.status(200).json({
            success: true,
            message: status === 'blocked' 
                ? 'Đã chặn người dùng thành công' 
                : 'Đã mở chặn người dùng thành công',
            data: {
                id: user.id,
                status: user.status
            }
        });

    } catch (error) {
        console.error('Toggle user status error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: 'Lỗi khi thay đổi trạng thái người dùng'
        });
    }
}

// Xóa user (Soft delete hoặc hard delete)
export async function deleteUser(request, response) {
    try {
        const { userId } = request.params;

        const user = await User.findOne({
            where: { id: userId, role: 'user' }
        });

        if (!user) {
            return response.status(404).json({
                success: false,
                error: true,
                message: 'Không tìm thấy người dùng'
            });
        }

        // Kiểm tra xem user có orders không
        const hasOrders = await Order.count({ where: { userId } });
        
        if (hasOrders > 0) {
            // Soft delete - chỉ đánh dấu là deleted
            user.status = 'deleted';
            user.email = `deleted_${Date.now()}_${user.email}`;
            await user.save();

            return response.status(200).json({
                success: true,
                message: 'Đã vô hiệu hóa người dùng (có đơn hàng liên quan)'
            });
        } else {
            // Hard delete nếu không có orders
            await user.destroy();

            return response.status(200).json({
                success: true,
                message: 'Đã xóa người dùng thành công'
            });
        }

    } catch (error) {
        console.error('Delete user error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: 'Lỗi khi xóa người dùng'
        });
    }
}

// Lấy orders của user
export async function getUserOrders(request, response) {
    try {
        const { userId } = request.params;
        const { page = 1, limit = 10 } = request.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);

        const { count, rows: orders } = await Order.findAndCountAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset,
            include: [{
                model: OrderItem,
                as: 'items'
            }]
        });

        return response.status(200).json({
            success: true,
            data: {
                orders,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(count / parseInt(limit)),
                    totalItems: count
                }
            }
        });

    } catch (error) {
        console.error('Get user orders error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: 'Lỗi khi lấy đơn hàng của người dùng'
        });
    }
}