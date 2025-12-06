
-- Tạo database
CREATE DATABASE IF NOT EXISTS HKTStore_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE HKTStore_db;

-- =============================================
-- BẢNG USERS (Người dùng)
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fullName VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NULL,
    address TEXT NULL,
    dateOfBirth DATE NULL,
    gender ENUM('male', 'female', 'other') NULL,
    avatar VARCHAR(255) DEFAULT 'default-avatar.png',
    role ENUM('user', 'admin') DEFAULT 'user',
    isActive BOOLEAN DEFAULT TRUE,
    isEmailVerified BOOLEAN DEFAULT FALSE,
    isPhoneVerified BOOLEAN DEFAULT FALSE,
    isVerified BOOLEAN DEFAULT FALSE,
    lastLoginAt TIMESTAMP NULL,
    
    -- OTP fields for email verification
    otp VARCHAR(6) NULL,
    otpExpiry TIMESTAMP NULL,
    
    -- Refresh Token for JWT authentication
    refreshToken TEXT NULL,
    
    -- Timestamps
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes 
    INDEX idx_role (role),
    INDEX idx_isActive (isActive),
    INDEX idx_isVerified (isVerified)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- USER_ADDRESSES (Địa chỉ người dùng)
-- =============================================
CREATE TABLE IF NOT EXISTS user_addresses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    fullName VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    province VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    ward VARCHAR(100) NOT NULL,
    addressDetail TEXT NOT NULL,
    isDefault BOOLEAN DEFAULT FALSE,
    addressType ENUM('home', 'office', 'other') DEFAULT 'home',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_userId (userId),
    INDEX idx_isDefault (isDefault),
    
    CONSTRAINT fk_address_user 
        FOREIGN KEY (userId) REFERENCES users(id) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- BẢNG CATEGORIES (Danh mục)
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NULL,
    image VARCHAR(255) NULL,
    parentId INT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_slug (slug),
    INDEX idx_parentId (parentId),
    INDEX idx_isActive (isActive),
    
    CONSTRAINT fk_category_parent 
        FOREIGN KEY (parentId) REFERENCES categories(id) 
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- BẢNG PRODUCTS (Sản phẩm)
-- =============================================
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT NULL,
    price DECIMAL(12, 2) NOT NULL,
    salePrice DECIMAL(12, 2) NULL,
    quantity INT NOT NULL DEFAULT 0,
    sold INT DEFAULT 0,
    saleCount INT DEFAULT 0,
    images JSON DEFAULT NULL,
    thumbnail VARCHAR(255) NULL,
    brand VARCHAR(100) NULL,
    specifications JSON DEFAULT NULL,
    categoryId INT NOT NULL,
    rating DECIMAL(2, 1) DEFAULT 0,
    numReviews INT DEFAULT 0,
    isFeatured BOOLEAN DEFAULT FALSE,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_slug (slug),
    INDEX idx_categoryId (categoryId),
    INDEX idx_price (price),
    INDEX idx_rating (rating),
    INDEX idx_isFeatured (isFeatured),
    INDEX idx_isActive (isActive),
    INDEX idx_brand (brand),
    INDEX idx_saleCount (saleCount),
    
    CONSTRAINT fk_product_category 
        FOREIGN KEY (categoryId) REFERENCES categories(id) 
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- BẢNG CARTS (Giỏ hàng)
-- =============================================
CREATE TABLE IF NOT EXISTS carts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL UNIQUE,
    totalAmount DECIMAL(12, 2) DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_userId (userId),
    
    CONSTRAINT fk_cart_user 
        FOREIGN KEY (userId) REFERENCES users(id) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- BẢNG CART_ITEMS (Chi tiết giỏ hàng)
