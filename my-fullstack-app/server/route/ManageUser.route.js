import { Router } from 'express';
import { auth } from '../middlewares/auth.js';  // Thêm dòng này
import adminAuth from '../middlewares/adminAuth.js';
import {
    getAllUsers,
    getUserStats,
    getUserById,
    updateUser,
    toggleUserStatus,
    deleteUser,
    getUserOrders
} from '../controllers/ManageUser.Controller.js';

const adminUserRouter = Router();

adminUserRouter.use(auth);      
adminUserRouter.use(adminAuth); 

// GET /api/admin/users - Lấy danh sách users
adminUserRouter.get('/', getAllUsers);

// GET /api/admin/users/stats - Lấy thống kê users
adminUserRouter.get('/stats', getUserStats);

// GET /api/admin/users/:userId - Lấy chi tiết user
adminUserRouter.get('/:userId', getUserById);

// PUT /api/admin/users/:userId - Cập nhật user
adminUserRouter.put('/:userId', updateUser);

// PUT /api/admin/users/:userId/status - Toggle status (block/unblock)
adminUserRouter.put('/:userId/status', toggleUserStatus);

// DELETE /api/admin/users/:userId - Xóa user
adminUserRouter.delete('/:userId', deleteUser);

// GET /api/admin/users/:userId/orders - Lấy orders của user
adminUserRouter.get('/:userId/orders', getUserOrders);

export default adminUserRouter;