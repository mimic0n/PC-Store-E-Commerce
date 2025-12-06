import { Cart, CartItem, Product } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/connectDB.js';

// ========== GET CART ==========
export async function getCart(request, response) {
    try {
        const userId = request.user.id;

        let cart = await Cart.findOne({
            where: { userId },
            include: [{
                model: CartItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name', 'slug', 'price', 'salePrice', 'thumbnail', 'quantity', 'isActive']
                }]
            }]
        });

        // Nếu chưa có cart, tạo mới
        if (!cart) {
            cart = await Cart.create({ userId, totalAmount: 0 });
            cart = await Cart.findOne({
                where: { userId },
                include: [{
                    model: CartItem,
                    as: 'items',
                    include: [{
                        model: Product,
                        as: 'product',
                        attributes: ['id', 'name', 'slug', 'price', 'salePrice', 'thumbnail', 'quantity', 'isActive']
                    }]
                }]
            });
        }

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Lấy giỏ hàng thành công',
            data: cart
        });

    } catch (error) {
        console.error('Get cart error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi lấy giỏ hàng'
        });
    }
}

// ========== ADD TO CART ==========
export async function addToCart(request, response) {
    const transaction = await sequelize.transaction();
    
    try {
        const userId = request.user.id;
        const { productId, quantity = 1 } = request.body;

        // Validate input
        if (!productId) {
            return response.status(400).json({
                success: false,
                error: true,
                message: 'ProductId là bắt buộc'
            });
        }

        if (quantity < 1) {
            return response.status(400).json({
                success: false,
                error: true,
                message: 'Số lượng phải lớn hơn 0'
            });
        }

        // Kiểm tra sản phẩm có tồn tại và còn hoạt động
        const product = await Product.findOne({
            where: { id: productId, isActive: true }
        });

        if (!product) {
            return response.status(404).json({
                success: false,
                error: true,
                message: 'Sản phẩm không tồn tại hoặc đã ngừng kinh doanh'
            });
        }

        // Kiểm tra số lượng tồn kho
        if (product.quantity < quantity) {
            return response.status(400).json({
                success: false,
                error: true,
                message: `Sản phẩm chỉ còn ${product.quantity} trong kho`
            });
        }

        // Tìm hoặc tạo cart
        let cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            cart = await Cart.create({ userId, totalAmount: 0 }, { transaction });
        }

        // Kiểm tra sản phẩm đã có trong cart chưa
        let cartItem = await CartItem.findOne({
            where: { cartId: cart.id, productId }
        });

        const itemPrice = product.salePrice || product.price;

        if (cartItem) {
            // Cập nhật số lượng nếu đã có
            const newQuantity = cartItem.quantity + quantity;
            
            if (newQuantity > product.quantity) {
                await transaction.rollback();
                return response.status(400).json({
                    success: false,
                    error: true,
                    message: `Không thể thêm. Sản phẩm chỉ còn ${product.quantity} trong kho`
                });
            }

            await cartItem.update({
                quantity: newQuantity,
                price: itemPrice
            }, { transaction });
        } else {
            // Thêm mới vào cart
            cartItem = await CartItem.create({
                cartId: cart.id,
                productId,
                quantity,
                price: itemPrice,
                brand: product.brand
            }, { transaction });
        }

        // Tính lại tổng tiền
        const cartItems = await CartItem.findAll({
            where: { cartId: cart.id }
        });

        const totalAmount = cartItems.reduce((sum, item) => {
            return sum + (parseFloat(item.price) * item.quantity);
        }, 0);

        await cart.update({ totalAmount }, { transaction });

        await transaction.commit();

        // Lấy cart đầy đủ để trả về
        const updatedCart = await Cart.findOne({
            where: { userId },
            include: [{
                model: CartItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name', 'slug', 'price', 'salePrice', 'thumbnail', 'quantity', 'isActive']
                }]
            }]
        });

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Thêm sản phẩm vào giỏ hàng thành công',
            data: updatedCart
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Add to cart error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi thêm vào giỏ hàng'
        });
    }
}