-- =============================================
CREATE TABLE IF NOT EXISTS cart_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cartId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(12, 2) NOT NULL,
    brand VARCHAR(100) NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_cartId (cartId),
    INDEX idx_productId (productId),
    UNIQUE KEY unique_cart_product (cartId, productId),
    
    CONSTRAINT fk_cartitem_cart 
        FOREIGN KEY (cartId) REFERENCES carts(id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_cartitem_product 
        FOREIGN KEY (productId) REFERENCES products(id) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- BẢNG ORDERS (Đơn hàng)
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    orderCode VARCHAR(20) NOT NULL UNIQUE,
    userId INT NOT NULL,
    fullName VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address TEXT NOT NULL,
    province VARCHAR(100) NULL,
    district VARCHAR(100) NULL,
    ward VARCHAR(100) NULL,
    note TEXT NULL,
    totalAmount DECIMAL(12, 2) NOT NULL,
    shippingFee DECIMAL(12, 2) DEFAULT 0,
    shippingMethod ENUM('standard', 'express', 'same_day') DEFAULT 'standard',
    estimatedDelivery DATE NULL,
    trackingNumber VARCHAR(100) NULL,
    discount DECIMAL(12, 2) DEFAULT 0,
    voucherCode VARCHAR(50) NULL,
    paymentMethod ENUM('cod', 'banking', 'momo', 'vnpay') DEFAULT 'cod',
    paymentStatus ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    orderStatus ENUM('pending', 'confirmed', 'shipping', 'delivered', 'cancelled') DEFAULT 'pending',
    paidAt TIMESTAMP NULL,
    deliveredAt TIMESTAMP NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_orderCode (orderCode),
    INDEX idx_userId (userId),
    INDEX idx_orderStatus (orderStatus),
    INDEX idx_paymentStatus (paymentStatus),
    INDEX idx_createdAt (createdAt),
    INDEX idx_voucherCode (voucherCode),
    
    CONSTRAINT fk_order_user 
        FOREIGN KEY (userId) REFERENCES users(id) 
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- BẢNG ORDER_ITEMS (Chi tiết đơn hàng)
-- =============================================
CREATE TABLE IF NOT EXISTS order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    orderId INT NOT NULL,
    productId INT NOT NULL,
    productName VARCHAR(200) NOT NULL,
    productImage VARCHAR(255) NULL,
    brand VARCHAR(100) NULL,
    specifications JSON DEFAULT NULL,
    quantity INT NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    salePrice DECIMAL(12, 2) NULL,
    totalPrice DECIMAL(12, 2) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_orderId (orderId),
    INDEX idx_productId (productId),
    
    CONSTRAINT fk_orderitem_order 
        FOREIGN KEY (orderId) REFERENCES orders(id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_orderitem_product 
        FOREIGN KEY (productId) REFERENCES products(id) 
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- BẢNG REVIEWS (Đánh giá)
-- =============================================
CREATE TABLE IF NOT EXISTS reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    productId INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NULL,
    images JSON DEFAULT NULL,
    isApproved BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_userId (userId),
    INDEX idx_productId (productId),
    INDEX idx_rating (rating),
    INDEX idx_isApproved (isApproved),
    UNIQUE KEY unique_user_product_review (userId, productId),
    
    CONSTRAINT fk_review_user 
        FOREIGN KEY (userId) REFERENCES users(id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_review_product 
        FOREIGN KEY (productId) REFERENCES products(id) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- PRODUCT_HISTORY (Lịch sử sản phẩm)
-- =============================================
CREATE TABLE IF NOT EXISTS product_price_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    productId INT NOT NULL,
    oldPrice DECIMAL(12, 2) NOT NULL,
    newPrice DECIMAL(12, 2) NOT NULL,
    oldSalePrice DECIMAL(12, 2) NULL,
    newSalePrice DECIMAL(12, 2) NULL,
    changedBy INT NULL,
    reason VARCHAR(255) NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_productId (productId),
    INDEX idx_createdAt (createdAt),
    
    CONSTRAINT fk_price_history_product 
        FOREIGN KEY (productId) REFERENCES products(id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_price_history_user 
        FOREIGN KEY (changedBy) REFERENCES users(id) 
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- WISHLIST (Danh sách yêu thích)
-- =============================================
CREATE TABLE IF NOT EXISTS wishlists (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    productId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_userId (userId),
    INDEX idx_productId (productId),
    UNIQUE KEY unique_user_product_wishlist (userId, productId),
    
    CONSTRAINT fk_wishlist_user 
        FOREIGN KEY (userId) REFERENCES users(id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_wishlist_product 
        FOREIGN KEY (productId) REFERENCES products(id) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- PRODUCT_COMPARISONS (So sánh sản phẩm)
-- =============================================
CREATE TABLE IF NOT EXISTS product_comparisons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    productIds JSON NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_userId (userId),
    
    CONSTRAINT fk_comparison_user 
        FOREIGN KEY (userId) REFERENCES users(id) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- NOTIFICATIONS (Thông báo)
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    type ENUM('order', 'product', 'promotion', 'system') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    relatedId INT NULL,
    relatedType VARCHAR(50) NULL,
    isRead BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_userId (userId),
    INDEX idx_isRead (isRead),
    INDEX idx_createdAt (createdAt),
    
    CONSTRAINT fk_notification_user 
        FOREIGN KEY (userId) REFERENCES users(id) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- VOUCHERS (Mã giảm giá)
-- =============================================
CREATE TABLE IF NOT EXISTS vouchers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NULL,
    discountType ENUM('percentage', 'fixed') NOT NULL,
    discountValue DECIMAL(12, 2) NOT NULL,
    minOrderAmount DECIMAL(12, 2) DEFAULT 0,
    maxDiscountAmount DECIMAL(12, 2) NULL,
    usageLimit INT NULL,
    usedCount INT DEFAULT 0,
    categoryId INT NULL,
    startDate DATETIME NOT NULL,
    endDate DATETIME NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_code (code),
    INDEX idx_categoryId (categoryId),
    INDEX idx_isActive (isActive),
    INDEX idx_dates (startDate, endDate),
    
    CONSTRAINT fk_voucher_category 
        FOREIGN KEY (categoryId) REFERENCES categories(id) 
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- PASSWORD_RESET_TOKENS (Token đặt lại mật khẩu)
-- =============================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expiresAt TIMESTAMP NOT NULL,
    isUsed BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_token (token),
    INDEX idx_userId (userId),
    INDEX idx_expiresAt (expiresAt),
    
    CONSTRAINT fk_reset_token_user 
        FOREIGN KEY (userId) REFERENCES users(id) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- OTP_VERIFICATIONS (Xác thực OTP)
-- =============================================
CREATE TABLE IF NOT EXISTS otp_verifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NULL,
    email VARCHAR(100) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    type ENUM('register', 'login', 'reset_password', 'change_email') NOT NULL,
    expiresAt TIMESTAMP NOT NULL,
    isVerified BOOLEAN DEFAULT FALSE,
    attempts INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_otp (otp),
    INDEX idx_type (type),
    INDEX idx_expiresAt (expiresAt),
    
    CONSTRAINT fk_otp_user 
        FOREIGN KEY (userId) REFERENCES users(id) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TRIGGERS
-- =============================================

-- Tạo trigger để tự động cập nhật sold và saleCount
DELIMITER $$

CREATE TRIGGER update_product_sold_after_order_completed
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF NEW.orderStatus = 'delivered' AND OLD.orderStatus != 'delivered' THEN
        UPDATE products p
        INNER JOIN order_items oi ON p.id = oi.productId
        SET p.sold = p.sold + oi.quantity,
            p.saleCount = p.saleCount + oi.quantity
        WHERE oi.orderId = NEW.id;
    END IF;
END$$

DELIMITER ;

-- Tạo trigger để tự động cập nhật rating và numReviews sau khi INSERT
DELIMITER $$

CREATE TRIGGER update_product_rating_after_review_insert
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    UPDATE products 
    SET rating = (
        SELECT COALESCE(ROUND(AVG(rating), 1), 0) 
        FROM reviews 
        WHERE productId = NEW.productId AND isApproved = TRUE
    ),
    numReviews = (
        SELECT COUNT(*) 
        FROM reviews 
        WHERE productId = NEW.productId AND isApproved = TRUE
    )
    WHERE id = NEW.productId;
END$$

DELIMITER ;

-- Trigger sau khi UPDATE review
DELIMITER $$

CREATE TRIGGER update_product_rating_after_review_update
AFTER UPDATE ON reviews
FOR EACH ROW
BEGIN
    UPDATE products 
    SET numReviews = (
            SELECT COUNT(*) 
            FROM reviews 
            WHERE productId = NEW.productId AND isApproved = TRUE
        ),
        rating = (
            SELECT COALESCE(ROUND(AVG(rating), 1), 0)
            FROM reviews 
            WHERE productId = NEW.productId AND isApproved = TRUE
        )
    WHERE id = NEW.productId;
END$$

DELIMITER ;

-- Trigger sau khi DELETE review
DELIMITER $$

CREATE TRIGGER update_product_rating_after_review_delete
AFTER DELETE ON reviews
FOR EACH ROW
BEGIN
    UPDATE products 
    SET numReviews = (
            SELECT COUNT(*) 
            FROM reviews 
            WHERE productId = OLD.productId AND isApproved = TRUE
        ),
        rating = (
            SELECT COALESCE(ROUND(AVG(rating), 1), 0) 
            FROM reviews 
            WHERE productId = OLD.productId AND isApproved = TRUE
        )
    WHERE id = OLD.productId;
END$$

DELIMITER ;

-- =============================================
-- DỮ LIỆU MẪU (Sample Data)
-- =============================================

-- Thêm Users mẫu (password đã hash: 'password123')
INSERT INTO users (
    fullName, 
    email, 
    password, 
    phone,
    role, 
    isActive, 
    isEmailVerified, 
    isVerified
) VALUES
-- Admin account
(
    'Admin HKTStore', 
    'admin@hktstore.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    '0123456789',
    'admin', 
    TRUE, 
    TRUE, 
    TRUE
),
-- Regular users
(
    'Austrian Artist', 
    'artist1933@example.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    '0111222333',
    'user', 
    TRUE, 
    TRUE, 
    TRUE
),
(
    'Albert Einstein', 
    'einstein@example.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    '0222333444',
    'user', 
    TRUE, 
    TRUE, 
    TRUE
),
(
    'Elon Musk', 
    'elon@spacex.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    '0333444555',
    'user', 
    TRUE, 
    TRUE, 
    TRUE
),
(
    'Soltuné Montepré', 
    'soltune@chateau.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    '0444555666',
    'user', 
    TRUE, 
    TRUE, 
    TRUE
),
(
    'Vanga', 
    'vanga@prophecy.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    '0555666777',
    'user', 
    TRUE, 
    TRUE, 
    TRUE
),
(
    'Gia Cát Lượng', 
    'kongming@shu.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    '0666777888',
    'user', 
    TRUE, 
    TRUE, 
    TRUE
);

-- ...existing code...

-- =============================================
-- CATEGORIES - Cấu trúc danh mục
-- =============================================
/*
CATEGORY STRUCTURE:
ID  | Name                  | Parent | Slug
----|----------------------|--------|----------------------
1   | PC                   | NULL   | pc
2   | Gaming Gear          | NULL   | gaming-gear
3   | Hardware             | NULL   | hardware
4   | Monitor              | NULL   | monitor
----|----------------------|--------|----------------------
5   | PC Gaming            | 1      | pc-gaming
6   | PC Workstation       | 1      | pc-workstation
7   | PC Office            | 1      | pc-office
----|----------------------|--------|----------------------
8   | Console              | 2      | console
9   | Keyboard             | 2      | keyboard
10  | Mouse                | 2      | mouse
11  | Headset              | 2      | headset
----|----------------------|--------|----------------------
12  | CPU                  | 3      | cpu
13  | Mainboard            | 3      | mainboard
14  | RAM                  | 3      | ram
15  | VGA                  | 3      | vga
16  | SSD/HDD              | 3      | ssd-hdd
17  | Tản Nhiệt            | 3      | cooling
18  | Case                 | 3      | case
19  | PSU                  | 3      | psu
----|----------------------|--------|----------------------
20  | Gaming Monitor       | 4      | gaming-monitor
21  | Professional Monitor | 4      | professional-monitor
22  | Office Monitor       | 4      | office-monitor
23  | Portable Monitor     | 4      | portable-monitor
*/

-- Thêm danh mục cha
INSERT INTO categories (name, slug, description, isActive) VALUES
('PC', 'pc', 'Máy tính để bàn các loại', TRUE),
('Gaming Gear', 'gaming-gear', 'Thiết bị chơi game', TRUE),
('Hardware', 'hardware', 'Linh kiện máy tính', TRUE),
('Monitor', 'monitor', 'Màn hình máy tính', TRUE);

-- Thêm danh mục con cho PC (parentId = 1)
INSERT INTO categories (name, slug, description, parentId, isActive) VALUES
('PC Gaming', 'pc-gaming', 'PC chơi game cao cấp', 1, TRUE),
('PC Workstation', 'pc-workstation', 'PC làm việc chuyên nghiệp', 1, TRUE),
('PC Office', 'pc-office', 'PC văn phòng', 1, TRUE);

-- Thêm danh mục con cho Gaming Gear (parentId = 2)
INSERT INTO categories (name, slug, description, parentId, isActive) VALUES
('Console', 'console', 'Máy chơi game Console', 2, TRUE),
('Keyboard', 'keyboard', 'Bàn phím Gaming', 2, TRUE),
('Mouse', 'mouse', 'Chuột Gaming', 2, TRUE),
('Headset', 'headset', 'Tai nghe Gaming', 2, TRUE);

-- Thêm danh mục con cho Hardware (parentId = 3)
INSERT INTO categories (name, slug, description, parentId, isActive) VALUES
('CPU', 'cpu', 'Bộ vi xử lý', 3, TRUE),
('Mainboard', 'mainboard', 'Bo mạch chủ', 3, TRUE),
('RAM', 'ram', 'Bộ nhớ RAM', 3, TRUE),
('VGA', 'vga', 'Card màn hình', 3, TRUE),
('SSD/HDD', 'ssd-hdd', 'Ổ cứng SSD và HDD', 3, TRUE),
('Tản Nhiệt', 'cooling', 'Tản nhiệt CPU/VGA', 3, TRUE),
('Case', 'case', 'Vỏ Case máy tính', 3, TRUE),
('PSU', 'psu', 'Nguồn máy tính', 3, TRUE);

-- Thêm danh mục con cho Monitor (parentId = 4)
INSERT INTO categories (name, slug, description, parentId, isActive) VALUES
('Gaming Monitor', 'gaming-monitor', 'Màn hình Gaming', 4, TRUE),
('Professional Monitor', 'professional-monitor', 'Màn hình chuyên nghiệp cho đồ họa', 4, TRUE),
('Office Monitor', 'office-monitor', 'Màn hình văn phòng', 4, TRUE),
('Portable Monitor', 'portable-monitor', 'Màn hình di động', 4, TRUE);

-- =============================================
-- PRODUCTS - PC GAMING (categoryId = 5)
-- =============================================
INSERT INTO products (name, slug, description, price, salePrice, quantity, categoryId, brand, isFeatured, thumbnail, images, specifications) VALUES
-- Product ID: 1
('PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC', 
'pc-amd-gaming-luxury-ryzen-9-9950x3d-rtx-5090-32gb-oc',
'PC Gaming cao cấp nhất với AMD Ryzen 9 9950X3D và RTX 5090',
52700000,
48800000,
10,
5,
'AMD',
TRUE,
'/src/assets/Product/PC/PC-AMD-Gaming/PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC/PC_AMD_GAMING_LUXURY_RYZEN_9_9950X3D-RTX_5090_32GB_OC_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/PC/PC-AMD-Gaming/PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC/PC_AMD_GAMING_LUXURY_RYZEN_9_9950X3D-RTX_5090_32GB_OC_1.jpg',
    '/src/assets/Product/PC/PC-AMD-Gaming/PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC/PC_AMD_GAMING_LUXURY_RYZEN_9_9950X3D-RTX_5090_32GB_OC_2.jpg',
    '/src/assets/Product/PC/PC-AMD-Gaming/PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC/PC_AMD_GAMING_LUXURY_RYZEN_9_9950X3D-RTX_5090_32GB_OC_3.jpg',
    '/src/assets/Product/PC/PC-AMD-Gaming/PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC/PC_AMD_GAMING_LUXURY_RYZEN_9_9950X3D-RTX_5090_32GB_OC_4.jpg',
    '/src/assets/Product/PC/PC-AMD-Gaming/PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC/PC_AMD_GAMING_LUXURY_RYZEN_9_9950X3D-RTX_5090_32GB_OC_5.jpg',
    '/src/assets/Product/PC/PC-AMD-Gaming/PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC/PC_AMD_GAMING_LUXURY_RYZEN_9_9950X3D-RTX_5090_32GB_OC_6.jpg',
    '/src/assets/Product/PC/PC-AMD-Gaming/PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC/PC_AMD_GAMING_LUXURY_RYZEN_9_9950X3D-RTX_5090_32GB_OC_7.jpg',
    '/src/assets/Product/PC/PC-AMD-Gaming/PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC/PC_AMD_GAMING_LUXURY_RYZEN_9_9950X3D-RTX_5090_32GB_OC_8.jpg',
    '/src/assets/Product/PC/PC-AMD-Gaming/PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC/PC_AMD_GAMING_LUXURY_RYZEN_9_9950X3D-RTX_5090_32GB_OC_9.jpg',
    '/src/assets/Product/PC/PC-AMD-Gaming/PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC/PC_AMD_GAMING_LUXURY_RYZEN_9_9950X3D-RTX_5090_32GB_OC_10.jpg'
),
JSON_OBJECT(
    'cpu', 'AMD Ryzen 9 9950X3D (16 cores 32 threads, 4.3GHz up to 5.7GHz, 144MB Cache)',
    'mainboard', 'Asus ROG STRIX X870E-E Gaming Wifi DDR5',
    'ram', 'PC G.SKILL Trident Z5 RGB 64GB(32GBx2) BUS 6000MHz DDR5',
    'ssd', 'Samsung 990 PRO 2TB M.2 NVMe M.2 2280 PCIe Gen4.0 x4',
    'psu', 'SuperFlower Leadex VII PRO 1200W ATX3.1 80 Plus Platinum SF-1200F14XP',
    'vga', 'ASUS ROG Astral GeForce RTX 5090 32GB GDDR7 OC Edition',
    'cooling', 'TRYX PANORAMA ARGB 360 (6.5" AMOLED Screen/ASETEK 8 Pump)',
    'case', 'HYTE Y70 - BLACK (ATX/MID TOWER/BLACK)',
    'extension', 'Lian Li Strimer Plus 24 Pin ARGB',
    'accessories', 'JONSBO ZA-360 ARGB BLACK Case Fan',
    'warranty', '36 months'
)),

-- Product ID: 2
('PC AMD Gaming Mid Ryzen 7 7800X3D - RTX 4070 Ti', 
'pc-amd-gaming-mid-ryzen-7-7800x3d-rtx-4070-ti', 
'PC Gaming tầm trung mạnh mẽ', 
32000000, 
29000000, 
25, 
5, 
'AMD', 
TRUE, 
'pc-amd-mid.jpg',
NULL,
JSON_OBJECT(
    'cpu', 'AMD Ryzen 7 7800X3D',
    'vga', 'NVIDIA RTX 4070 Ti',
    'ram', '32GB DDR5',
    'ssd', '1TB NVMe',
    'warranty', '36 months'
)),

-- Product ID: 3
('PC ULTRA GAMING I5 13400F - RTX 4060 8GB DUAL OC (Original Config)', 
'pc-ultra-gaming-i5-13400f-rtx-4060-8gb-dual-oc-cau-hinh-goc',
'PC Gaming tầm trung với Intel Core i5 13400F và RTX 4060 8GB',
20580000,
NULL,
30,
5,
'Intel',
TRUE,
'/src/assets/Product/PC/PC-Gaming/PC Ultra Gaming i5 13400F RTX 4060/PC_Ultra_Gaming_i5_13400F_RTX_4060_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/PC/PC-Gaming/PC Ultra Gaming i5 13400F RTX 4060/PC_Ultra_Gaming_i5_13400F_RTX_4060_1.jpg',
    '/src/assets/Product/PC/PC-Gaming/PC Ultra Gaming i5 13400F RTX 4060/PC_Ultra_Gaming_i5_13400F_RTX_4060_2.jpg',
    '/src/assets/Product/PC/PC-Gaming/PC Ultra Gaming i5 13400F RTX 4060/PC_Ultra_Gaming_i5_13400F_RTX_4060_3.jpg',
    '/src/assets/Product/PC/PC-Gaming/PC Ultra Gaming i5 13400F RTX 4060/PC_Ultra_Gaming_i5_13400F_RTX_4060_4.jpg'
),
JSON_OBJECT(
    'cpu', 'Intel Core i5-13400F (Up To 4.60Ghz, 10 Cores 16 Threads, 20 MB Cache, LGA 1700)',
    'mainboard', 'ASUS B760M-K PRIME DDR4',
    'ram', 'SSTC 16GB Bus 3200Mhz DDR4 BLACK TẢN NHIỆT',
    'ssd', 'HIKSEMI WAVE PRO 512GB M.2 2280 PCIe 3.0x4 (Đọc 3500MB/s, Ghi 1800MB/s)',
    'psu', 'FSP HV PRO 650W (80 Plus Bronze/DÂY LIỀN/EU/ĐEN)',
    'vga', 'COLORFUL GEFORCE RTX 4060 NB DUO 8GB-V',
    'case', 'AIGO C218M BLACK - Include 4 FAN ARGB',
    'cooling', 'JONSBO CR-1000',
    'warranty', '36 months'
));

-- =============================================
-- PRODUCTS - PC WORKSTATION (categoryId = 6)
-- =============================================
INSERT INTO products (name, slug, description, price, salePrice, quantity, categoryId, brand, isFeatured, thumbnail, images, specifications) VALUES
-- Product ID: 4
('PC Workstation- 3D Render- Edit Video i7 14700KF - RTX 5070 Ti 16GB OC', 
'pc-workstation-3d-render-edit-video-i7-14700kf-rtx-5070-ti-16gb-oc',
'Professional PC Workstation for 3D rendering and video editing with Intel Core i7 14700KF and RTX 5070 Ti',
50890000,
47680000,
15,
6,
'Intel',
TRUE,
'/src/assets/Product/PC/PC-Workstation/PC Workstation i7 14700KF - RTX 5070 Ti/PC_Workstation_i7_14700KF_RTX_5070_Ti_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/PC/PC-Workstation/PC Workstation i7 14700KF - RTX 5070 Ti/PC_Workstation_i7_14700KF_RTX_5070_Ti_1.jpg',
    '/src/assets/Product/PC/PC-Workstation/PC Workstation i7 14700KF - RTX 5070 Ti/PC_Workstation_i7_14700KF_RTX_5070_Ti_2.jpg',
    '/src/assets/Product/PC/PC-Workstation/PC Workstation i7 14700KF - RTX 5070 Ti/PC_Workstation_i7_14700KF_RTX_5070_Ti_3.jpg',
    '/src/assets/Product/PC/PC-Workstation/PC Workstation i7 14700KF - RTX 5070 Ti/PC_Workstation_i7_14700KF_RTX_5070_Ti_4.jpg',
    '/src/assets/Product/PC/PC-Workstation/PC Workstation i7 14700KF - RTX 5070 Ti/PC_Workstation_i7_14700KF_RTX_5070_Ti_5.jpg',
    '/src/assets/Product/PC/PC-Workstation/PC Workstation i7 14700KF - RTX 5070 Ti/PC_Workstation_i7_14700KF_RTX_5070_Ti_6.jpg',
    '/src/assets/Product/PC/PC-Workstation/PC Workstation i7 14700KF - RTX 5070 Ti/PC_Workstation_i7_14700KF_RTX_5070_Ti_7.jpg',
    '/src/assets/Product/PC/PC-Workstation/PC Workstation i7 14700KF - RTX 5070 Ti/PC_Workstation_i7_14700KF_RTX_5070_Ti_8.jpg',
    '/src/assets/Product/PC/PC-Workstation/PC Workstation i7 14700KF - RTX 5070 Ti/PC_Workstation_i7_14700KF_RTX_5070_Ti_9.jpg',
    '/src/assets/Product/PC/PC-Workstation/PC Workstation i7 14700KF - RTX 5070 Ti/PC_Workstation_i7_14700KF_RTX_5070_Ti_10.jpg'
),
JSON_OBJECT(
    'cpu', 'Intel Core i7 14700KF (20 Core - 28 Thread - Base 3.4Ghz - Turbo 5.6Mhz)',
    'mainboard', 'GIGABYTE Z790 D WIFI DDR5',
    'ram', 'GEIL SPEAR V 32GB (2x16GB) BUSS 5200MHZ DDR5 BLACK',
    'ssd', 'HIKSEMI WAVE 512GB M.2 2280 PCIe 3.0x4',
    'psu', 'FSP VITA 850BD - 850W PPA8504502 BRONZE',
    'vga', 'ZOTAC GAMING GeForce RTX 5070Ti SOLID SFF OC 16GB GDDR7',
    'case', 'ANTEC C3 BLACK - Include 4 FAN ARGB',
    'cooling', 'Thermalright Peerless Assassin 120 SE ARGB BLACK',
    'warranty', '36 months'
));

-- =============================================
-- PRODUCTS - VGA (categoryId = 15)
-- =============================================
INSERT INTO products (name, slug, description, price, salePrice, quantity, categoryId, brand, isFeatured, thumbnail, images, specifications) VALUES
-- Product ID: 5
('CARD MÀN HÌNH COLORFUL GEFORCE RTX 4060 NB DUO 8GB-V', 
'card-man-hinh-colorful-geforce-rtx-4060-nb-duo-8gb-v',
'Card màn hình NVIDIA GeForce RTX 4060 8GB GDDR6 hiệu năng cao',
8399000,
NULL,
45,
15,
'NVIDIA',
FALSE,
'/src/assets/Product/Hardware/VGA/Colorful RTX 4060 NB DUO/Colorful_RTX_4060_NB_DUO_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Hardware/VGA/Colorful RTX 4060 NB DUO/Colorful_RTX_4060_NB_DUO_1.jpg',
    '/src/assets/Product/Hardware/VGA/Colorful RTX 4060 NB DUO/Colorful_RTX_4060_NB_DUO_2.jpg',
    '/src/assets/Product/Hardware/VGA/Colorful RTX 4060 NB DUO/Colorful_RTX_4060_NB_DUO_3.jpg',
    '/src/assets/Product/Hardware/VGA/Colorful RTX 4060 NB DUO/Colorful_RTX_4060_NB_DUO_4.jpg',
    '/src/assets/Product/Hardware/VGA/Colorful RTX 4060 NB DUO/Colorful_RTX_4060_NB_DUO_5.jpg',
    '/src/assets/Product/Hardware/VGA/Colorful RTX 4060 NB DUO/Colorful_RTX_4060_NB_DUO_6.jpg'
),
JSON_OBJECT(
    'memory', '8GB GDDR6',
    'clockSpeed', '1830 MHz',
    'boostSpeed', '2460 MHz',
    'memoryBus', '128-bit',
    'tdp', '115W',
    'connector', 'DisplayPort 1.4a (x3), HDMI 2.1',
    'powerRequirement', '550W',
    'warranty', '36 months'
)),

-- Product ID: 6
('VGA ASUS ROG STRIX RTX 4090 OC 24GB GDDR6X',
'vga-asus-rog-strix-rtx-4090-oc-24gb',
'Card màn hình ASUS ROG STRIX RTX 4090 OC Edition mạnh mẽ nhất',
54990000,
52990000,
15,
15,
'ASUS',
TRUE,
'/src/assets/Product/Hardware/VGA/ASUS ROG RTX 4090/ASUS_ROG_RTX_4090_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/VGA/ASUS ROG RTX 4090/ASUS_ROG_RTX_4090_1.jpg'),
JSON_OBJECT(
    'gpu', 'NVIDIA RTX 4090', 
    'memory', '24GB GDDR6X', 
    'memoryBus', '384-bit', 
    'coreClock', '2640 MHz (Boost)', 
    'tdp', '450W', 
    'connector', '3x DP 1.4a, 2x HDMI 2.1', 
    'powerPin', '3x 8-pin', 
    'cooling', 'Triple Fan', 
    'warranty', '36 months'
)),

-- Product ID: 7
('VGA MSI GeForce RTX 4080 SUPER GAMING X TRIO 16GB',
'vga-msi-rtx-4080-super-gaming-x-trio-16gb',
'Card màn hình MSI RTX 4080 SUPER GAMING X TRIO hiệu năng cao',
32990000,
30990000,
25,
15,
'MSI',
TRUE,
'/src/assets/Product/Hardware/VGA/MSI RTX 4080 SUPER/MSI_RTX_4080_SUPER_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/VGA/MSI RTX 4080 SUPER/MSI_RTX_4080_SUPER_1.jpg'),
JSON_OBJECT(
    'gpu', 'NVIDIA RTX 4080 SUPER', 
    'memory', '16GB GDDR6X', 
    'memoryBus', '256-bit', 
    'coreClock', '2550 MHz (Boost)', 
    'tdp', '320W', 
    'connector', '3x DP 1.4a, 1x HDMI 2.1', 
    'powerPin', '3x 8-pin', 
    'cooling', 'Triple Fan', 
    'warranty', '36 months'
)),

