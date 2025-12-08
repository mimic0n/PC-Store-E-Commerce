import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import {
    createOrder,
    getUserOrders,
    getOrderDetail,
    cancelOrder,
    validateVoucher
} from '../controllers/Order.controller.js';

const orderRouter = Router();

orderRouter.use(auth);

// Checkout - tạo đơn hàng
orderRouter.post('/checkout', createOrder);

// Lấy danh sách đơn hàng của user
orderRouter.get('/', getUserOrders);

// Lấy chi tiết đơn hàng
orderRouter.get('/:orderId', getOrderDetail);

// Hủy đơn hàng
orderRouter.put('/:orderId/cancel', cancelOrder);

// Validate voucher
orderRouter.post('/validate-voucher', validateVoucher);

export default orderRouter;