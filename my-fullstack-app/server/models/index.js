import sequelize from '../config/connectDB.js';


import User from './User.model.js';
import UserAddress from './UserAddress.model.js';
import Category from './Category.model.js';
import Product from './Product.model.js';
import ProductPriceHistory from './ProductPriceHistory.model.js';
import Cart from './Cart.model.js';
import CartItem from './CartItem.model.js';
import Order from './Order.model.js';
import OrderItem from './OrderItem.model.js';
import Review from './Review.model.js';
import Wishlist from './Wishlist.model.js';
import ProductComparison from './ProductComparison.model.js';
import Notification from './Notification.model.js';
import Voucher from './Voucher.model.js';
import PasswordResetToken from './PasswordResetToken.model.js';
import OtpVerification from './OtpVerification.model.js';

// =============================================
// USER ASSOCIATIONS
// =============================================
User.hasMany(UserAddress, { foreignKey: 'userId', as: 'addresses', onDelete: 'CASCADE' });
UserAddress.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(Cart, { foreignKey: 'userId', as: 'cart', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Order, { foreignKey: 'userId', as: 'orders', onDelete: 'RESTRICT' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Review, { foreignKey: 'userId', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Wishlist, { foreignKey: 'userId', as: 'wishlists', onDelete: 'CASCADE' });
Wishlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(ProductComparison, { foreignKey: 'userId', as: 'comparisons', onDelete: 'CASCADE' });
ProductComparison.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(PasswordResetToken, { foreignKey: 'userId', as: 'resetTokens', onDelete: 'CASCADE' });
PasswordResetToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(OtpVerification, { foreignKey: 'userId', as: 'otpVerifications', onDelete: 'CASCADE' });
OtpVerification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(ProductPriceHistory, { foreignKey: 'changedBy', as: 'priceChanges', onDelete: 'SET NULL' });
ProductPriceHistory.belongsTo(User, { foreignKey: 'changedBy', as: 'changedByUser' });

// =============================================
// CATEGORY ASSOCIATIONS
// =============================================
Category.hasMany(Category, { foreignKey: 'parentId', as: 'children', onDelete: 'SET NULL' });
Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });

Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products', onDelete: 'RESTRICT' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Category.hasMany(Voucher, { foreignKey: 'categoryId', as: 'vouchers', onDelete: 'SET NULL' });
Voucher.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// =============================================
// PRODUCT ASSOCIATIONS
// =============================================

Product.hasMany(ProductPriceHistory, { foreignKey: 'productId', as: 'priceHistory', onDelete: 'CASCADE' });
ProductPriceHistory.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Product.hasMany(CartItem, { foreignKey: 'productId', as: 'cartItems', onDelete: 'CASCADE' });
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems', onDelete: 'RESTRICT' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Product.hasMany(Review, { foreignKey: 'productId', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Product.hasMany(Wishlist, { foreignKey: 'productId', as: 'wishlists', onDelete: 'CASCADE' });
Wishlist.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// =============================================
// CART ASSOCIATIONS
// =============================================
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });

// =============================================
// ORDER ASSOCIATIONS
// =============================================
Order.hasMany(OrderItem, { as: 'orderItems', foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });



// =============================================
// EXPORT ALL MODELS
// =============================================
export{
    sequelize,
    User,
    UserAddress,
    Category,
    Product,
    ProductPriceHistory,
    Cart,
    CartItem,
    Order,
    OrderItem,
    Review,
    Wishlist,
    ProductComparison,
    Notification,
    Voucher,
    PasswordResetToken,
    OtpVerification
};