-- Product ID: 8
('VGA Gigabyte AORUS RTX 4070 Ti SUPER MASTER 16GB',
'vga-gigabyte-aorus-rtx-4070-ti-super-master-16gb',
'Card màn hình Gigabyte AORUS RTX 4070 Ti SUPER với tản nhiệt Windforce',
22990000,
21490000,
35,
15,
'GIGABYTE',
TRUE,
'/src/assets/Product/Hardware/VGA/Gigabyte RTX 4070 Ti SUPER/Gigabyte_RTX_4070_Ti_SUPER_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/VGA/Gigabyte RTX 4070 Ti SUPER/Gigabyte_RTX_4070_Ti_SUPER_1.jpg'),
JSON_OBJECT(
    'gpu', 'NVIDIA RTX 4070 Ti SUPER', 
    'memory', '16GB GDDR6X', 
    'memoryBus', '256-bit', 
    'coreClock', '2610 MHz (Boost)', 
    'tdp', '285W', 
    'connector', '3x DP 1.4a, 1x HDMI 2.1', 
    'powerPin', '2x 8-pin', 
    'cooling', 'Triple Fan Windforce', 
    'warranty', '36 months'
)),

-- Product ID: 9
('VGA Sapphire Pulse AMD Radeon RX 7900 XTX 24GB',
'vga-sapphire-pulse-rx-7900-xtx-24gb',
'Card màn hình AMD Radeon RX 7900 XTX với 24GB VRAM',
26990000,
24990000,
30,
15,
'Sapphire',
TRUE,
'/src/assets/Product/Hardware/VGA/Sapphire RX 7900 XTX/Sapphire_RX_7900_XTX_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/VGA/Sapphire RX 7900 XTX/Sapphire_RX_7900_XTX_1.jpg'),
JSON_OBJECT(
    'gpu', 'AMD RX 7900 XTX', 
    'memory', '24GB GDDR6', 
    'memoryBus', '384-bit', 
    'coreClock', '2500 MHz (Boost)', 
    'tdp', '355W', 
    'connector', '2x DP 2.1, 1x HDMI 2.1', 
    'powerPin', '2x 8-pin', 
    'cooling', 'Dual Fan', 
    'warranty', '36 months'
));

-- =============================================
-- PRODUCTS - MAINBOARD (categoryId = 13)
-- =============================================
INSERT INTO products (name, slug, description, price, salePrice, quantity, categoryId, brand, isFeatured, thumbnail, images, specifications) VALUES
-- Product ID: 10
('Mainboard ASUS ROG STRIX X870E-H GAMING WIFI 7 Hatsune Miku Edition', 
'mainboard-asus-rog-strix-x870e-h-gaming-wifi-7-hatsune-miku-edition',
'Bo mạch chủ ASUS ROG STRIX X870E-H phiên bản Hatsune Miku cao cấp với WiFi 7',
16990000,
14890000,
20,
13,
'ASUS',
TRUE,
'/src/assets/Product/Hardware/Mainboard/ASUS ROG STRIX X870E-H Hatsune Miku/ASUS_ROG_STRIX_X870E_H_Hatsune_Miku_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Hardware/Mainboard/ASUS ROG STRIX X870E-H Hatsune Miku/ASUS_ROG_STRIX_X870E_H_Hatsune_Miku_1.jpg',
    '/src/assets/Product/Hardware/Mainboard/ASUS ROG STRIX X870E-H Hatsune Miku/ASUS_ROG_STRIX_X870E_H_Hatsune_Miku_2.jpg',
    '/src/assets/Product/Hardware/Mainboard/ASUS ROG STRIX X870E-H Hatsune Miku/ASUS_ROG_STRIX_X870E_H_Hatsune_Miku_3.jpg',
    '/src/assets/Product/Hardware/Mainboard/ASUS ROG STRIX X870E-H Hatsune Miku/ASUS_ROG_STRIX_X870E_H_Hatsune_Miku_4.jpg',
    '/src/assets/Product/Hardware/Mainboard/ASUS ROG STRIX X870E-H Hatsune Miku/ASUS_ROG_STRIX_X870E_H_Hatsune_Miku_5.jpg',
    '/src/assets/Product/Hardware/Mainboard/ASUS ROG STRIX X870E-H Hatsune Miku/ASUS_ROG_STRIX_X870E_H_Hatsune_Miku_6.jpg',
    '/src/assets/Product/Hardware/Mainboard/ASUS ROG STRIX X870E-H Hatsune Miku/ASUS_ROG_STRIX_X870E_H_Hatsune_Miku_7.jpg',
    '/src/assets/Product/Hardware/Mainboard/ASUS ROG STRIX X870E-H Hatsune Miku/ASUS_ROG_STRIX_X870E_H_Hatsune_Miku_8.jpg',
    '/src/assets/Product/Hardware/Mainboard/ASUS ROG STRIX X870E-H Hatsune Miku/ASUS_ROG_STRIX_X870E_H_Hatsune_Miku_9.jpg'
),
JSON_OBJECT(
    'socket', 'AMD Socket AM5 for AMD Ryzen™ 9000, 8000 and 7000 Series desktop processors',
    'formFactor', 'ATX',
    'ramSlots', '4 khe (Tối đa 256GB)',
    'pciSlots', '1 x PCIe 5.0 x16 slot (supports x16 mode), 1 x PCIe 4.0 x16 slot (supports x8/x4 mode), 1 x PCIe 4.0 x16 slot (supports x4 mode)',
    'storageSlots', '4 x M.2 slot, 4 x SATA 6Gb/s ports',
    'chipset', 'AMD X870E',
    'wifi', 'WiFi 7',
    'specialEdition', 'Hatsune Miku Limited Edition',
    'warranty', '36 months'
)),

-- Product ID: 11
('Mainboard ASUS ROG MAXIMUS Z790 HERO (LGA1700, DDR5, WiFi 7)',
'mainboard-asus-rog-maximus-z790-hero',
'Bo mạch chủ ASUS ROG MAXIMUS Z790 HERO cao cấp cho Intel Gen 14',
15990000,
14990000,
25,
13,
'ASUS',
TRUE,
'/src/assets/Product/Hardware/Mainboard/ASUS ROG Z790 HERO/ASUS_ROG_Z790_HERO_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/Mainboard/ASUS ROG Z790 HERO/ASUS_ROG_Z790_HERO_1.jpg'),
JSON_OBJECT(
    'socket', 'LGA1700', 
    'chipset', 'Intel Z790', 
    'formFactor', 'ATX', 
    'ramSlots', '4 x DDR5 (Max 192GB)', 
    'ramSpeed', 'Up to DDR5-7800+', 
    'pciSlots', '1x PCIe 5.0 x16 , 1x PCIe 4.0 x16', 
    'm2Slots', '5x M.2', 
    'wifi', 'WiFi 7', 
    'warranty', '36 months'
)),

-- Product ID: 12
('Mainboard MSI MAG B650 TOMAHAWK WIFI (AM5, DDR5, WiFi 6E)',
'mainboard-msi-mag-b650-tomahawk-wifi',
'Bo mạch chủ MSI MAG B650 TOMAHAWK WIFI cho AMD Ryzen 7000',
6990000,
6490000,
45,
13,
'MSI',
TRUE,
'/src/assets/Product/Hardware/Mainboard/MSI B650 TOMAHAWK/MSI_B650_TOMAHAWK_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/Mainboard/MSI B650 TOMAHAWK/MSI_B650_TOMAHAWK_1.jpg'),
JSON_OBJECT(
    'socket', 'AM5', 
    'chipset', 'AMD B650', 
    'formFactor', 'ATX', 
    'ramSlots', '4 x DDR5 (Max 128GB)', 
    'ramSpeed', 'Up to DDR5-6400+', 
    'pciSlots', '1x PCIe 4.0 x16, 1x PCIe 3.0 x16', 
    'm2Slots', '3x M.2', 
    'wifi', 'WiFi 6E', 
    'warranty', '36 months'
)),

-- Product ID: 13
('Mainboard GIGABYTE B760M AORUS ELITE AX (LGA1700, DDR5, WiFi 6)',
'mainboard-gigabyte-b760m-aorus-elite-ax',
'Bo mạch chủ GIGABYTE B760M AORUS ELITE AX Micro-ATX',
4990000,
4490000,
55,
13,
'GIGABYTE',
FALSE,
'/src/assets/Product/Hardware/Mainboard/Gigabyte B760M AORUS/Gigabyte_B760M_AORUS_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/Mainboard/Gigabyte B760M AORUS/Gigabyte_B760M_AORUS_1.jpg'),
JSON_OBJECT(
    'socket', 'LGA1700', 
    'chipset', 'Intel B760', 
    'formFactor', 'Micro-ATX', 
    'ramSlots', '4 x DDR5 (Max 128GB)', 
    'ramSpeed', 'Up to DDR5-6400', 
    'pciSlots', '1x PCIe 4.0 x16', 
    'm2Slots', '2x M.2', 
    'wifi', 'WiFi 6', 
    'warranty', '36 months'
));

-- =============================================
-- PRODUCTS - CPU (categoryId = 12)
-- =============================================
INSERT INTO products (name, slug, description, price, salePrice, quantity, categoryId, brand, isFeatured, thumbnail, images, specifications) VALUES
-- Product ID: 14
('CPU Intel Core Ultra 9 285K (Up to 5.7GHz, 24 Cores - 24 Threads, 36MB Cache, Arrow Lake-S)', 
'cpu-intel-core-ultra-9-285k-up-to-5-7ghz-24-nhan-24-luong-36mb-cache-arrow-lake-s',
'Bộ vi xử lý Intel Core Ultra 9 thế hệ mới với kiến trúc Arrow Lake-S',
17699000,
16190000,
50,
12,
'Intel',
TRUE,
'/src/assets/Product/Hardware/CPU/Intel Core Ultra 9 285K/Intel_Core_Ultra_9_285K_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Hardware/CPU/Intel Core Ultra 9 285K/Intel_Core_Ultra_9_285K_1.jpg',
    '/src/assets/Product/Hardware/CPU/Intel Core Ultra 9 285K/Intel_Core_Ultra_9_285K_2.jpg'
),
JSON_OBJECT(
    'model', 'Intel Core Ultra 9 285K',
    'cores', '24 Cores (8P-Core + 16E-Core)',
    'threads', '24 Threads',
    'socket', 'LGA 1851',
    'boostClockPCore', '5.7 GHz',
    'boostClockECore', '4.6 GHz',
    'cache', '36MB',
    'tdp', '125W',
    'architecture', 'Arrow Lake-S',
    'warranty', '36 months'
)),

-- Product ID: 15
('CPU AMD Ryzen 9 7950X3D (16 Core 32 Thread, Up to 5.7GHz, 144MB Cache)', 
'cpu-amd-ryzen-9-7950x3d',
'CPU AMD Ryzen 9 7950X3D với công nghệ 3D V-Cache mạnh mẽ cho gaming và workstation',
15990000,
14990000,
35,
12,
'AMD',
TRUE,
'/src/assets/Product/Hardware/CPU/AMD Ryzen 9 7950X3D/AMD_Ryzen_9_7950X3D_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/CPU/AMD Ryzen 9 7950X3D/AMD_Ryzen_9_7950X3D_1.jpg', 
            '/src/assets/Product/Hardware/CPU/AMD Ryzen 9 7950X3D/AMD_Ryzen_9_7950X3D_2.jpg'),
JSON_OBJECT(
    'model', 'Ryzen 9 7950X3D', 
    'cores', '16', 
    'threads', '32', 
    'socket', 'AM5', 
    'baseClock', '4.2 GHz', 
    'boostClock', '5.7 GHz', 
    'cache', '144MB', 
    'tdp', '120W', 
    'warranty', '36 months'
)),