// ========== UPDATE CART ITEM QUANTITY ==========
export async function updateCartItem(request, response) {
    const transaction = await sequelize.transaction();
    
    try {
        const userId = request.user.id;
        const { cartItemId } = request.params;
        const { quantity } = request.body;

        if (!quantity || quantity < 1) {
            return response.status(400).json({
                success: false,
                error: true,
                message: 'Số lượng phải lớn hơn 0'
            });
        }

        // Tìm cart của user
        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            return response.status(404).json({
                success: false,
                error: true,
                message: 'Giỏ hàng không tồn tại'
            });
        }

        // Tìm cart item
        const cartItem = await CartItem.findOne({
            where: { id: cartItemId, cartId: cart.id },
            include: [{
                model: Product,
                as: 'product'
            }]
        });

        if (!cartItem) {
            return response.status(404).json({
                success: false,
                error: true,
                message: 'Sản phẩm không có trong giỏ hàng'
            });
        }

        // Kiểm tra số lượng tồn kho
        if (quantity > cartItem.product.quantity) {
            return response.status(400).json({
                success: false,
                error: true,
                message: `Sản phẩm chỉ còn ${cartItem.product.quantity} trong kho`
            });
        }

        // Cập nhật số lượng
        const itemPrice = cartItem.product.salePrice || cartItem.product.price;
        await cartItem.update({
            quantity,
            price: itemPrice
        }, { transaction });

        // Tính lại tổng tiền
        const cartItems = await CartItem.findAll({
            where: { cartId: cart.id }
        });

        const totalAmount = cartItems.reduce((sum, item) => {
            return sum + (parseFloat(item.price) * item.quantity);
        }, 0);

        await cart.update({ totalAmount }, { transaction });

        await transaction.commit();

        // Lấy cart đầy đủ để trả về
        const updatedCart = await Cart.findOne({
            where: { userId },
            include: [{
                model: CartItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name', 'slug', 'price', 'salePrice', 'thumbnail', 'quantity', 'isActive']
                }]
            }]
        });

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Cập nhật số lượng thành công',
            data: updatedCart
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Update cart item error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi cập nhật giỏ hàng'
        });
    }
}

// ========== REMOVE ITEM FROM CART ==========
export async function removeFromCart(request, response) {
    const transaction = await sequelize.transaction();
    
    try {
        const userId = request.user.id;
        const { cartItemId } = request.params;

        // Tìm cart của user
        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            return response.status(404).json({
                success: false,
                error: true,
                message: 'Giỏ hàng không tồn tại'
            });
        }

        // Tìm và xóa cart item
        const cartItem = await CartItem.findOne({
            where: { id: cartItemId, cartId: cart.id }
        });

        if (!cartItem) {
            return response.status(404).json({
                success: false,
                error: true,
                message: 'Sản phẩm không có trong giỏ hàng'
            });
        }

        await cartItem.destroy({ transaction });

        // Tính lại tổng tiền
        const cartItems = await CartItem.findAll({
            where: { cartId: cart.id }
        });

        const totalAmount = cartItems.reduce((sum, item) => {
            return sum + (parseFloat(item.price) * item.quantity);
        }, 0);

        await cart.update({ totalAmount }, { transaction });

        await transaction.commit();

        // Lấy cart đầy đủ để trả về
        const updatedCart = await Cart.findOne({
            where: { userId },
            include: [{
                model: CartItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name', 'slug', 'price', 'salePrice', 'thumbnail', 'quantity', 'isActive']
                }]
            }]
        });

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Xóa sản phẩm khỏi giỏ hàng thành công',
            data: updatedCart
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Remove from cart error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi xóa sản phẩm khỏi giỏ hàng'
        });
    }
}

