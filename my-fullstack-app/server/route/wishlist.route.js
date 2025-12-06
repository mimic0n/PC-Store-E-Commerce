import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    checkWishlist,
    clearWishlist,
    getWishlistCount,
    checkMultipleWishlist
} from '../controllers/Wishlist.controller.js';

const wishlistRouter = Router();

// Tất cả các route đều cần xác thực
wishlistRouter.use(auth);

// GET - Lấy danh sách yêu thích
wishlistRouter.get('/', getWishlist);

// GET - Lấy số lượng sản phẩm yêu thích
wishlistRouter.get('/count', getWishlistCount);

// GET - Kiểm tra sản phẩm có trong wishlist không
wishlistRouter.get('/check/:productId', checkWishlist);

// POST - Thêm sản phẩm vào wishlist
wishlistRouter.post('/add', addToWishlist);

// POST - Toggle thêm/xóa sản phẩm khỏi wishlist
wishlistRouter.post('/toggle', toggleWishlist);

// POST - Kiểm tra nhiều sản phẩm cùng lúc
wishlistRouter.post('/check-multiple', checkMultipleWishlist);

// DELETE - Xóa sản phẩm khỏi wishlist
wishlistRouter.delete('/remove/:productId', removeFromWishlist);

// DELETE - Xóa toàn bộ wishlist
wishlistRouter.delete('/clear', clearWishlist);

export default wishlistRouter;