-- Product ID: 16
('CPU Intel Core i9-14900K (24 Core 32 Thread, Up to 6.0GHz, 36MB Cache)',
'cpu-intel-core-i9-14900k',
'CPU Intel Core i9-14900K thế hệ 14 hiệu năng đỉnh cao',
13990000,
12990000,
40,
12,
'Intel',
TRUE,
'/src/assets/Product/Hardware/CPU/Intel i9-14900K/Intel_i9_14900K_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/CPU/Intel i9-14900K/Intel_i9_14900K_1.jpg'),
JSON_OBJECT(
    'model', 'Core i9-14900K', 
    'cores', '24 (8P+16E)', 
    'threads', '32', 
    'socket', 'LGA1700', 
    'baseClock', '3.2 GHz', 
    'boostClock', '6.0 GHz', 
    'cache', '36MB', 
    'tdp', '125W', 
    'warranty', '36 months'
)),

-- Product ID: 17
('CPU AMD Ryzen 7 7800X3D (8 Core 16 Thread, Up to 5.0GHz, 104MB Cache)',
'cpu-amd-ryzen-7-7800x3d',
'CPU AMD Ryzen 7 7800X3D - Best gaming CPU với 3D V-Cache',
10990000,
9990000,
60,
12,
'AMD',
TRUE,
'/src/assets/Product/Hardware/CPU/AMD Ryzen 7 7800X3D/AMD_Ryzen_7_7800X3D_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/CPU/AMD Ryzen 7 7800X3D/AMD_Ryzen_7_7800X3D_1.jpg'),
JSON_OBJECT(
    'model', 'Ryzen 7 7800X3D', 
    'cores', '8', 
    'threads', '16', 
    'socket', 'AM5', 
    'baseClock', '4.2 GHz', 
    'boostClock', '5.0 GHz', 
    'cache', '104MB (96MB 3D V-Cache)', 
    'tdp', '120W', 
    'warranty', '36 months'
)),

-- Product ID: 18
('CPU Intel Core i5-14600KF (14 Core 20 Thread, Up to 5.3GHz, 24MB Cache)',
'cpu-intel-core-i5-14600kf',
'CPU Intel Core i5-14600KF tầm trung hiệu năng cao cho gaming',
6990000,
6490000,
70,
12,
'Intel',
FALSE,
'/src/assets/Product/Hardware/CPU/Intel i5-14600KF/Intel_i5_14600KF_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/CPU/Intel i5-14600KF/Intel_i5_14600KF_1.jpg'),
JSON_OBJECT(
    'model', 'Core i5-14600KF', 
    'cores', '14 (6P+8E)', 
    'threads', '20', 
    'socket', 'LGA1700', 
    'baseClock', '3.5 GHz', 
    'boostClock', '5.3 GHz', 
    'cache', '24MB', 
    'tdp', '125W', 
    'warranty', '36 months'
));

-- =============================================
-- PRODUCTS - RAM (categoryId = 14)
-- =============================================
INSERT INTO products (name, slug, description, price, salePrice, quantity, categoryId, brand, isFeatured, thumbnail, images, specifications) VALUES
-- Product ID: 19
('RAM TEAMGROUP T-Force Vulcan Z 16GB (1x16GB) DDR4 3200MHz', 
'ram-teamgroup-t-force-vulcan-z-16gb-1x16gb-ddr4-3200mhz',
'Bộ nhớ RAM TEAMGROUP T-Force Vulcan Z 16GB DDR4 3200MHz hiệu năng tốt',
2490000,
NULL,
100,
14,
'TEAMGROUP',
FALSE,
'/src/assets/Product/Hardware/RAM/TEAMGROUP T-Force Vulcan Z 16GB DDR4/TEAMGROUP_T_Force_Vulcan_Z_16GB_DDR4_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Hardware/RAM/TEAMGROUP T-Force Vulcan Z 16GB DDR4/TEAMGROUP_T_Force_Vulcan_Z_16GB_DDR4_1.jpg',
    '/src/assets/Product/Hardware/RAM/TEAMGROUP T-Force Vulcan Z 16GB DDR4/TEAMGROUP_T_Force_Vulcan_Z_16GB_DDR4_2.jpg',
    '/src/assets/Product/Hardware/RAM/TEAMGROUP T-Force Vulcan Z 16GB DDR4/TEAMGROUP_T_Force_Vulcan_Z_16GB_DDR4_3.jpg',
    '/src/assets/Product/Hardware/RAM/TEAMGROUP T-Force Vulcan Z 16GB DDR4/TEAMGROUP_T_Force_Vulcan_Z_16GB_DDR4_4.jpg',
    '/src/assets/Product/Hardware/RAM/TEAMGROUP T-Force Vulcan Z 16GB DDR4/TEAMGROUP_T_Force_Vulcan_Z_16GB_DDR4_5.jpg'
),
JSON_OBJECT(
    'capacity', '16GB (1x16GB)',
    'type', 'DDR4',
    'speed', '3200MHz',
    'latency', 'CL16-18-18-38',
    'voltage', '1.35V',
    'heatspreader', 'Aluminum',
    'warranty', '36 months'
)),

-- Product ID: 20
('RAM G.SKILL Trident Z5 RGB 32GB (2x16GB) DDR5 6000MHz CL30',
'ram-gskill-trident-z5-rgb-32gb-ddr5-6000',
'RAM G.SKILL Trident Z5 RGB DDR5 6000MHz với hiệu ứng đèn RGB đẹp mắt',
4990000,
4490000,
80,
14,
'G.SKILL',
TRUE,
'/src/assets/Product/Hardware/RAM/GSKILL Trident Z5/GSKILL_Trident_Z5_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/RAM/GSKILL Trident Z5/GSKILL_Trident_Z5_1.jpg'),
JSON_OBJECT(
    'capacity', '32GB (2x16GB)', 
    'type', 'DDR5', 
    'speed', '6000MHz', 
    'latency', 'CL30-40-40-96', 
    'voltage', '1.35V', 
    'rgb', 'Yes', 
    'warranty', 'Lifetime'
)),

-- Product ID: 21
('RAM Corsair Vengeance RGB 32GB (2x16GB) DDR5 5600MHz',
'ram-corsair-vengeance-rgb-32gb-ddr5-5600',
'RAM Corsair Vengeance RGB DDR5 5600MHz với RGB Lighting',
3990000,
3690000,
90,
14,
'Corsair',
TRUE,
'/src/assets/Product/Hardware/RAM/Corsair Vengeance RGB/Corsair_Vengeance_RGB_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/RAM/Corsair Vengeance RGB/Corsair_Vengeance_RGB_1.jpg'),
JSON_OBJECT(
    'capacity', '32GB (2x16GB)', 
    'type', 'DDR5', 
    'speed', '5600MHz', 
    'latency', 'CL36-36-36-76', 
    'voltage', '1.25V', 
    'rgb', 'Yes', 
    'warranty', 'Lifetime'
)),

-- Product ID: 22
('RAM Kingston Fury Beast 16GB (2x8GB) DDR4 3200MHz',
'ram-kingston-fury-beast-16gb-ddr4-3200',
'RAM Kingston Fury Beast DDR4 3200MHz giá tốt cho PC Gaming',
1690000,
1590000,
120,
14,
'Kingston',
FALSE,
'/src/assets/Product/Hardware/RAM/Kingston Fury Beast/Kingston_Fury_Beast_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/RAM/Kingston Fury Beast/Kingston_Fury_Beast_1.jpg'),
JSON_OBJECT(
    'capacity', '16GB (2x8GB)', 
    'type', 'DDR4', 
    'speed', '3200MHz', 
    'latency', 'CL16', 
    'voltage', '1.35V', 
    'rgb', 'No', 
    'warranty', 'Lifetime'
));

-- =============================================
-- PRODUCTS - SSD (categoryId = 16)
-- =============================================
INSERT INTO products (name, slug, description, price, salePrice, quantity, categoryId, brand, isFeatured, thumbnail, images, specifications) VALUES
-- Product ID: 23
('SSD Samsung 990 PRO 2TB M.2 NVMe PCIe Gen4 x4',
'ssd-samsung-990-pro-2tb-m2-nvme',
'Ổ cứng SSD Samsung 990 PRO 2TB tốc độ đọc/ghi cực nhanh',
5990000,
5490000,
60,
16,
'Samsung',
TRUE,
'/src/assets/Product/Hardware/SSD/Samsung 990 PRO/Samsung_990_PRO_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/SSD/Samsung 990 PRO/Samsung_990_PRO_1.jpg'),
JSON_OBJECT(
    'capacity', '2TB', 
    'interface', 'M.2 NVMe PCIe Gen4 x4', 
    'formFactor', 'M.2 2280', 
    'readSpeed', '7450 MB/s', 
    'writeSpeed', '6900 MB/s', 
    'tbw', '1200 TBW', 
    'warranty', '60 months'
)),

-- Product ID: 24
('SSD WD Black SN850X 1TB M.2 NVMe PCIe Gen4',
'ssd-wd-black-sn850x-1tb-m2-nvme',
'Ổ cứng SSD WD Black SN850X 1TB dành cho gaming',
3490000,
3190000,
75,
16,
'Western Digital',
TRUE,
'/src/assets/Product/Hardware/SSD/WD Black SN850X/WD_Black_SN850X_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/SSD/WD Black SN850X/WD_Black_SN850X_1.jpg'),
JSON_OBJECT(
    'capacity', '1TB', 
    'interface', 'M.2 NVMe PCIe Gen4 x4', 
    'formFactor', 'M.2 2280', 
    'readSpeed', '7300 MB/s', 
    'writeSpeed', '6300 MB/s', 
    'tbw', '600 TBW', 
    'warranty', '60 months'
)),

-- Product ID: 25
('SSD Kingston NV2 500GB M.2 NVMe PCIe 4.0',
'ssd-kingston-nv2-500gb-m2-nvme',
'Ổ cứng SSD Kingston NV2 500GB giá rẻ cho PC Office',
1290000,
1190000,
100,
16,
'Kingston',
FALSE,
'/src/assets/Product/Hardware/SSD/Kingston NV2/Kingston_NV2_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/SSD/Kingston NV2/Kingston_NV2_1.jpg'),
JSON_OBJECT(
    'capacity', '500GB', 
    'interface', 'M.2 NVMe PCIe 4.0 x4', 
    'formFactor', 'M.2 2280', 
    'readSpeed', '3500 MB/s', 
    'writeSpeed', '2100 MB/s', 
    'tbw', '160 TBW', 
    'warranty', '36 months'
));

-- =============================================
-- PRODUCTS - COOLING (categoryId = 17)
-- =============================================
INSERT INTO products (name, slug, description, price, salePrice, quantity, categoryId, brand, isFeatured, thumbnail, images, specifications) VALUES
-- Product ID: 26
('Tản nhiệt nước NZXT Kraken Elite 360 RGB (360mm AIO)',
'cooling-nzxt-kraken-elite-360-rgb',
'Tản nhiệt nước NZXT Kraken Elite 360 với màn hình LCD 2.36 inch',
7990000,
7490000,
35,
17,
'NZXT',
TRUE,
'/src/assets/Product/Hardware/Cooling/NZXT Kraken Elite 360/NZXT_Kraken_Elite_360_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/Cooling/NZXT Kraken Elite 360/NZXT_Kraken_Elite_360_1.jpg'),
JSON_OBJECT(
    'type', 'AIO Liquid Cooling', 
    'radiatorSize', '360mm', 
    'fanSize', '3x 120mm RGB', 
    'lcdScreen', '2.36 inch', 
    'socket', 'Intel LGA1700/1200/1151, AMD AM5/AM4', 
    'warranty', '72 months'
)),

-- Product ID: 27
('Tản nhiệt khí Noctua NH-D15 chromax.black',
'cooling-noctua-nh-d15-chromax-black',
'Tản nhiệt khí Noctua NH-D15 chromax.black hiệu năng đỉnh cao',
3290000,
2990000,
50,
17,
'Noctua',
TRUE,
'/src/assets/Product/Hardware/Cooling/Noctua NH-D15/Noctua_NH_D15_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/Cooling/Noctua NH-D15/Noctua_NH_D15_1.jpg'),
JSON_OBJECT(
    'type', 'Air Cooling', 
    'heatpipes', '6x 6mm', 
    'fanSize', '2x 140mm', 
    'height', '165mm', 
    'socket', 'Intel LGA1700/1200/1151, AMD AM5/AM4', 
    'warranty', '72 months'
)),

-- Product ID: 28
('Tản nhiệt nước Corsair iCUE H150i Elite LCD XT (360mm)',
'cooling-corsair-icue-h150i-elite-lcd-xt',
'Tản nhiệt nước Corsair iCUE H150i Elite LCD XT với màn hình IPS',
6490000,
5990000,
40,
17,
'Corsair',
TRUE,
'/src/assets/Product/Hardware/Cooling/Corsair H150i Elite LCD/Corsair_H150i_Elite_LCD_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/Cooling/Corsair H150i Elite LCD/Corsair_H150i_Elite_LCD_1.jpg'),
JSON_OBJECT(
    'type', 'AIO Liquid Cooling', 
    'radiatorSize', '360mm', 
    'fanSize', '3x 120mm RGB', 
    'lcdScreen', 'IPS 2.1 inch', 
    'socket', 'Intel LGA1700/1200/1151, AMD AM5/AM4', 
    'warranty', '60 months'
));

-- =============================================
-- PRODUCTS - CASE (categoryId = 18)
-- =============================================
INSERT INTO products (name, slug, description, price, salePrice, quantity, categoryId, brand, isFeatured, thumbnail, images, specifications) VALUES
-- Product ID: 29
('Case Lian Li O11 Dynamic EVO (ATX, Mid Tower, Tempered Glass)',
'case-lian-li-o11-dynamic-evo-atx',
'Vỏ case Lian Li O11 Dynamic EVO với thiết kế kính cường lực 3 mặt',
4990000,
4690000,
45,
18,
'Lian Li',
TRUE,
'/src/assets/Product/Hardware/Case/Lian Li O11 Dynamic EVO/Lian_Li_O11_Dynamic_EVO_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/Case/Lian Li O11 Dynamic EVO/Lian_Li_O11_Dynamic_EVO_1.jpg'),
JSON_OBJECT(
    'formFactor', 'Mid Tower ATX', 
    'material', 'Aluminum + Tempered Glass', 
    'fanSupport', 'Up to 13x 120mm', 
    'radiatorSupport', 'Top/Side/Bottom 360mm', 
    'maxGpuLength', '420mm', 
    'maxCpuCoolerHeight', '167mm', 
    'warranty', '24 months'
)),