// ========== CLEAR CART ==========
export async function clearCart(request, response) {
    const transaction = await sequelize.transaction();
    
    try {
        const userId = request.user.id;

        // Tìm cart của user
        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            return response.status(404).json({
                success: false,
                error: true,
                message: 'Giỏ hàng không tồn tại'
            });
        }

        // Xóa tất cả cart items
        await CartItem.destroy({
            where: { cartId: cart.id },
            transaction
        });

        // Reset tổng tiền
        await cart.update({ totalAmount: 0 }, { transaction });

        await transaction.commit();

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Xóa toàn bộ giỏ hàng thành công',
            data: {
                id: cart.id,
                userId,
                totalAmount: 0,
                items: []
            }
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Clear cart error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi xóa giỏ hàng'
        });
    }
}

// ========== GET CART ITEMS COUNT ==========
export async function getCartItemsCount(request, response) {
    try {
        const userId = request.user.id;

        const cart = await Cart.findOne({ where: { userId } });
        
        if (!cart) {
            return response.status(200).json({
                success: true,
                error: false,
                message: 'Lấy số lượng sản phẩm trong giỏ hàng thành công',
                data: { count: 0, totalItems: 0 }
            });
        }

        const cartItems = await CartItem.findAll({
            where: { cartId: cart.id }
        });

        // count: số loại sản phẩm, totalItems: tổng số lượng sản phẩm
        const count = cartItems.length;
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Lấy số lượng sản phẩm trong giỏ hàng thành công',
            data: { count, totalItems }
        });

    } catch (error) {
        console.error('Get cart items count error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi lấy số lượng sản phẩm'
        });
    }
}

// ========== SYNC CART (for guest to user cart merge) ==========
export async function syncCart(request, response) {
    const transaction = await sequelize.transaction();
    
    try {
        const userId = request.user.id;
        const { items } = request.body; // Array of { productId, quantity }

        if (!items || !Array.isArray(items)) {
            return response.status(400).json({
                success: false,
                error: true,
                message: 'Dữ liệu không hợp lệ'
            });
        }

        // Tìm hoặc tạo cart
        let cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            cart = await Cart.create({ userId, totalAmount: 0 }, { transaction });
        }

        for (const item of items) {
            const { productId, quantity } = item;

            if (!productId || !quantity || quantity < 1) continue;

            const product = await Product.findOne({
                where: { id: productId, isActive: true }
            });

            if (!product) continue;

            const itemPrice = product.salePrice || product.price;

            // Kiểm tra sản phẩm đã có trong cart chưa
            let cartItem = await CartItem.findOne({
                where: { cartId: cart.id, productId }
            });

            if (cartItem) {
                // Cập nhật số lượng (lấy số lớn hơn)
                const newQuantity = Math.min(
                    Math.max(cartItem.quantity, quantity),
                    product.quantity
                );
                await cartItem.update({
                    quantity: newQuantity,
                    price: itemPrice
                }, { transaction });
            } else {
                // Thêm mới
                const finalQuantity = Math.min(quantity, product.quantity);
                await CartItem.create({
                    cartId: cart.id,
                    productId,
                    quantity: finalQuantity,
                    price: itemPrice,
                    brand: product.brand
                }, { transaction });
            }
        }

        // Tính lại tổng tiền
        const cartItems = await CartItem.findAll({
            where: { cartId: cart.id }
        });

        const totalAmount = cartItems.reduce((sum, item) => {
            return sum + (parseFloat(item.price) * item.quantity);
        }, 0);

        await cart.update({ totalAmount }, { transaction });

        await transaction.commit();

        // Lấy cart đầy đủ để trả về
        const updatedCart = await Cart.findOne({
            where: { userId },
            include: [{
                model: CartItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name', 'slug', 'price', 'salePrice', 'thumbnail', 'quantity', 'isActive']
                }]
            }]
        });

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Đồng bộ giỏ hàng thành công',
            data: updatedCart
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Sync cart error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi đồng bộ giỏ hàng'
        });
    }
}