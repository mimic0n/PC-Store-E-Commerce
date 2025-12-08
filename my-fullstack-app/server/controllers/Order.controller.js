import { Order, OrderItem, Cart, CartItem, Product, Voucher, User } from '../models/index.js';
import sequelize from '../config/connectDB.js';
import { Op } from 'sequelize';

const generateOrderCode = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD${timestamp}${random}`;
};

export async function createOrder(request, response) {
    const transaction = await sequelize.transaction();
    
    try {
        const userId = request.user.id;
        const {
            fullName,
            phone,
            email,
            province,
            district,
            ward,
            address,
            note,
            shippingMethod = 'standard',
            paymentMethod = 'cod',
            voucherCode,
            selectedProductIds
        } = request.body;

        if (!fullName || !phone || !address) {
            return response.status(400).json({
                success: false,
                error: true,
                message: 'Vui lòng điền đầy đủ thông tin giao hàng'
            });
        }

        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (!phoneRegex.test(phone)) {
            return response.status(400).json({
                success: false,
                error: true,
                message: 'Số điện thoại không hợp lệ'
            });
        }

        const cart = await Cart.findOne({
            where: { userId },
            include: [{
                model: CartItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product'
                }]
            }]
        });

        if (!cart || !cart.items || cart.items.length === 0) {
            return response.status(400).json({
                success: false,
                error: true,
                message: 'Giỏ hàng trống'
            });
        }

        let itemsToProcess = cart.items;
        if (selectedProductIds && selectedProductIds.length > 0) {
            itemsToProcess = cart.items.filter(item => 
                selectedProductIds.includes(item.productId)
            );
            
            if (itemsToProcess.length === 0) {
                return response.status(400).json({
                    success: false,
                    error: true,
                    message: 'Không tìm thấy sản phẩm được chọn trong giỏ hàng'
                });
            }
        }

        let subtotal = 0;
        const orderItems = [];
        for (const item of itemsToProcess) {
            const product = item.product;
            
            if (!product || !product.isActive) {
                await transaction.rollback();
                return response.status(400).json({
                    success: false,
                    error: true,
                    message: `Sản phẩm "${item.product?.name || 'Unknown'}" không còn khả dụng`
                });
            }

            if (product.quantity < item.quantity) {
                await transaction.rollback();
                return response.status(400).json({
                    success: false,
                    error: true,
                    message: `Sản phẩm "${product.name}" chỉ còn ${product.quantity} trong kho`
                });
            }

            const itemPrice = product.salePrice || product.price;
            const totalPrice = itemPrice * item.quantity;
            subtotal += totalPrice;

            orderItems.push({
                productId: product.id,
                productName: product.name,
                productImage: product.thumbnail,
                brand: product.brand,
                quantity: item.quantity,
                price: product.price,
                salePrice: product.salePrice,
                totalPrice
            });
        }

        const processedProductIds = itemsToProcess.map(item => item.productId);
        await CartItem.destroy({
            where: {
                cartId: cart.id,
                productId: processedProductIds
            },
            transaction
        });

        const shippingFee = shippingMethod === 'express' ? 50000 : 
                          shippingMethod === 'same_day' ? 80000 : 30000;

        let discount = 0;
        let appliedVoucher = null;

        if (voucherCode) {
            const voucher = await Voucher.findOne({
                where: {
                    code: voucherCode,
                    isActive: true,
                    startDate: { [Op.lte]: new Date() },
                    endDate: { [Op.gte]: new Date() }
                }
            });

            if (!voucher) {
                await transaction.rollback();
                return response.status(400).json({
                    success: false,
                    error: true,
                    message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn'
                });
            }

            if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
                await transaction.rollback();
                return response.status(400).json({
                    success: false,
                    error: true,
                    message: 'Mã giảm giá đã hết lượt sử dụng'
                });
            }

            if (subtotal < voucher.minOrderAmount) {
                await transaction.rollback();
                return response.status(400).json({
                    success: false,
                    error: true,
                    message: `Đơn hàng tối thiểu ${voucher.minOrderAmount.toLocaleString('vi-VN')}đ để sử dụng mã này`
                });
            }

            if (voucher.discountType === 'percentage') {
                discount = (subtotal * voucher.discountValue) / 100;
                if (voucher.maxDiscountAmount && discount > voucher.maxDiscountAmount) {
                    discount = voucher.maxDiscountAmount;
                }
            } else {
                discount = voucher.discountValue;
            }

            appliedVoucher = voucher;
        }

        const totalAmount = subtotal + shippingFee - discount;

        // Lấy email từ user nếu không có
        const user = await User.findByPk(userId);
        const orderEmail = email || user.email;

        // Tính ngày giao hàng dự kiến
        const estimatedDelivery = new Date();
        if (shippingMethod === 'express') {
            estimatedDelivery.setDate(estimatedDelivery.getDate() + 2);
        } else if (shippingMethod === 'same_day') {
            estimatedDelivery.setDate(estimatedDelivery.getDate() + 1);
        } else {
            estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);
        }

        // Tạo order
        const order = await Order.create({
            orderCode: generateOrderCode(),
            userId,
            fullName,
            email: orderEmail,
            phone,
            address,
            province,
            district,
            ward,
            note,
            totalAmount,
            shippingFee,
            shippingMethod,
            estimatedDelivery,
            discount,
            voucherCode: appliedVoucher?.code || null,
            paymentMethod,
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
            orderStatus: 'pending'
        }, { transaction });

        // Tạo order items
        for (const item of orderItems) {
            await OrderItem.create({
                orderId: order.id,
                ...item
            }, { transaction });
        }

        // Trừ stock sản phẩm
        for (const item of cart.items) {
            await Product.decrement('quantity', {
                by: item.quantity,
                where: { id: item.productId },
                transaction
            });
        }

        // Cập nhật số lần sử dụng voucher
        if (appliedVoucher) {
            await Voucher.increment('usedCount', {
                by: 1,
                where: { id: appliedVoucher.id },
                transaction
            });
        }

        // Xóa cart
        await CartItem.destroy({
            where: { cartId: cart.id },
            transaction
        });

        await Cart.update(
            { totalAmount: 0 },
            { where: { id: cart.id }, transaction }
        );

        await transaction.commit();

        // Lấy order với đầy đủ thông tin
        const createdOrder = await Order.findOne({
            where: { id: order.id },
            include: [{
                model: OrderItem,
                as: 'orderItems'
            }]
        });

        return response.status(201).json({
            success: true,
            error: false,
            message: 'Đặt hàng thành công',
            data: createdOrder
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Create order error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi tạo đơn hàng'
        });
    }
}

// ========== GET USER ORDERS ==========
export async function getUserOrders(request, response) {
    try {
        const userId = request.user.id;
        const { page = 1, limit = 10, status } = request.query;

        const where = { userId };
        if (status) {
            where.orderStatus = status;
        }

        const offset = (page - 1) * limit;

        const { count, rows: orders } = await Order.findAndCountAll({
            where,
            include: [{
                model: OrderItem,
                as: 'items'
            }],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset
        });

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Lấy danh sách đơn hàng thành công',
            data: {
                orders,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / limit)
                }
            }
        });

    } catch (error) {
        console.error('Get user orders error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi lấy danh sách đơn hàng'
        });
    }
}

// ========== GET ORDER DETAIL ==========
export async function getOrderDetail(request, response) {
    try {
        const userId = request.user.id;
        const { orderId } = request.params;

        const order = await Order.findOne({
            where: { id: orderId, userId },
            include: [{
                model: OrderItem,
                as: 'items'
            }]
        });

        if (!order) {
            return response.status(404).json({
                success: false,
                error: true,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Lấy chi tiết đơn hàng thành công',
            data: order
        });

    } catch (error) {
        console.error('Get order detail error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi lấy chi tiết đơn hàng'
        });
    }
}

// ========== CANCEL ORDER ==========
export async function cancelOrder(request, response) {
    const transaction = await sequelize.transaction();
    
    try {
        const userId = request.user.id;
        const { orderId } = request.params;
        const { reason } = request.body;

        const order = await Order.findOne({
            where: { id: orderId, userId },
            include: [{
                model: OrderItem,
                as: 'items'
            }]
        });

        if (!order) {
            return response.status(404).json({
                success: false,
                error: true,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        // Chỉ cho phép hủy khi đơn hàng đang pending hoặc confirmed
        if (!['pending', 'confirmed'].includes(order.orderStatus)) {
            return response.status(400).json({
                success: false,
                error: true,
                message: 'Không thể hủy đơn hàng đang được giao hoặc đã hoàn thành'
            });
        }

        // Hoàn lại stock
        for (const item of order.items) {
            await Product.increment('quantity', {
                by: item.quantity,
                where: { id: item.productId },
                transaction
            });
        }

        // Cập nhật trạng thái đơn hàng
        await order.update({
            orderStatus: 'cancelled',
            cancelReason: reason || 'Khách hàng hủy đơn'
        }, { transaction });

        await transaction.commit();

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Hủy đơn hàng thành công',
            data: order
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Cancel order error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi hủy đơn hàng'
        });
    }
}

// ========== VALIDATE VOUCHER ==========
export async function validateVoucher(request, response) {
    try {
        const { code, subtotal } = request.body;

        if (!code) {
            return response.status(400).json({
                success: false,
                error: true,
                message: 'Vui lòng nhập mã giảm giá'
            });
        }

        const voucher = await Voucher.findOne({
            where: {
                code: code.toUpperCase(),
                isActive: true,
                startDate: { [Op.lte]: new Date() },
                endDate: { [Op.gte]: new Date() }
            }
        });

        if (!voucher) {
            return response.status(404).json({
                success: false,
                error: true,
                message: 'Mã giảm giá không tồn tại hoặc đã hết hạn'
            });
        }

        if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
            return response.status(400).json({
                success: false,
                error: true,
                message: 'Mã giảm giá đã hết lượt sử dụng'
            });
        }

        if (subtotal && subtotal < voucher.minOrderAmount) {
            return response.status(400).json({
                success: false,
                error: true,
                message: `Đơn hàng tối thiểu ${voucher.minOrderAmount.toLocaleString('vi-VN')}đ`,
                data: { minOrderAmount: voucher.minOrderAmount }
            });
        }

        // Tính discount
        let discountAmount = 0;
        if (subtotal) {
            if (voucher.discountType === 'percentage') {
                discountAmount = (subtotal * voucher.discountValue) / 100;
                if (voucher.maxDiscountAmount && discountAmount > voucher.maxDiscountAmount) {
                    discountAmount = voucher.maxDiscountAmount;
                }
            } else {
                discountAmount = voucher.discountValue;
            }
        }

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Mã giảm giá hợp lệ',
            data: {
                code: voucher.code,
                description: voucher.description,
                discountType: voucher.discountType,
                discountValue: voucher.discountValue,
                maxDiscountAmount: voucher.maxDiscountAmount,
                minOrderAmount: voucher.minOrderAmount,
                discountAmount
            }
        });

    } catch (error) {
        console.error('Validate voucher error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi kiểm tra mã giảm giá'
        });
    }
}