-- Product ID: 30
('Case NZXT H9 Flow (ATX, Mid Tower, Mesh Front)',
'case-nzxt-h9-flow-atx',
'Vỏ case NZXT H9 Flow với mặt trước mesh thông thoáng',
3990000,
3690000,
50,
18,
'NZXT',
TRUE,
'/src/assets/Product/Hardware/Case/NZXT H9 Flow/NZXT_H9_Flow_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/Case/NZXT H9 Flow/NZXT_H9_Flow_1.jpg'),
JSON_OBJECT(
    'formFactor', 'Mid Tower ATX', 
    'material', 'Steel + Tempered Glass', 
    'fanSupport', 'Up to 10x 120mm', 
    'radiatorSupport', 'Top/Front 360mm', 
    'maxGpuLength', '400mm', 
    'maxCpuCoolerHeight', '185mm', 
    'warranty', '24 months'
)),

-- Product ID: 31
('Case Fractal Design Torrent (E-ATX, Mid Tower, High Airflow)',
'case-fractal-design-torrent-eatx',
'Vỏ case Fractal Design Torrent với luồng khí mạnh mẽ',
5490000,
4990000,
35,
18,
'Fractal Design',
TRUE,
'/src/assets/Product/Hardware/Case/Fractal Torrent/Fractal_Torrent_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/Case/Fractal Torrent/Fractal_Torrent_1.jpg'),
JSON_OBJECT(
    'formFactor', 'Mid Tower E-ATX', 
    'material', 'Steel + Tempered Glass', 
    'includedFans', '2x 180mm RGB', 
    'fanSupport', 'Front 2x180mm or 3x140mm', 
    'radiatorSupport', 'Top/Bottom 360mm', 
    'maxGpuLength', '461mm', 
    'maxCpuCoolerHeight', '188mm', 
    'warranty', '24 months'
));

-- =============================================
-- PRODUCTS - PSU (categoryId = 19)
-- =============================================
INSERT INTO products (name, slug, description, price, salePrice, quantity, categoryId, brand, isFeatured, thumbnail, images, specifications) VALUES
-- Product ID: 32
('PSU Corsair RM1000x SHIFT 1000W 80 Plus Gold Full Modular',
'psu-corsair-rm1000x-shift-1000w-80-plus-gold',
'Nguồn Corsair RM1000x SHIFT 1000W 80 Plus Gold với thiết kế connector ở bên',
5990000,
5590000,
40,
19,
'Corsair',
TRUE,
'/src/assets/Product/Hardware/PSU/Corsair RM1000x SHIFT/Corsair_RM1000x_SHIFT_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/PSU/Corsair RM1000x SHIFT/Corsair_RM1000x_SHIFT_1.jpg'),
JSON_OBJECT(
    'wattage', '1000W', 
    'efficiency', '80 Plus Gold', 
    'modular', 'Full Modular', 
    'pcieCable', '5x 8-pin', 
    'fanSize', '135mm', 
    'warranty', '120 months'
)),

-- Product ID: 33
('PSU ASUS ROG THOR 1200W Platinum II 80 Plus Platinum',
'psu-asus-rog-thor-1200w-platinum-ii',
'Nguồn ASUS ROG THOR 1200W Platinum II với màn hình OLED',
9990000,
9490000,
20,
19,
'ASUS',
TRUE,
'/src/assets/Product/Hardware/PSU/ASUS ROG THOR 1200W/ASUS_ROG_THOR_1200W_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/PSU/ASUS ROG THOR 1200W/ASUS_ROG_THOR_1200W_1.jpg'),
JSON_OBJECT(
    'wattage', '1200W', 
    'efficiency', '80 Plus Platinum', 
    'modular', 'Full Modular', 
    'oledDisplay', 'Yes', 
    'pcieCable', '6x 8-pin', 
    'fanSize', '135mm', 
    'warranty', '120 months'
)),

-- Product ID: 34
('PSU MSI MAG A850GL 850W 80 Plus Gold Full Modular',
'psu-msi-mag-a850gl-850w-80-plus-gold',
'Nguồn MSI MAG A850GL 850W 80 Plus Gold PCIe 5.0 Ready',
3490000,
3290000,
55,
19,
'MSI',
FALSE,
'/src/assets/Product/Hardware/PSU/MSI MAG A850GL/MSI_MAG_A850GL_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/PSU/MSI MAG A850GL/MSI_MAG_A850GL_1.jpg'),
JSON_OBJECT(
    'wattage', '850W', 
    'efficiency', '80 Plus Gold', 
    'modular', 'Full Modular', 
    'pcie50', 'Yes', 
    'pcieCable', '4x 8-pin', 
    'fanSize', '135mm', 
    'warranty', '120 months'
));

-- =============================================
-- PRODUCTS - CONSOLE (categoryId = 8)
-- =============================================
INSERT INTO products (name, slug, description, price, salePrice, quantity, categoryId, brand, isFeatured, thumbnail, images, specifications) VALUES
-- Product ID: 35
('Sony PlayStation 5 Pro 2TB (CFI-7000 Series)',
'sony-playstation-5-pro-2tb-cfi-7000',
'Console PS5 Pro với GPU nâng cấp, 2TB SSD, hỗ trợ 8K gaming',
23990000,
22490000,
25,
8,
'Sony',
TRUE,
'/src/assets/Product/Gaming-Gear/Console/PS5 Pro/PS5_Pro_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Gaming-Gear/Console/PS5 Pro/PS5_Pro_1.jpg',
    '/src/assets/Product/Gaming-Gear/Console/PS5 Pro/PS5_Pro_2.jpg',
    '/src/assets/Product/Gaming-Gear/Console/PS5 Pro/PS5_Pro_3.jpg',
    '/src/assets/Product/Gaming-Gear/Console/PS5 Pro/PS5_Pro_4.jpg'
),
JSON_OBJECT(
    'cpu', 'AMD Zen 2 8-core (Enhanced)', 
    'gpu', 'AMD RDNA 3 (16.7 TFLOPS)', 
    'ram', '16GB GDDR6', 
    'storage', '2TB SSD', 
    'resolution', '4K/8K', 
    'fps', 'Up to 120fps', 
    'rayTracing', 'Yes', 
    'warranty', '12 months'
)),

-- Product ID: 36
('Microsoft Xbox Series X 1TB (Carbon Black)',
'microsoft-xbox-series-x-1tb-carbon-black',
'Console Xbox Series X thế hệ mới với 1TB SSD, hỗ trợ 4K 120fps',
13990000,
12990000,
30,
8,
'Microsoft',
TRUE,
'/src/assets/Product/Gaming-Gear/Console/Xbox Series X/Xbox_Series_X_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Gaming-Gear/Console/Xbox Series X/Xbox_Series_X_1.jpg',
    '/src/assets/Product/Gaming-Gear/Console/Xbox Series X/Xbox_Series_X_2.jpg'
),
JSON_OBJECT(
    'cpu', 'AMD Zen 2 8-core 3.8GHz', 
    'gpu', 'AMD RDNA 2 (12 TFLOPS)', 
    'ram', '16GB GDDR6', 
    'storage', '1TB NVMe SSD', 
    'resolution', '4K', 
    'fps', 'Up to 120fps', 
    'rayTracing', 'Yes', 
    'warranty', '12 months'
)),

-- Product ID: 37
('Nintendo Switch OLED Model (White)',
'nintendo-switch-oled-model-white',
'Nintendo Switch OLED với màn hình 7-inch OLED, 64GB storage',
8990000,
8490000,
40,
8,
'Nintendo',
TRUE,
'/src/assets/Product/Gaming-Gear/Console/Switch OLED/Switch_OLED_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Gaming-Gear/Console/Switch OLED/Switch_OLED_1.jpg',
    '/src/assets/Product/Gaming-Gear/Console/Switch OLED/Switch_OLED_2.jpg'
),
JSON_OBJECT(
    'screen', '7 inch OLED (1280x720)', 
    'cpu', 'NVIDIA Custom Tegra', 
    'storage', '64GB', 
    'batteryLife', '4.5 - 9 hours', 
    'modes', 'TV/Tabletop/Handheld', 
    'tvResolution', '1080p', 
    'warranty', '12 months'
)),

-- Product ID: 38
('Steam Deck OLED 1TB',
'steam-deck-oled-1tb',
'Handheld gaming PC Steam Deck OLED với màn hình HDR',
16990000,
15990000,
20,
8,
'Valve',
TRUE,
'/src/assets/Product/Gaming-Gear/Console/Steam Deck OLED/Steam_Deck_OLED_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Gaming-Gear/Console/Steam Deck OLED/Steam_Deck_OLED_1.jpg',
    '/src/assets/Product/Gaming-Gear/Console/Steam Deck OLED/Steam_Deck_OLED_2.jpg'
),
JSON_OBJECT(
    'screen', '7.4 inch HDR OLED (1280x800)', 
    'cpu', 'AMD APU Zen 2 4-core', 
    'gpu', 'AMD RDNA 2 (8 CUs)', 
    'ram', '16GB LPDDR5', 
    'storage', '1TB NVMe SSD', 
    'batteryLife', '3 - 12 hours', 
    'warranty', '12 months'
));

-- =============================================
-- PRODUCTS - KEYBOARD (categoryId = 9)
-- =============================================
INSERT INTO products (name, slug, description, price, salePrice, quantity, categoryId, brand, isFeatured, thumbnail, images, specifications) VALUES
-- Product ID: 39
('Logitech G Pro X TKL Rapid (Tactile Switch)',
'logitech-g-pro-x-tkl-rapid-tactile',
'Bàn phím cơ gaming TKL với GX Tactile switch, tốc độ phản hồi nhanh',
3990000,
3690000,
50,
9,
'Logitech',
TRUE,
'/src/assets/Product/Gaming-Gear/Keyboard/Logitech G Pro X TKL/Logitech_G_Pro_X_TKL_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Gaming-Gear/Keyboard/Logitech G Pro X TKL/Logitech_G_Pro_X_TKL_1.jpg',
    '/src/assets/Product/Gaming-Gear/Keyboard/Logitech G Pro X TKL/Logitech_G_Pro_X_TKL_2.jpg'
),
JSON_OBJECT(
    'layout', 'TKL (Tenkeyless)', 
    'switch', 'GX Tactile (Hot-swappable)', 
    'connection', 'USB-C / Wireless', 
    'rgb', 'LIGHTSYNC RGB', 
    'pollingRate', '1000Hz', 
    'keycaps', 'Double-shot PBT', 
    'warranty', '24 months'
)),

-- Product ID: 40
('Razer Huntsman V3 Pro (Analog Optical Switch)',
'razer-huntsman-v3-pro-analog-optical',
'Bàn phím gaming cao cấp với Analog Optical Switch Gen-2',
5990000,
5490000,
40,
9,
'Razer',
TRUE,
'/src/assets/Product/Gaming-Gear/Keyboard/Razer Huntsman V3 Pro/Razer_Huntsman_V3_Pro_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Gaming-Gear/Keyboard/Razer Huntsman V3 Pro/Razer_Huntsman_V3_Pro_1.jpg',
    '/src/assets/Product/Gaming-Gear/Keyboard/Razer Huntsman V3 Pro/Razer_Huntsman_V3_Pro_2.jpg'
),
JSON_OBJECT(
    'layout', 'Full-size', 
    'switch', 'Razer Analog Optical Gen-2', 
    'connection', 'USB-C', 
    'rgb', 'Razer Chroma RGB', 
    'pollingRate', '8000Hz', 
    'keycaps', 'Doubleshot PBT', 
    'analogInput', 'Yes', 
    'warranty', '24 months'
)),

-- Product ID: 41
('Corsair K70 RGB PRO (Cherry MX Speed)',
'corsair-k70-rgb-pro-cherry-mx-speed',
'Bàn phím cơ gaming full-size với Cherry MX Speed Silver',
4490000,
3990000,
45,
9,
'Corsair',
TRUE,
'/src/assets/Product/Gaming-Gear/Keyboard/Corsair K70 RGB PRO/Corsair_K70_RGB_PRO_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Gaming-Gear/Keyboard/Corsair K70 RGB PRO/Corsair_K70_RGB_PRO_1.jpg',
    '/src/assets/Product/Gaming-Gear/Keyboard/Corsair K70 RGB PRO/Corsair_K70_RGB_PRO_2.jpg'
),
JSON_OBJECT(
    'layout', 'Full-size', 
    'switch', 'Cherry MX Speed Silver', 
    'connection', 'USB-C (Detachable)', 
    'rgb', 'iCUE RGB', 
    'pollingRate', '8000Hz', 
    'keycaps', 'PBT Double-shot', 
    'wristRest', 'Included (Magnetic)', 
    'warranty', '24 months'
)),

-- Product ID: 42
('SteelSeries Apex Pro TKL Gen 3 (OmniPoint 3.0)',
'steelseries-apex-pro-tkl-gen-3-omnipoint-3',
'Bàn phím gaming TKL với OmniPoint 3.0 Adjustable Switch',
4990000,
4490000,
35,
9,
'SteelSeries',
TRUE,
'/src/assets/Product/Gaming-Gear/Keyboard/SteelSeries Apex Pro TKL Gen 3/SteelSeries_Apex_Pro_TKL_Gen3_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Gaming-Gear/Keyboard/SteelSeries Apex Pro TKL Gen 3/SteelSeries_Apex_Pro_TKL_Gen3_1.jpg',
    '/src/assets/Product/Gaming-Gear/Keyboard/SteelSeries Apex Pro TKL Gen 3/SteelSeries_Apex_Pro_TKL_Gen3_2.jpg'
),
JSON_OBJECT(
    'layout', 'TKL', 
    'switch', 'OmniPoint 3.0 Adjustable (0.1-4.0mm)', 
    'connection', 'USB-C', 
    'rgb', 'Per-key RGB', 
    'pollingRate', '8000Hz', 
    'rapidTrigger', 'Yes', 
    'oledScreen', 'Yes', 
    'warranty', '24 months'
)),

-- Product ID: 43
('Wooting 60HE+ (Hall Effect)',
'wooting-60he-plus-hall-effect',
'Bàn phím 60% với Hall Effect Analog switch, Rapid Trigger',
4790000,
4290000,
30,
9,
'Wooting',
TRUE,
'/src/assets/Product/Gaming-Gear/Keyboard/Wooting 60HE Plus/Wooting_60HE_Plus_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Gaming-Gear/Keyboard/Wooting 60HE Plus/Wooting_60HE_Plus_1.jpg',
    '/src/assets/Product/Gaming-Gear/Keyboard/Wooting 60HE Plus/Wooting_60HE_Plus_2.jpg'
),
JSON_OBJECT(
    'layout', '60%', 
    'switch', 'Gateron Lekker (Hall Effect)', 
    'connection', 'USB-C', 
    'rgb', 'Per-key RGB', 
    'pollingRate', '1000Hz', 
    'rapidTrigger', 'Yes (0.1mm)', 
    'analogInput', 'Yes', 
    'warranty', '24 months'
));

