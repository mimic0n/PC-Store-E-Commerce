import { Wishlist, Product, Category } from '../models/index.js';
import { Op } from 'sequelize';

// ========== GET WISHLIST ==========
export async function getWishlist(request, response) {
    try {
        const userId = request.user.id;
        const { page = 1, limit = 10 } = request.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);

        const { count, rows: wishlists } = await Wishlist.findAndCountAll({
            where: { userId },
            include: [{
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'slug', 'price', 'salePrice', 'thumbnail', 'quantity', 'isActive', 'rating', 'numReviews'],
                include: [{
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug']
                }]
            }],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: offset
        });

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Lấy danh sách yêu thích thành công',
            data: {
                wishlists,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(count / parseInt(limit)),
                    totalItems: count,
                    itemsPerPage: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Get wishlist error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi lấy danh sách yêu thích'
        });
    }
}

// ========== ADD TO WISHLIST ==========
export async function addToWishlist(request, response) {
    try {
        const userId = request.user.id;
        const { productId } = request.body;

        // Validate input
        if (!productId) {
            return response.status(400).json({
                success: false,
                error: true,
                message: 'ProductId là bắt buộc'
            });
        }

        // Kiểm tra sản phẩm có tồn tại
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

        // Kiểm tra xem đã có trong wishlist chưa
        const existingItem = await Wishlist.findOne({
            where: { userId, productId }
        });

        if (existingItem) {
            return response.status(400).json({
                success: false,
                error: true,
                message: 'Sản phẩm đã có trong danh sách yêu thích'
            });
        }

        // Thêm vào wishlist
        const wishlistItem = await Wishlist.create({
            userId,
            productId
        });

        // Lấy lại item với thông tin product
        const newItem = await Wishlist.findOne({
            where: { id: wishlistItem.id },
            include: [{
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'slug', 'price', 'salePrice', 'thumbnail', 'quantity', 'isActive']
            }]
        });

        return response.status(201).json({
            success: true,
            error: false,
            message: 'Đã thêm sản phẩm vào danh sách yêu thích',
            data: newItem
        });

    } catch (error) {
        console.error('Add to wishlist error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi thêm vào danh sách yêu thích'
        });
    }
}

// ========== REMOVE FROM WISHLIST ==========
export async function removeFromWishlist(request, response) {
    try {
        const userId = request.user.id;
        const { productId } = request.params;

        if (!productId) {
            return response.status(400).json({
                success: false,
                error: true,
                message: 'ProductId là bắt buộc'
            });
        }

        // Tìm và xóa item
        const wishlistItem = await Wishlist.findOne({
            where: { userId, productId: parseInt(productId) }
        });

        if (!wishlistItem) {
            return response.status(404).json({
                success: false,
                error: true,
                message: 'Sản phẩm không có trong danh sách yêu thích'
            });
        }

        await wishlistItem.destroy();

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Đã xóa sản phẩm khỏi danh sách yêu thích'
        });

    } catch (error) {
        console.error('Remove from wishlist error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi xóa khỏi danh sách yêu thích'
        });
    }
}

// ========== TOGGLE WISHLIST (ADD/REMOVE) ==========
export async function toggleWishlist(request, response) {
    try {
        const userId = request.user.id;
        const { productId } = request.body;

        if (!productId) {
            return response.status(400).json({
                success: false,
                error: true,
                message: 'ProductId là bắt buộc'
            });
        }

        // Kiểm tra sản phẩm có tồn tại
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

        // Kiểm tra xem đã có trong wishlist chưa
        const existingItem = await Wishlist.findOne({
            where: { userId, productId }
        });

        if (existingItem) {
            // Nếu có rồi thì xóa
            await existingItem.destroy();
            return response.status(200).json({
                success: true,
                error: false,
                message: 'Đã xóa sản phẩm khỏi danh sách yêu thích',
                data: { isInWishlist: false }
            });
        } else {
            // Nếu chưa có thì thêm
            await Wishlist.create({ userId, productId });
            return response.status(201).json({
                success: true,
                error: false,
                message: 'Đã thêm sản phẩm vào danh sách yêu thích',
                data: { isInWishlist: true }
            });
        }

    } catch (error) {
        console.error('Toggle wishlist error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi cập nhật danh sách yêu thích'
        });
    }
}

// ========== CHECK IF PRODUCT IN WISHLIST ==========
export async function checkWishlist(request, response) {
    try {
        const userId = request.user.id;
        const { productId } = request.params;

        if (!productId) {
            return response.status(400).json({
                success: false,
                error: true,
                message: 'ProductId là bắt buộc'
            });
        }

        const existingItem = await Wishlist.findOne({
            where: { userId, productId: parseInt(productId) }
        });

        return response.status(200).json({
            success: true,
            error: false,
            message: existingItem ? 'Sản phẩm có trong danh sách yêu thích' : 'Sản phẩm không có trong danh sách yêu thích',
            data: { isInWishlist: !!existingItem }
        });

    } catch (error) {
        console.error('Check wishlist error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi kiểm tra danh sách yêu thích'
        });
    }
}

// ========== CLEAR ALL WISHLIST ==========
export async function clearWishlist(request, response) {
    try {
        const userId = request.user.id;

        const deletedCount = await Wishlist.destroy({
            where: { userId }
        });

        return response.status(200).json({
            success: true,
            error: false,
            message: `Đã xóa ${deletedCount} sản phẩm khỏi danh sách yêu thích`
        });

    } catch (error) {
        console.error('Clear wishlist error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi xóa danh sách yêu thích'
        });
    }
}

// ========== GET WISHLIST COUNT ==========
export async function getWishlistCount(request, response) {
    try {
        const userId = request.user.id;

        const count = await Wishlist.count({
            where: { userId }
        });

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Lấy số lượng yêu thích thành công',
            data: { count }
        });

    } catch (error) {
        console.error('Get wishlist count error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi lấy số lượng yêu thích'
        });
    }
}

// ========== CHECK MULTIPLE PRODUCTS IN WISHLIST ==========
export async function checkMultipleWishlist(request, response) {
    try {
        const userId = request.user.id;
        const { productIds } = request.body;

        if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return response.status(400).json({
                success: false,
                error: true,
                message: 'productIds phải là một mảng và không được rỗng'
            });
        }

        const wishlistItems = await Wishlist.findAll({
            where: {
                userId,
                productId: { [Op.in]: productIds }
            },
            attributes: ['productId']
        });

        const wishlistProductIds = wishlistItems.map(item => item.productId);

        // Tạo object với key là productId và value là boolean
        const result = {};
        productIds.forEach(id => {
            result[id] = wishlistProductIds.includes(id);
        });

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Kiểm tra danh sách yêu thích thành công',
            data: result
        });

    } catch (error) {
        console.error('Check multiple wishlist error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi kiểm tra danh sách yêu thích'
        });
    }
}