-- =============================================
-- PRODUCTS - MOUSE (categoryId = 10)
-- =============================================
INSERT INTO products (name, slug, description, price, salePrice, quantity, categoryId, brand, isFeatured, thumbnail, images, specifications) VALUES
-- Product ID: 44
('Logitech G Pro X Superlight 2 (White)',
'logitech-g-pro-x-superlight-2-white',
'Chuột gaming không dây siêu nhẹ 60g với Hero 2 Sensor 32K DPI',
3990000,
3690000,
60,
10,
'Logitech',
TRUE,
'/src/assets/Product/Gaming-Gear/Mouse/Logitech G Pro X Superlight 2/Logitech_Superlight_2_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Gaming-Gear/Mouse/Logitech G Pro X Superlight 2/Logitech_Superlight_2_1.jpg',
    '/src/assets/Product/Gaming-Gear/Mouse/Logitech G Pro X Superlight 2/Logitech_Superlight_2_2.jpg',
    '/src/assets/Product/Gaming-Gear/Mouse/Logitech G Pro X Superlight 2/Logitech_Superlight_2_3.jpg'
),
JSON_OBJECT(
    'sensor', 'HERO 2 32K', 
    'dpi', '100-32,000', 
    'weight', '60g', 
    'connection', 'LIGHTSPEED Wireless', 
    'pollingRate', '2000Hz', 
    'battery', '95 hours', 
    'buttons', '5', 
    'warranty', '24 months'
)),

-- Product ID: 45
('Razer Viper V3 Pro (Black)',
'razer-viper-v3-pro-black',
'Chuột gaming không dây 54g với Focus Pro 30K Sensor',
3790000,
3490000,
55,
10,
'Razer',
TRUE,
'/src/assets/Product/Gaming-Gear/Mouse/Razer Viper V3 Pro/Razer_Viper_V3_Pro_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Gaming-Gear/Mouse/Razer Viper V3 Pro/Razer_Viper_V3_Pro_1.jpg',
    '/src/assets/Product/Gaming-Gear/Mouse/Razer Viper V3 Pro/Razer_Viper_V3_Pro_2.jpg'
),
JSON_OBJECT(
    'sensor', 'Focus Pro 30K', 
    'dpi', '100-30,000', 
    'weight', '54g', 
    'connection', 'HyperSpeed Wireless', 
    'pollingRate', '8000Hz', 
    'battery', '95 hours', 
    'buttons', '5', 
    'warranty', '24 months'
)),

-- Product ID: 46
('Finalmouse UltralightX (Starlight Pro)',
'finalmouse-ultralightx-starlight-pro',
'Chuột gaming siêu nhẹ 37g với magnesium alloy',
6990000,
6490000,
20,
10,
'Finalmouse',
TRUE,
'/src/assets/Product/Gaming-Gear/Mouse/Finalmouse UltralightX/Finalmouse_UltralightX_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Gaming-Gear/Mouse/Finalmouse UltralightX/Finalmouse_UltralightX_1.jpg',
    '/src/assets/Product/Gaming-Gear/Mouse/Finalmouse UltralightX/Finalmouse_UltralightX_2.jpg'
),
JSON_OBJECT(
    'sensor', 'Finalsensor', 
    'dpi', '400-3200', 
    'weight', '37g', 
    'material', 'Magnesium Alloy', 
    'connection', 'Wireless', 
    'pollingRate', '8000Hz', 
    'battery', '150+ hours', 
    'warranty', '12 months'
)),

-- Product ID: 47
('Lamzu Atlantis Mini Pro (4K Wireless)',
'lamzu-atlantis-mini-pro-4k-wireless',
'Chuột gaming không dây nhỏ gọn với 4K polling rate',
2990000,
2690000,
45,
10,
'Lamzu',
TRUE,
'/src/assets/Product/Gaming-Gear/Mouse/Lamzu Atlantis Mini Pro/Lamzu_Atlantis_Mini_Pro_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Gaming-Gear/Mouse/Lamzu Atlantis Mini Pro/Lamzu_Atlantis_Mini_Pro_1.jpg',
    '/src/assets/Product/Gaming-Gear/Mouse/Lamzu Atlantis Mini Pro/Lamzu_Atlantis_Mini_Pro_2.jpg'
),
JSON_OBJECT(
    'sensor', 'PAW3395', 
    'dpi', '100-26,000', 
    'weight', '49g', 
    'connection', '4K Wireless / Wired', 
    'pollingRate', '4000Hz', 
    'battery', '70 hours', 
    'buttons', '5', 
    'warranty', '12 months'
)),

-- Product ID: 48
('SteelSeries Aerox 9 Wireless',
'steelseries-aerox-9-wireless',
'Chuột gaming MMO/MOBA với 18 nút bấm programmable',
3290000,
2990000,
40,
10,
'SteelSeries',
TRUE,
'/src/assets/Product/Gaming-Gear/Mouse/SteelSeries Aerox 9/SteelSeries_Aerox_9_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Gaming-Gear/Mouse/SteelSeries Aerox 9/SteelSeries_Aerox_9_1.jpg',
    '/src/assets/Product/Gaming-Gear/Mouse/SteelSeries Aerox 9/SteelSeries_Aerox_9_2.jpg'
),
JSON_OBJECT(
    'sensor', 'TrueMove Air', 
    'dpi', '100-18,000', 
    'weight', '89g', 
    'connection', '2.4GHz / Bluetooth / Wired', 
    'pollingRate', '1000Hz', 
    'battery', '180 hours', 
    'buttons', '18 (12 side buttons)', 
    'warranty', '24 months'
));

-- =============================================
-- PRODUCTS - HEADSET (categoryId = 11)
-- =============================================
INSERT INTO products (name, slug, description, price, salePrice, quantity, categoryId, brand, isFeatured, thumbnail, images, specifications) VALUES
-- Product ID: 49
('SteelSeries Arctis Nova Pro Wireless (Black)',
'steelseries-arctis-nova-pro-wireless-black',
'Tai nghe gaming cao cấp với Active Noise Cancellation, dual battery',
8990000,
8490000,
30,
11,
'SteelSeries',
TRUE,
'/src/assets/Product/Gaming-Gear/Headset/SteelSeries Arctis Nova Pro Wireless/SteelSeries_Nova_Pro_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Gaming-Gear/Headset/SteelSeries Arctis Nova Pro Wireless/SteelSeries_Nova_Pro_1.jpg'
),
JSON_OBJECT(
    'driver', '40mm Premium High Fidelity', 
    'frequency', '10Hz - 40kHz', 
    'connection', '2.4GHz / Bluetooth / 3.5mm', 
    'anc', 'Active Noise Cancellation', 
    'microphone', 'Retractable ClearCast Gen 2', 
    'battery', 'Dual Hot-swap (44h total)', 
    'surround', '360° Spatial Audio', 
    'warranty', '24 months'
)),

-- Product ID: 50
('Logitech G Pro X 2 Lightspeed (White)',
'logitech-g-pro-x-2-lightspeed-white',
'Tai nghe gaming không dây với Graphene Driver 50mm',
6490000,
5990000,
40,
11,
'Logitech',
TRUE,
'/src/assets/Product/Gaming-Gear/Headset/Logitech G Pro X 2/Logitech_Pro_X2_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Gaming-Gear/Headset/Logitech G Pro X 2/Logitech_Pro_X2_1.jpg',
    '/src/assets/Product/Gaming-Gear/Headset/Logitech G Pro X 2/Logitech_Pro_X2_2.jpg'
),
JSON_OBJECT(
    'driver', '50mm Pro-G Graphene', 
    'frequency', '20Hz - 20kHz', 
    'connection', 'LIGHTSPEED / Bluetooth / 3.5mm', 
    'microphone', 'Detachable Blue VO!CE', 
    'battery', '50 hours', 
    'surround', 'DTS Headphone:X 2.0', 
    'weight', '345g', 
    'warranty', '24 months'
)),

-- Product ID: 51
('Razer BlackShark V2 Pro (2023)',
'razer-blackshark-v2-pro-2023',
'Tai nghe gaming esports với THX Spatial Audio',
4990000,
4490000,
45,
11,
'Razer',
TRUE,
'/src/assets/Product/Gaming-Gear/Headset/Razer BlackShark V2 Pro/Razer_BlackShark_V2_Pro_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Gaming-Gear/Headset/Razer BlackShark V2 Pro/Razer_BlackShark_V2_Pro_1.jpg',
    '/src/assets/Product/Gaming-Gear/Headset/Razer BlackShark V2 Pro/Razer_BlackShark_V2_Pro_2.jpg'
),
JSON_OBJECT(
    'driver', '50mm TriForce Titanium', 
    'frequency', '12Hz - 28kHz', 
    'connection', 'HyperSpeed Wireless / 3.5mm', 
    'microphone', 'Detachable HyperClear Super Wideband', 
    'battery', '70 hours', 
    'surround', 'THX Spatial Audio', 
    'weight', '320g', 
    'warranty', '24 months'
)),

-- Product ID: 52
('HyperX Cloud Alpha Wireless',
'hyperx-cloud-alpha-wireless',
'Tai nghe gaming với thời lượng pin khủng 300 giờ',
4290000,
3990000,
50,
11,
'HyperX',
TRUE,
'/src/assets/Product/Gaming-Gear/Headset/HyperX Cloud Alpha Wireless/HyperX_Cloud_Alpha_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Gaming-Gear/Headset/HyperX Cloud Alpha Wireless/HyperX_Cloud_Alpha_1.jpg',
    '/src/assets/Product/Gaming-Gear/Headset/HyperX Cloud Alpha Wireless/HyperX_Cloud_Alpha_2.jpg'
),
JSON_OBJECT(
    'driver', '50mm Dual Chamber', 
    'frequency', '15Hz - 21kHz', 
    'connection', '2.4GHz Wireless', 
    'microphone', 'Detachable Noise-cancelling', 
    'battery', '300 hours', 
    'surround', 'DTS Headphone:X', 
    'weight', '335g', 
    'warranty', '24 months'
)),

-- Product ID: 53
('Audeze Maxwell Wireless (PC/PS)',
'audeze-maxwell-wireless-pc-ps',
'Tai nghe gaming audiophile với Planar Magnetic Driver 90mm',
9990000,
9490000,
20,
11,
'Audeze',
TRUE,
'/src/assets/Product/Gaming-Gear/Headset/Audeze Maxwell/Audeze_Maxwell_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Gaming-Gear/Headset/Audeze Maxwell/Audeze_Maxwell_1.jpg',
    '/src/assets/Product/Gaming-Gear/Headset/Audeze Maxwell/Audeze_Maxwell_2.jpg'
),
JSON_OBJECT(
    'driver', '90mm Planar Magnetic', 
    'frequency', '10Hz - 50kHz', 
    'connection', '2.4GHz / Bluetooth / 3.5mm / USB-C', 
    'microphone', 'Detachable Broadcast-grade', 
    'battery', '80+ hours', 
    'dolbyAtmos', 'Yes', 
    'weight', '490g', 
    'warranty', '24 months'
));

-- ...existing code...

-- =============================================
-- PRODUCTS - GAMING MONITOR (categoryId = 20)
-- =============================================
INSERT INTO products (name, slug, description, price, salePrice, quantity, categoryId, brand, isFeatured, thumbnail, images, specifications) VALUES
-- Product ID: 54
('ASUS ROG Swift PG32UCDM 32" 4K OLED 240Hz',
'asus-rog-swift-pg32ucdm-32-4k-oled-240hz',
'Màn hình gaming OLED 32 inch 4K 240Hz với công nghệ Anti-Glare',
34990000,
32990000,
20,
20,
'ASUS',
TRUE,
'/src/assets/Product/Monitor/Gaming-Monitor/ASUS ROG Swift PG32UCDM/ASUS_ROG_PG32UCDM_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Gaming-Monitor/ASUS ROG Swift PG32UCDM/ASUS_ROG_PG32UCDM_1.jpg',
    '/src/assets/Product/Monitor/Gaming-Monitor/ASUS ROG Swift PG32UCDM/ASUS_ROG_PG32UCDM_2.jpg'
),
JSON_OBJECT(
    'screenSize', '32 inch',
    'resolution', '3840x2160 (4K UHD)',
    'panelType', 'QD-OLED',
    'refreshRate', '240Hz',
    'responseTime', '0.03ms GTG',
    'hdr', 'DisplayHDR True Black 400',
    'colorGamut', '99% DCI-P3',
    'connectivity', 'HDMI 2.1 x2, DP 1.4, USB-C 90W',
    'gsync', 'NVIDIA G-SYNC Compatible',
    'warranty', '36 months'
)),

-- Product ID: 55
('Samsung Odyssey G9 G95SC 49" OLED 240Hz',
'samsung-odyssey-g9-g95sc-49-oled-240hz',
'Màn hình gaming cong siêu rộng 49 inch OLED Dual QHD 240Hz',
45990000,
42990000,
15,
20,
'Samsung',
TRUE,
'/src/assets/Product/Monitor/Gaming-Monitor/Samsung Odyssey G9 OLED/Samsung_G9_OLED_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Gaming-Monitor/Samsung Odyssey G9 OLED/Samsung_G9_OLED_1.jpg',
    '/src/assets/Product/Monitor/Gaming-Monitor/Samsung Odyssey G9 OLED/Samsung_G9_OLED_2.jpg'
),
JSON_OBJECT(
    'screenSize', '49 inch',
    'resolution', '5120x1440 (Dual QHD)',
    'panelType', 'QD-OLED',
    'curvature', '1800R',
    'refreshRate', '240Hz',
    'responseTime', '0.03ms GTG',
    'hdr', 'DisplayHDR True Black 400',
    'colorGamut', '99% DCI-P3',
    'connectivity', 'HDMI 2.1 x2, DP 1.4, USB-C',
    'freesync', 'AMD FreeSync Premium Pro',
    'warranty', '36 months'
)),

-- Product ID: 56
('LG UltraGear 27GR95QE 27" OLED 240Hz',
'lg-ultragear-27gr95qe-27-oled-240hz',
'Màn hình gaming OLED 27 inch QHD 240Hz với Anti-Glare Low Reflection',
19990000,
18490000,
30,
20,
'LG',
TRUE,
'/src/assets/Product/Monitor/Gaming-Monitor/LG UltraGear 27GR95QE/LG_27GR95QE_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Gaming-Monitor/LG UltraGear 27GR95QE/LG_27GR95QE_1.jpg',
    '/src/assets/Product/Monitor/Gaming-Monitor/LG UltraGear 27GR95QE/LG_27GR95QE_2.jpg'
),
JSON_OBJECT(
    'screenSize', '27 inch',
    'resolution', '2560x1440 (QHD)',
    'panelType', 'OLED',
    'refreshRate', '240Hz',
    'responseTime', '0.03ms GTG',
    'hdr', 'DisplayHDR True Black 400',
    'colorGamut', '98.5% DCI-P3',
    'connectivity', 'HDMI 2.1 x2, DP 1.4, USB 3.0',
    'gsync', 'NVIDIA G-SYNC Compatible',
    'warranty', '24 months'
)),

-- Product ID: 57
('Alienware AW2725DF 27" QD-OLED 360Hz',
'alienware-aw2725df-27-qd-oled-360hz',
'Màn hình gaming QD-OLED 27 inch QHD 360Hz cao cấp nhất',
24990000,
23490000,
25,
20,
'Alienware',
TRUE,
'/src/assets/Product/Monitor/Gaming-Monitor/Alienware AW2725DF/Alienware_AW2725DF_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Gaming-Monitor/Alienware AW2725DF/Alienware_AW2725DF_1.jpg',
    '/src/assets/Product/Monitor/Gaming-Monitor/Alienware AW2725DF/Alienware_AW2725DF_2.jpg'
),
JSON_OBJECT(
    'screenSize', '27 inch',
    'resolution', '2560x1440 (QHD)',
    'panelType', 'QD-OLED',
    'refreshRate', '360Hz',
    'responseTime', '0.03ms GTG',
    'hdr', 'DisplayHDR True Black 400',
    'colorGamut', '99% DCI-P3',
    'connectivity', 'HDMI 2.1 x2, DP 1.4, USB-C 90W',
    'gsync', 'NVIDIA G-SYNC',
    'warranty', '36 months'
)),

-- Product ID: 58
('ASUS VG279QM1A 27" IPS 280Hz',
'asus-vg279qm1a-27-ips-280hz',
'Màn hình gaming IPS 27 inch Full HD 280Hz giá tốt',
7990000,
7490000,
45,
20,
'ASUS',
FALSE,
'/src/assets/Product/Monitor/Gaming-Monitor/ASUS VG279QM1A/ASUS_VG279QM1A_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Gaming-Monitor/ASUS VG279QM1A/ASUS_VG279QM1A_1.jpg',
    '/src/assets/Product/Monitor/Gaming-Monitor/ASUS VG279QM1A/ASUS_VG279QM1A_2.jpg'
),
JSON_OBJECT(
    'screenSize', '27 inch',
    'resolution', '1920x1080 (Full HD)',
    'panelType', 'IPS',
    'refreshRate', '280Hz',
    'responseTime', '1ms GTG',
    'hdr', 'HDR10',
    'colorGamut', '99% sRGB',
    'connectivity', 'HDMI 2.0 x2, DP 1.2',
    'gsync', 'G-SYNC Compatible / FreeSync Premium',
    'warranty', '36 months'
));

-- =============================================
-- PRODUCTS - PROFESSIONAL MONITOR (categoryId = 21)
-- =============================================
INSERT INTO products (name, slug, description, price, salePrice, quantity, categoryId, brand, isFeatured, thumbnail, images, specifications) VALUES
-- Product ID: 59
('ASUS ProArt PA32UCR-K 32" 4K HDR IPS',
'asus-proart-pa32ucr-k-32-4k-hdr-ips',
'Màn hình đồ họa chuyên nghiệp 32 inch 4K với độ chính xác màu Delta E < 1',
32990000,
30990000,
20,
21,
'ASUS',
TRUE,
'/src/assets/Product/Monitor/Professional-Monitor/ASUS ProArt PA32UCR-K/ASUS_PA32UCR_K_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Professional-Monitor/ASUS ProArt PA32UCR-K/ASUS_PA32UCR_K_1.jpg',
    '/src/assets/Product/Monitor/Professional-Monitor/ASUS ProArt PA32UCR-K/ASUS_PA32UCR_K_2.jpg'
),
JSON_OBJECT(
    'screenSize', '32 inch',
    'resolution', '3840x2160 (4K UHD)',
    'panelType', 'IPS',
    'refreshRate', '60Hz',
    'colorAccuracy', 'Delta E < 1',
    'colorGamut', '100% sRGB, 99% Adobe RGB, 98% DCI-P3',
    'hdr', 'DisplayHDR 1000',
    'brightness', '1000 nits peak',
    'connectivity', 'HDMI 2.0 x3, DP 1.4, USB-C 96W, Thunderbolt 3',
    'calibration', 'Hardware Calibration, Calman Ready',
    'warranty', '36 months'
)),

-- Product ID: 60
('BenQ SW321C PhotoVue 32" 4K IPS',
'benq-sw321c-photovue-32-4k-ips',
'Màn hình chỉnh sửa ảnh chuyên nghiệp 32 inch 4K với Paper Color Sync',
42990000,
39990000,
15,
21,
'BenQ',
TRUE,
'/src/assets/Product/Monitor/Professional-Monitor/BenQ SW321C/BenQ_SW321C_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Professional-Monitor/BenQ SW321C/BenQ_SW321C_1.jpg',
    '/src/assets/Product/Monitor/Professional-Monitor/BenQ SW321C/BenQ_SW321C_2.jpg'
),
JSON_OBJECT(
    'screenSize', '32 inch',
    'resolution', '3840x2160 (4K UHD)',
    'panelType', 'IPS',
    'refreshRate', '60Hz',
    'colorAccuracy', 'Delta E < 2',
    'colorGamut', '100% sRGB, 99% Adobe RGB, 95% DCI-P3',
    'hdr', 'HDR10 / HLG',
    'brightness', '250 nits',
    'connectivity', 'HDMI 2.0 x2, DP 1.4, USB-C 60W',
    'features', 'Paper Color Sync, GamutDuo, Hotkey Puck G2',
    'warranty', '36 months'
)),

-- Product ID: 61
('Dell UltraSharp U3223QE 32" 4K IPS Black',
'dell-ultrasharp-u3223qe-32-4k-ips-black',
'Màn hình đồ họa Dell UltraSharp 32 inch 4K với IPS Black Technology',
24990000,
22990000,
25,
21,
'Dell',
TRUE,
'/src/assets/Product/Monitor/Professional-Monitor/Dell U3223QE/Dell_U3223QE_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Professional-Monitor/Dell U3223QE/Dell_U3223QE_1.jpg',
    '/src/assets/Product/Monitor/Professional-Monitor/Dell U3223QE/Dell_U3223QE_2.jpg'
),
JSON_OBJECT(
    'screenSize', '31.5 inch',
    'resolution', '3840x2160 (4K UHD)',
    'panelType', 'IPS Black',
    'refreshRate', '60Hz',
    'colorAccuracy', 'Delta E < 2',
    'colorGamut', '100% sRGB, 98% DCI-P3',
    'hdr', 'DisplayHDR 400',
    'brightness', '400 nits',
    'contrastRatio', '2000:1',
    'connectivity', 'HDMI 2.0, DP 1.4, USB-C 90W, RJ45, USB Hub',
    'warranty', '36 months'
)),

-- Product ID: 62
('LG UltraFine 32UQ850V-W 32" 4K Nano IPS',
'lg-ultrafine-32uq850v-w-32-4k-nano-ips',
'Màn hình đồ họa LG UltraFine 32 inch 4K với Nano IPS và Ergo Stand',
16990000,
15490000,
30,
21,
'LG',
TRUE,
'/src/assets/Product/Monitor/Professional-Monitor/LG UltraFine 32UQ850V/LG_32UQ850V_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Professional-Monitor/LG UltraFine 32UQ850V/LG_32UQ850V_1.jpg',
    '/src/assets/Product/Monitor/Professional-Monitor/LG UltraFine 32UQ850V/LG_32UQ850V_2.jpg'
),
JSON_OBJECT(
    'screenSize', '31.5 inch',
    'resolution', '3840x2160 (4K UHD)',
    'panelType', 'Nano IPS',
    'refreshRate', '60Hz',
    'colorAccuracy', 'Delta E < 2',
    'colorGamut', '98% DCI-P3',
    'hdr', 'DisplayHDR 400',
    'brightness', '400 nits',
    'connectivity', 'HDMI 2.0 x2, DP 1.4, USB-C 90W',
    'stand', 'Ergo Stand (Height/Tilt/Swivel/Pivot)',
    'warranty', '36 months'
)),

-- Product ID: 63
('EIZO ColorEdge CG2700S 27" WQHD IPS',
'eizo-coloredge-cg2700s-27-wqhd-ips',
'Màn hình chuyên nghiệp EIZO ColorEdge 27 inch WQHD cho color grading',
52990000,
49990000,
10,
21,
'EIZO',
TRUE,
'/src/assets/Product/Monitor/Professional-Monitor/EIZO CG2700S/EIZO_CG2700S_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Professional-Monitor/EIZO CG2700S/EIZO_CG2700S_1.jpg',
    '/src/assets/Product/Monitor/Professional-Monitor/EIZO CG2700S/EIZO_CG2700S_2.jpg'
),
JSON_OBJECT(
    'screenSize', '27 inch',
    'resolution', '2560x1440 (WQHD)',
    'panelType', 'IPS',
    'refreshRate', '60Hz',
    'colorAccuracy', 'Delta E < 0.5',
    'colorGamut', '100% sRGB, 99% Adobe RGB, 98% DCI-P3',
    'hdr', 'HLG / PQ',
    'brightness', '500 nits',
    'bitDepth', '10-bit (True)',
    'connectivity', 'HDMI 2.0 x2, DP 1.4, USB-C 94W',
    'calibration', 'Built-in Calibration Sensor',
    'warranty', '60 months'
));

-- =============================================
-- PRODUCTS - OFFICE MONITOR (categoryId = 22)
-- =============================================
INSERT INTO products (name, slug, description, price, salePrice, quantity, categoryId, brand, isFeatured, thumbnail, images, specifications) VALUES
-- Product ID: 64
('Dell P2723QE 27" 4K USB-C Hub Monitor',
'dell-p2723qe-27-4k-usb-c-hub-monitor',
'Màn hình văn phòng Dell 27 inch 4K với USB-C Hub tích hợp',
11990000,
10990000,
40,
22,
'Dell',
TRUE,
'/src/assets/Product/Monitor/Office-Monitor/Dell P2723QE/Dell_P2723QE_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Office-Monitor/Dell P2723QE/Dell_P2723QE_1.jpg',
    '/src/assets/Product/Monitor/Office-Monitor/Dell P2723QE/Dell_P2723QE_2.jpg'
),
JSON_OBJECT(
    'screenSize', '27 inch',
    'resolution', '3840x2160 (4K UHD)',
    'panelType', 'IPS',
    'refreshRate', '60Hz',
    'responseTime', '5ms',
    'colorGamut', '99% sRGB',
    'brightness', '350 nits',
    'connectivity', 'HDMI 1.4, DP 1.4, USB-C 90W, RJ45, USB 3.2 Hub',
    'features', 'ComfortView Plus (Low Blue Light)',
    'warranty', '36 months'
)),

-- Product ID: 65
('LG 27UP850N-W 27" 4K IPS USB-C',
'lg-27up850n-w-27-4k-ips-usb-c',
'Màn hình văn phòng LG 27 inch 4K với DCI-P3 95% và USB-C 96W',
9990000,
8990000,
50,
22,
'LG',
TRUE,
'/src/assets/Product/Monitor/Office-Monitor/LG 27UP850N/LG_27UP850N_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Office-Monitor/LG 27UP850N/LG_27UP850N_1.jpg',
    '/src/assets/Product/Monitor/Office-Monitor/LG 27UP850N/LG_27UP850N_2.jpg'
),
JSON_OBJECT(
    'screenSize', '27 inch',
    'resolution', '3840x2160 (4K UHD)',
    'panelType', 'IPS',
    'refreshRate', '60Hz',
    'responseTime', '5ms',
    'colorGamut', '95% DCI-P3',
    'hdr', 'DisplayHDR 400',
    'brightness', '400 nits',
    'connectivity', 'HDMI 2.0 x2, DP 1.4, USB-C 96W',
    'features', 'AMD FreeSync',
    'warranty', '24 months'
)),

-- Product ID: 66
('Samsung S27C900PAU ViewFinity S9 27" 5K IPS',
'samsung-s27c900pau-viewfinity-s9-27-5k-ips',
'Màn hình văn phòng cao cấp Samsung 27 inch 5K với Matte Display',
29990000,
27990000,
20,
22,
'Samsung',
TRUE,
'/src/assets/Product/Monitor/Office-Monitor/Samsung ViewFinity S9/Samsung_S9_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Office-Monitor/Samsung ViewFinity S9/Samsung_S9_1.jpg',
    '/src/assets/Product/Monitor/Office-Monitor/Samsung ViewFinity S9/Samsung_S9_2.jpg'
),
JSON_OBJECT(
    'screenSize', '27 inch',
    'resolution', '5120x2880 (5K)',
    'panelType', 'IPS (Matte)',
    'refreshRate', '60Hz',
    'colorAccuracy', 'Delta E < 2',
    'colorGamut', '99% DCI-P3',
    'hdr', 'DisplayHDR 600',
    'brightness', '600 nits',
    'connectivity', 'Thunderbolt 4 x2, Mini DP, USB-C, USB Hub',
    'features', 'Built-in 4K SlimFit Camera, Smart TV Apps',
    'warranty', '36 months'
)),

-- Product ID: 67
('ASUS ProArt PA278QV 27" WQHD IPS',
'asus-proart-pa278qv-27-wqhd-ips',
'Màn hình văn phòng ASUS ProArt 27 inch WQHD với factory calibration',
7990000,
7490000,
55,
22,
'ASUS',
TRUE,
'/src/assets/Product/Monitor/Office-Monitor/ASUS PA278QV/ASUS_PA278QV_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Office-Monitor/ASUS PA278QV/ASUS_PA278QV_1.jpg',
    '/src/assets/Product/Monitor/Office-Monitor/ASUS PA278QV/ASUS_PA278QV_2.jpg'
),
JSON_OBJECT(
    'screenSize', '27 inch',
    'resolution', '2560x1440 (WQHD)',
    'panelType', 'IPS',
    'refreshRate', '75Hz',
    'responseTime', '5ms',
    'colorAccuracy', 'Delta E < 2',
    'colorGamut', '100% sRGB, 100% Rec.709',
    'brightness', '350 nits',
    'connectivity', 'HDMI 1.4, DP 1.2, Mini DP, USB Hub',
    'features', 'Factory Calibrated, ProArt Palette',
    'warranty', '36 months'
)),

-- Product ID: 68
('BenQ GW2785TC 27" Full HD IPS USB-C',
'benq-gw2785tc-27-full-hd-ips-usb-c',
'Màn hình văn phòng BenQ 27 inch Full HD với Eye-Care và USB-C',
5990000,
5490000,
70,
22,
'BenQ',
FALSE,
'/src/assets/Product/Monitor/Office-Monitor/BenQ GW2785TC/BenQ_GW2785TC_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Office-Monitor/BenQ GW2785TC/BenQ_GW2785TC_1.jpg',
    '/src/assets/Product/Monitor/Office-Monitor/BenQ GW2785TC/BenQ_GW2785TC_2.jpg'
),
JSON_OBJECT(
    'screenSize', '27 inch',
    'resolution', '1920x1080 (Full HD)',
    'panelType', 'IPS',
    'refreshRate', '75Hz',
    'responseTime', '5ms',
    'colorGamut', '99% sRGB',
    'brightness', '250 nits',
    'connectivity', 'HDMI 1.4, DP 1.2, USB-C 60W, Daisy Chain',
    'features', 'Eye-Care Tech, B.I.+ (Brightness Intelligence Plus)',
    'warranty', '36 months'
));

-- =============================================
-- PRODUCTS - PORTABLE MONITOR (categoryId = 23)
-- =============================================
INSERT INTO products (name, slug, description, price, salePrice, quantity, categoryId, brand, isFeatured, thumbnail, images, specifications) VALUES
-- Product ID: 69
('ASUS ZenScreen OLED MQ16AH 15.6" Full HD OLED',
'asus-zenscreen-oled-mq16ah-15-6-full-hd-oled',
'Màn hình di động ASUS ZenScreen OLED 15.6 inch với chất lượng màu xuất sắc',
12990000,
11990000,
30,
23,
'ASUS',
TRUE,
'/src/assets/Product/Monitor/Portable-Monitor/ASUS ZenScreen MQ16AH/ASUS_MQ16AH_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Portable-Monitor/ASUS ZenScreen MQ16AH/ASUS_MQ16AH_1.jpg',
    '/src/assets/Product/Monitor/Portable-Monitor/ASUS ZenScreen MQ16AH/ASUS_MQ16AH_2.jpg'
),
JSON_OBJECT(
    'screenSize', '15.6 inch',
    'resolution', '1920x1080 (Full HD)',
    'panelType', 'OLED',
    'refreshRate', '60Hz',
    'responseTime', '1ms',
    'colorGamut', '100% DCI-P3',
    'hdr', 'DisplayHDR True Black 500',
    'brightness', '360 nits (peak 550 nits)',
    'weight', '590g',
    'connectivity', 'USB-C x2, Mini HDMI',
    'features', 'Tripod Socket, Smart Cover, Built-in Speaker',
    'warranty', '36 months'
)),

-- Product ID: 70
('LG Gram +view 16MR70 16" WQXGA IPS',
'lg-gram-view-16mr70-16-wqxga-ips',
'Màn hình di động LG Gram +view 16 inch WQXGA siêu mỏng nhẹ',
9990000,
8990000,
35,
23,
'LG',
TRUE,
'/src/assets/Product/Monitor/Portable-Monitor/LG Gram 16MR70/LG_16MR70_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Portable-Monitor/LG Gram 16MR70/LG_16MR70_1.jpg',
    '/src/assets/Product/Monitor/Portable-Monitor/LG Gram 16MR70/LG_16MR70_2.jpg'
),
JSON_OBJECT(
    'screenSize', '16 inch',
    'resolution', '2560x1600 (WQXGA)',
    'panelType', 'IPS',
    'refreshRate', '60Hz',
    'colorGamut', '99% DCI-P3',
    'brightness', '350 nits',
    'weight', '670g',
    'thickness', '8mm',
    'connectivity', 'USB-C x2',
    'features', 'Auto Rotate, Folio Cover, USB-C Power Delivery',
    'warranty', '24 months'
)),

-- Product ID: 71
('ViewSonic VP16-OLED 15.6" 4K OLED',
'viewsonic-vp16-oled-15-6-4k-oled',
'Màn hình di động ViewSonic VP16-OLED 15.6 inch 4K cho đồ họa',
14990000,
13990000,
25,
23,
'ViewSonic',
TRUE,
'/src/assets/Product/Monitor/Portable-Monitor/ViewSonic VP16-OLED/ViewSonic_VP16_OLED_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Portable-Monitor/ViewSonic VP16-OLED/ViewSonic_VP16_OLED_1.jpg',
    '/src/assets/Product/Monitor/Portable-Monitor/ViewSonic VP16-OLED/ViewSonic_VP16_OLED_2.jpg'
),
JSON_OBJECT(
    'screenSize', '15.6 inch',
    'resolution', '3840x2160 (4K UHD)',
    'panelType', 'OLED',
    'refreshRate', '60Hz',
    'responseTime', '1ms',
    'colorAccuracy', 'Delta E < 2',
    'colorGamut', '100% DCI-P3, 100% Adobe RGB',
    'hdr', 'DisplayHDR True Black 400',
    'brightness', '400 nits',
    'weight', '760g',
    'connectivity', 'USB-C x2, Mini HDMI',
    'warranty', '36 months'
)),

-- Product ID: 72
('INNOCN 15K1F 15.6" OLED 144Hz',
'innocn-15k1f-15-6-oled-144hz',
'Màn hình di động gaming INNOCN 15.6 inch OLED 144Hz',
8990000,
7990000,
40,
23,
'INNOCN',
TRUE,
'/src/assets/Product/Monitor/Portable-Monitor/INNOCN 15K1F/INNOCN_15K1F_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Portable-Monitor/INNOCN 15K1F/INNOCN_15K1F_1.jpg',
    '/src/assets/Product/Monitor/Portable-Monitor/INNOCN 15K1F/INNOCN_15K1F_2.jpg'
),
JSON_OBJECT(
    'screenSize', '15.6 inch',
    'resolution', '1920x1080 (Full HD)',
    'panelType', 'OLED',
    'refreshRate', '144Hz',
    'responseTime', '1ms',
    'colorGamut', '100% DCI-P3',
    'hdr', 'DisplayHDR True Black 400',
    'brightness', '400 nits',
    'weight', '620g',
    'connectivity', 'USB-C x2, Mini HDMI',
    'features', 'AMD FreeSync, Built-in Battery (4h)',
    'warranty', '24 months'
)),

-- Product ID: 73
('ASUS ZenScreen MB16ACV 15.6" Full HD IPS',
'asus-zenscreen-mb16acv-15-6-full-hd-ips',
'Màn hình di động ASUS ZenScreen 15.6 inch Full HD giá tốt',
5990000,
5490000,
60,
23,
'ASUS',
FALSE,
'/src/assets/Product/Monitor/Portable-Monitor/ASUS ZenScreen MB16ACV/ASUS_MB16ACV_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Portable-Monitor/ASUS ZenScreen MB16ACV/ASUS_MB16ACV_1.jpg',
    '/src/assets/Product/Monitor/Portable-Monitor/ASUS ZenScreen MB16ACV/ASUS_MB16ACV_2.jpg'
),
JSON_OBJECT(
    'screenSize', '15.6 inch',
    'resolution', '1920x1080 (Full HD)',
    'panelType', 'IPS',
    'refreshRate', '60Hz',
    'responseTime', '5ms',
    'colorGamut', '100% sRGB',
    'brightness', '250 nits',
    'weight', '780g',
    'connectivity', 'USB-C x1, Hybrid Signal',
    'features', 'Foldable Smart Case, Auto Rotate, Flicker-Free',
    'warranty', '36 months'
));

-- =============================================
-- PRODUCTS - PC OFFICE (categoryId = 7)
-- =============================================
INSERT INTO products (name, slug, description, price, salePrice, quantity, categoryId, brand, isFeatured, thumbnail, images, specifications) VALUES
-- Product ID: 74
('PC Office Intel Core i5-13400 - 16GB RAM - 512GB SSD',
'pc-office-intel-core-i5-13400-16gb-ram-512gb-ssd',
'PC văn phòng hiệu năng cao với Intel Core i5 thế hệ 13',
12990000,
11990000,
50,
7,
'Intel',
TRUE,
'/src/assets/Product/PC/PC-Office/PC Office i5-13400/PC_Office_i5_13400_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/PC/PC-Office/PC Office i5-13400/PC_Office_i5_13400_1.jpg',
    '/src/assets/Product/PC/PC-Office/PC Office i5-13400/PC_Office_i5_13400_2.jpg'
),
JSON_OBJECT(
    'cpu', 'Intel Core i5-13400 (10 cores, 16 threads, Up to 4.6GHz)',
    'mainboard', 'ASUS PRIME H610M-E DDR4',
    'ram', 'Kingston Fury Beast 16GB (2x8GB) DDR4 3200MHz',
    'ssd', 'Kingston NV2 512GB M.2 NVMe PCIe 4.0',
    'psu', 'FSP HV PRO 450W 80 Plus',
    'case', 'Deepcool MATREXX 40 3FS',
    'cooling', 'Intel Stock Cooler',
    'os', 'Windows 11 Pro (Activated)',
    'warranty', '24 months'
)),

-- Product ID: 75
('PC Office AMD Ryzen 5 5600G - 16GB RAM - 512GB SSD',
'pc-office-amd-ryzen-5-5600g-16gb-ram-512gb-ssd',
'PC văn phòng AMD với đồ họa tích hợp Radeon Vega',
10990000,
9990000,
60,
7,
'AMD',
TRUE,
'/src/assets/Product/PC/PC-Office/PC Office Ryzen 5 5600G/PC_Office_R5_5600G_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/PC/PC-Office/PC Office Ryzen 5 5600G/PC_Office_R5_5600G_1.jpg',
    '/src/assets/Product/PC/PC-Office/PC Office Ryzen 5 5600G/PC_Office_R5_5600G_2.jpg'
),
JSON_OBJECT(
    'cpu', 'AMD Ryzen 5 5600G (6 cores, 12 threads, Up to 4.4GHz)',
    'gpu', 'AMD Radeon Graphics (Integrated)',
    'mainboard', 'Gigabyte A520M DS3H',
    'ram', 'TEAMGROUP T-Force Vulcan Z 16GB (2x8GB) DDR4 3200MHz',
    'ssd', 'HIKSEMI WAVE 512GB M.2 NVMe',
    'psu', 'FSP HV PRO 450W 80 Plus',
    'case', 'Xigmatek NYX 3F',
    'cooling', 'AMD Wraith Stealth Cooler',
    'os', 'Windows 11 Home (Activated)',
    'warranty', '24 months'
)),

-- Product ID: 76
('PC Office Intel Core i3-13100 - 8GB RAM - 256GB SSD',
'pc-office-intel-core-i3-13100-8gb-ram-256gb-ssd',
'PC văn phòng cơ bản cho công việc hàng ngày',
7990000,
7490000,
80,
7,
'Intel',
FALSE,
'/src/assets/Product/PC/PC-Office/PC Office i3-13100/PC_Office_i3_13100_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/PC/PC-Office/PC Office i3-13100/PC_Office_i3_13100_1.jpg',
    '/src/assets/Product/PC/PC-Office/PC Office i3-13100/PC_Office_i3_13100_2.jpg'
),
JSON_OBJECT(
    'cpu', 'Intel Core i3-13100 (4 cores, 8 threads, Up to 4.5GHz)',
    'gpu', 'Intel UHD Graphics 730 (Integrated)',
    'mainboard', 'Gigabyte H610M H DDR4',
    'ram', 'Kingston ValueRAM 8GB DDR4 3200MHz',
    'ssd', 'Kingston NV2 256GB M.2 NVMe',
    'psu', 'FSP HV PRO 350W',
    'case', 'Thermaltake Versa H15',
    'cooling', 'Intel Stock Cooler',
    'warranty', '24 months'
)),

-- Product ID: 77
('PC Office Intel Core i7-13700 - 32GB RAM - 1TB SSD',
'pc-office-intel-core-i7-13700-32gb-ram-1tb-ssd',
'PC văn phòng cao cấp cho đa nhiệm chuyên nghiệp',
19990000,
18490000,
35,
7,
'Intel',
TRUE,
'/src/assets/Product/PC/PC-Office/PC Office i7-13700/PC_Office_i7_13700_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/PC/PC-Office/PC Office i7-13700/PC_Office_i7_13700_1.jpg',
    '/src/assets/Product/PC/PC-Office/PC Office i7-13700/PC_Office_i7_13700_2.jpg'
),
JSON_OBJECT(
    'cpu', 'Intel Core i7-13700 (16 cores, 24 threads, Up to 5.2GHz)',
    'mainboard', 'ASUS PRIME B660M-A WIFI D4',
    'ram', 'G.SKILL Ripjaws V 32GB (2x16GB) DDR4 3200MHz',
    'ssd', 'Samsung 980 PRO 1TB M.2 NVMe',
    'psu', 'Corsair CV550 550W 80 Plus Bronze',
    'case', 'NZXT H510',
    'cooling', 'ID-COOLING SE-214-XT',
    'os', 'Windows 11 Pro (Activated)',
    'warranty', '36 months'
)),

-- Product ID: 78
('PC Office AMD Athlon 3000G - 8GB RAM - 256GB SSD',
'pc-office-amd-athlon-3000g-8gb-ram-256gb-ssd',
'PC văn phòng tiết kiệm cho công việc văn phòng cơ bản',
5490000,
4990000,
100,
7,
'AMD',
FALSE,
'/src/assets/Product/PC/PC-Office/PC Office Athlon 3000G/PC_Office_Athlon_3000G_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/PC/PC-Office/PC Office Athlon 3000G/PC_Office_Athlon_3000G_1.jpg',
    '/src/assets/Product/PC/PC-Office/PC Office Athlon 3000G/PC_Office_Athlon_3000G_2.jpg'
),
JSON_OBJECT(
    'cpu', 'AMD Athlon 3000G (2 cores, 4 threads, 3.5GHz)',
    'gpu', 'AMD Radeon Vega 3 (Integrated)',
    'mainboard', 'Gigabyte A320M-S2H',
    'ram', 'Kingston ValueRAM 8GB DDR4 2666MHz',
    'ssd', 'HIKSEMI WAVE 256GB M.2 NVMe',
    'psu', 'FSP HV PRO 350W',
    'case', 'Thermaltake S100 TG',
    'cooling', 'AMD Wraith Stealth Cooler',
    'warranty', '24 months'
));

-- =============================================
-- THÊM VOUCHERS MẪU
-- =============================================
INSERT INTO vouchers (code, description, discountType, discountValue, minOrderAmount, maxDiscountAmount, usageLimit, startDate, endDate, isActive) VALUES
('WELCOME10', 'Giảm 10% cho đơn hàng đầu tiên', 'percentage', 10, 500000, 500000, 1000, '2024-01-01 00:00:00', '2025-12-31 23:59:59', TRUE),
('GAMING50K', 'Giảm 50.000đ cho Gaming Gear', 'fixed', 50000, 1000000, NULL, 500, '2024-01-01 00:00:00', '2025-12-31 23:59:59', TRUE),
('HARDWARE100K', 'Giảm 100.000đ cho linh kiện Hardware', 'fixed', 100000, 3000000, NULL, 300, '2024-01-01 00:00:00', '2025-12-31 23:59:59', TRUE),
('MONITOR15', 'Giảm 15% cho Monitor', 'percentage', 15, 5000000, 2000000, 200, '2024-01-01 00:00:00', '2025-12-31 23:59:59', TRUE),
('BLACKFRIDAY', 'Black Friday Sale - Giảm 20%', 'percentage', 20, 2000000, 3000000, 1000, '2024-11-25 00:00:00', '2024-11-30 23:59:59', TRUE),
('FREESHIP', 'Miễn phí vận chuyển cho đơn từ 500K', 'fixed', 30000, 500000, NULL, 2000, '2024-01-01 00:00:00', '2025-12-31 23:59:59', TRUE);

-- =============================================
-- KẾT THÚC SCHEMA
-- =============================================