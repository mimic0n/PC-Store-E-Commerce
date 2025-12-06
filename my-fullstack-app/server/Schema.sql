-- =============================================
-- HKTSTORE DATABASE SCHEMA
-- =============================================

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
    avatar VARCHAR(255) DEFAULT 'default-avatar.png',
    role ENUM('user', 'admin') DEFAULT 'user',
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_isActive (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE users 
ADD COLUMN dateOfBirth DATE NULL AFTER address,
ADD COLUMN gender ENUM('male', 'female', 'other') NULL AFTER dateOfBirth,
ADD COLUMN isEmailVerified BOOLEAN DEFAULT FALSE AFTER isActive,
ADD COLUMN isPhoneVerified BOOLEAN DEFAULT FALSE AFTER isEmailVerified,
ADD COLUMN lastLoginAt TIMESTAMP NULL AFTER isPhoneVerified;

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
    note TEXT NULL,
    totalAmount DECIMAL(12, 2) NOT NULL,
    shippingFee DECIMAL(12, 2) DEFAULT 0,
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

ALTER TABLE orders
ADD COLUMN province VARCHAR(100) NULL AFTER address,
ADD COLUMN district VARCHAR(100) NULL AFTER province,
ADD COLUMN ward VARCHAR(100) NULL AFTER district,
ADD COLUMN shippingMethod ENUM('standard', 'express', 'same_day') DEFAULT 'standard' AFTER shippingFee,
ADD COLUMN estimatedDelivery DATE NULL AFTER shippingMethod,
ADD COLUMN trackingNumber VARCHAR(100) NULL AFTER estimatedDelivery; 
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

--  Tạo trigger để tự động cập nhật rating và numReviews
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
            SELECT ROUND(AVG(rating), 1) 
            FROM reviews 
            WHERE productId = NEW.productId AND isApproved = TRUE
        )
    WHERE id = NEW.productId;
END$$
DELIMITER ;

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

-- Thêm Admin mặc định (password: admin123)
INSERT INTO users (fullName, email, password, role) VALUES
('Admin HKTStore', 'admin@hktstore.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('Austrian Artist', 'artist1933@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('Albert Einstein', 'einstein@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('Elon Musk', 'elon@spacex.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('Soltuné Montepré', 'soltune@chateau.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('Vanga', 'vanga@prophecy.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('Gia Cát Lượng', 'kongming@shu.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user');

-- Thêm danh mục cha
INSERT INTO categories (name, slug, description, isActive) VALUES
('PC', 'pc', 'Máy tính để bàn các loại', TRUE),
('Gaming Gear', 'gaming-gear', 'Thiết bị chơi game', TRUE),
('Hardware', 'hardware', 'Linh kiện máy tính', TRUE),
('Monitor', 'monitor', 'Màn hình máy tính', TRUE);

-- Thêm danh mục con cho PC
INSERT INTO categories (name, slug, description, parentId, isActive) VALUES
('PC Gaming', 'pc-gaming', 'PC chơi game cao cấp', 1, TRUE),
('PC Workstation', 'pc-workstation', 'PC làm việc chuyên nghiệp', 1, TRUE),
('PC Office', 'pc-office', 'PC văn phòng', 1, TRUE);

-- Thêm danh mục con cho Gaming Gear
INSERT INTO categories (name, slug, description, parentId, isActive) VALUES
('Console', 'console', 'Máy chơi game Console', 2, TRUE),
('Keyboard', 'keyboard', 'Bàn phím Gaming', 2, TRUE),
('Mouse', 'mouse', 'Chuột Gaming', 2, TRUE),
('Headset', 'headset', 'Tai nghe Gaming', 2, TRUE);

-- Thêm danh mục con cho Hardware
INSERT INTO categories (name, slug, description, parentId, isActive) VALUES
('CPU', 'cpu', 'Bộ vi xử lý', 3, TRUE),
('Mainboard', 'mainboard', 'Bo mạch chủ', 3, TRUE),
('RAM', 'ram', 'Bộ nhớ RAM', 3, TRUE),
('VGA', 'vga', 'Card màn hình', 3, TRUE),
('SSD/HDD', 'ssd-hdd', 'Ổ cứng SSD và HDD', 3, TRUE),
('Tản Nhiệt', 'cooling', 'Tản nhiệt CPU/VGA', 3, TRUE),
('Case', 'case', 'Vỏ Case máy tính', 3, TRUE),
('PSU', 'psu', 'Nguồn máy tính', 3, TRUE);

INSERT INTO categories (name, slug, description, parentId, isActive) VALUES
('Gaming Monitor', 'gaming-monitor', 'Màn hình Gaming', 4, TRUE),
('Professional Monitor', 'professional-monitor', 'Màn hình chuyên nghiệp cho đồ họa', 4, TRUE),
('Office Monitor', 'office-monitor', 'Màn hình văn phòng', 4, TRUE),
('Portable Monitor', 'portable-monitor', 'Màn hình di động', 4, TRUE);

-- Thêm sản phẩm PC Gaming Luxury
INSERT INTO products (name, slug, description, price, salePrice, quantity, categoryId, brand, isFeatured, thumbnail, images, specifications) VALUES
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
));

-- Thêm các sản phẩm Gaming khác
INSERT INTO products (name, slug, description, price, salePrice, quantity, categoryId, brand, isFeatured, thumbnail, images, specifications) VALUES
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
)),

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
NULL),

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

-- VGA
INSERT INTO products (name, slug, description, price, salePrice, quantity, categoryId, brand, isFeatured, thumbnail, images, specifications) VALUES
('CARD MÀN HÌNH COLORFUL GEFORCE RTX 4060 NB DUO 8GB-V', 
'card-man-hinh-colorful-geforce-rtx-4060-nb-duo-8gb-v',
'Card màn hình NVIDIA GeForce RTX 4060 8GB GDDR6 hiệu năng cao',
8399000,
NULL,
45,
16,
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

('VGA ASUS ROG STRIX RTX 4090 OC 24GB GDDR6X',
'vga-asus-rog-strix-rtx-4090-oc-24gb',
'Card màn hình ASUS ROG STRIX RTX 4090 OC Edition mạnh mẽ nhất',
54990000,
52990000,
15,
16,
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

('VGA MSI GeForce RTX 4080 SUPER GAMING X TRIO 16GB',
'vga-msi-rtx-4080-super-gaming-x-trio-16gb',
'Card màn hình MSI RTX 4080 SUPER GAMING X TRIO hiệu năng cao',
32990000,
30990000,
25,
16,
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

('VGA Gigabyte AORUS RTX 4070 Ti SUPER MASTER 16GB',
'vga-gigabyte-aorus-rtx-4070-ti-super-master-16gb',
'Card màn hình Gigabyte AORUS RTX 4070 Ti SUPER với tản nhiệt Windforce',
22990000,
21490000,
35,
16,
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

('VGA Sapphire Pulse AMD Radeon RX 7900 XTX 24GB',
'vga-sapphire-pulse-rx-7900-xtx-24gb',
'Card màn hình AMD Radeon RX 7900 XTX với 24GB VRAM',
26990000,
24990000,
30,
16,
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
)),

-- MAINBOARD PRODUCTS
('Mainboard ASUS ROG STRIX X870E-H GAMING WIFI 7 Hatsune Miku Edition', 
'mainboard-asus-rog-strix-x870e-h-gaming-wifi-7-hatsune-miku-edition',
'Bo mạch chủ ASUS ROG STRIX X870E-H phiên bản Hatsune Miku cao cấp với WiFi 7',
14890000,
16990000,
20,
14,
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

('Mainboard ASUS ROG MAXIMUS Z790 HERO (LGA1700, DDR5, WiFi 7)',
'mainboard-asus-rog-maximus-z790-hero',
'Bo mạch chủ ASUS ROG MAXIMUS Z790 HERO cao cấp cho Intel Gen 14',
15990000,
14990000,
25,
14,
'ASUS',TRUE,
'/src/assets/Product/Hardware/Mainboard/ASUS ROG Z790 HERO/ASUS_ROG_Z790_HERO_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/Mainboard/ASUS ROG Z790 HERO/ASUS_ROG_Z790_HERO_1.jpg'),
JSON_OBJECT('socket', 'LGA1700', 
            'chipset', 'Intel Z790', 
            'formFactor', 'ATX', 
            'ramSlots', '4 x DDR5 (Max 192GB)', 
            'ramSpeed', 'Up to DDR5-7800+', 
            'pciSlots', '1x PCIe 5.0 x16 , 1x PCIe 4.0 x16', 
            'm2Slots', '5x M.2', 
            'wifi', 'WiFi 7', 
            'warranty', '36 months'
)),

('Mainboard MSI MAG B650 TOMAHAWK WIFI (AM5, DDR5, WiFi 6E)',
'mainboard-msi-mag-b650-tomahawk-wifi',
'Bo mạch chủ MSI MAG B650 TOMAHAWK WIFI cho AMD Ryzen 7000',
6990000,
6490000,
45,
14,
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

('Mainboard GIGABYTE B760M AORUS ELITE AX (LGA1700, DDR5, WiFi 6)',
'mainboard-gigabyte-b760m-aorus-elite-ax',
'Bo mạch chủ GIGABYTE B760M AORUS ELITE AX Micro-ATX',
4990000,
4490000,
55,
14,
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
)),

-- CPUs
('CPU Intel Core Ultra 9 285K (Up to 5.7GHz, 24 Cores - 24 Threads, 36MB Cache, Arrow Lake-S)', 
'cpu-intel-core-ultra-9-285k-up-to-5-7ghz-24-nhan-24-luong-36mb-cache-arrow-lake-s',
'Bộ vi xử lý Intel Core Ultra 9 thế hệ mới với kiến trúc Arrow Lake-S',
16190000,
17699000,
50,
13,
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

('CPU AMD Ryzen 9 7950X3D (16 Core 32 Thread, Up to 5.7GHz, 144MB Cache)', 
'cpu-amd-ryzen-9-7950x3d',
'CPU AMD Ryzen 9 7950X3D với công nghệ 3D V-Cache mạnh mẽ cho gaming và workstation',
15990000,
14990000,
35,
13,
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

('CPU Intel Core i9-14900K (24 Core 32 Thread, Up to 6.0GHz, 36MB Cache)',
'cpu-intel-core-i9-14900k',
'CPU Intel Core i9-14900K thế hệ 14 hiệu năng đỉnh cao',
13990000,
12990000,
40,
13,
'Intel',
TRUE,
'/src/assets/Product/Hardware/CPU/Intel i9-14900K/Intel_i9_14900K_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/CPU/Intel i9-14900K/Intel_i9_14900K_1.jpg'),
JSON_OBJECT(
    'model', 'i9-14900K', 
    'cores', '24 (8P+16E)', 
    'threads', '32', 
    'socket', 'LGA1700', 
    'baseClock', '3.2 GHz', 
    'boostClock', '6.0 GHz', 
    'cache', '36MB', 
    'tdp', '125W', 
    'warranty', '36 months'
)),

('CPU AMD Ryzen 7 7800X3D (8 Core 16 Thread, Up to 5.0GHz, 104MB Cache)',
'cpu-amd-ryzen-7-7800x3d',
'CPU AMD Ryzen 7 7800X3D - Best gaming CPU với 3D V-Cache',
10990000,
9990000,
60,
13,
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
    'cache', '104MB', 
    'tdp', '120W', 
    'warranty', '36 months'
)),

('CPU Intel Core i5-14600KF (14 Core 20 Thread, Up to 5.3GHz, 24MB Cache)',
'cpu-intel-core-i5-14600kf',
'CPU Intel Core i5-14600KF tầm trung hiệu năng cao cho gaming',
6990000,
6490000,
70,
13,
'Intel',
FALSE,
'/src/assets/Product/Hardware/CPU/Intel i5-14600KF/Intel_i5_14600KF_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/CPU/Intel i5-14600KF/Intel_i5_14600KF_1.jpg'),
JSON_OBJECT(
    'model', 'i5-14600KF', 
    'cores', '14 (6P+8E)', 
    'threads', '20', 
    'socket', 'LGA1700', 
    'baseClock', '3.5 GHz', 
    'boostClock', '5.3 GHz', 
    'cache', '24MB', 
    'tdp', '125W', 
    'warranty', '36 months'
)),

-- RAMs
('RAM TEAMGROUP T-Force Vulcan Z 16GB (1x16GB) DDR4 3200MHz', 
'ram-teamgroup-t-force-vulcan-z-16gb-1x16gb-ddr4-3200mhz',
'Bộ nhớ RAM TEAMGROUP T-Force Vulcan Z 16GB DDR4 3200MHz hiệu năng tốt',
2490000,
NULL,
100,
15,
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
    'capacity', '16GB',
    'type', 'DDR4',
    'speed', '3200MHz',
    'timing', 'CL16-18-18-38',
    'voltage', '1.35V',
    'heatsink', 'Yes',
    'warranty', '36 months'
)),

('RAM G.SKILL Trident Z5 RGB 32GB (2x16GB) DDR5 6000MHz CL30',
'ram-gskill-trident-z5-rgb-32gb-ddr5-6000',
'RAM G.SKILL Trident Z5 RGB DDR5 6000MHz với hiệu ứng đèn RGB đẹp mắt',
4990000,
4490000,
80,
15,
'G.SKILL',
TRUE,
'/src/assets/Product/Hardware/RAM/GSKILL Trident Z5/GSKILL_Trident_Z5_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/RAM/GSKILL Trident Z5/GSKILL_Trident_Z5_1.jpg'),
JSON_OBJECT(
    'capacity', '32GB (2x16GB)', 
    'type', 'DDR5', 
    'speed', '6000MHz', 
    'timing', 'CL30-40-40-96', 
    'voltage', '1.35V', 
    'rgb', 'Yes', 
    'heatsink', 'Yes', 
    'warranty', 'Lifetime'
)),

('RAM Corsair Vengeance RGB 32GB (2x16GB) DDR5 5600MHz',
'ram-corsair-vengeance-rgb-32gb-ddr5-5600',
'RAM Corsair Vengeance RGB DDR5 5600MHz với RGB Lighting',
3990000,
3690000,
90,
15,
'Corsair',
TRUE,
'/src/assets/Product/Hardware/RAM/Corsair Vengeance RGB/Corsair_Vengeance_RGB_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/RAM/Corsair Vengeance RGB/Corsair_Vengeance_RGB_1.jpg'),
JSON_OBJECT(
    'capacity', '32GB (2x16GB)', 
    'type', 'DDR5', 
    'speed', '5600MHz', 
    'timing', 'CL36-36-36-76', 
    'voltage', '1.25V', 
    'rgb', 'Yes', 
    'heatsink', 'Yes', 
    'warranty', 'Lifetime'
)),

('RAM Kingston Fury Beast 16GB (2x8GB) DDR4 3200MHz',
'ram-kingston-fury-beast-16gb-ddr4-3200',
'RAM Kingston Fury Beast DDR4 3200MHz giá tốt cho PC Gaming',
1690000,
1590000,
120,
15,
'Kingston',
FALSE,
'/src/assets/Product/Hardware/RAM/Kingston Fury Beast/Kingston_Fury_Beast_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/RAM/Kingston Fury Beast/Kingston_Fury_Beast_1.jpg'),
JSON_OBJECT(
    'capacity', '16GB (2x8GB)', 
    'type', 'DDR4', 
    'speed', '3200MHz', 
    'timing', 'CL16-18-18-36', 
    'voltage', '1.35V', 
    'rgb', 'No', 
    'heatsink', 'Yes', 
    'warranty', 'Lifetime'
)),

-- SSD PRODUCTS
('SSD Samsung 990 PRO 2TB M.2 NVMe PCIe Gen4 x4',
'ssd-samsung-990-pro-2tb-m2-nvme',
'Ổ cứng SSD Samsung 990 PRO 2TB tốc độ đọc/ghi cực nhanh',
5990000,
5490000,
60,
17,
'Samsung',
TRUE,
'/src/assets/Product/Hardware/SSD/Samsung 990 PRO/Samsung_990_PRO_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/SSD/Samsung 990 PRO/Samsung_990_PRO_1.jpg'),
JSON_OBJECT('capacity', '2TB', 'interface', 'M.2 NVMe PCIe Gen4 x4', 'formFactor', 'M.2 2280', 'readSpeed', '7450 MB/s', 'writeSpeed', '6900 MB/s', 'tbw', '1200 TBW', 'warranty', '60 months')),

('SSD WD Black SN850X 1TB M.2 NVMe PCIe Gen4',
'ssd-wd-black-sn850x-1tb-m2-nvme',
'Ổ cứng SSD WD Black SN850X 1TB dành cho gaming',
3490000,
3190000,
75,
17,
'Western Digital',
TRUE,
'/src/assets/Product/Hardware/SSD/WD Black SN850X/WD_Black_SN850X_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/SSD/WD Black SN850X/WD_Black_SN850X_1.jpg'),
JSON_OBJECT('capacity', '1TB', 'interface', 'M.2 NVMe PCIe Gen4 x4', 'formFactor', 'M.2 2280', 'readSpeed', '7300 MB/s', 'writeSpeed', '6300 MB/s', 'tbw', '600 TBW', 'warranty', '60 months')),

('SSD Kingston NV2 500GB M.2 NVMe PCIe 4.0',
'ssd-kingston-nv2-500gb-m2-nvme',
'Ổ cứng SSD Kingston NV2 500GB giá rẻ cho PC Office',
1290000,
1190000,
100,
17,
'Kingston',
FALSE,
'/src/assets/Product/Hardware/SSD/Kingston NV2/Kingston_NV2_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/SSD/Kingston NV2/Kingston_NV2_1.jpg'),
JSON_OBJECT('capacity', '500GB', 'interface', 'M.2 NVMe PCIe 4.0 x4', 'formFactor', 'M.2 2280', 'readSpeed', '3500 MB/s', 'writeSpeed', '2100 MB/s', 'tbw', '160 TBW', 'warranty', '36 months')),

-- PSU PRODUCTS
('PSU Corsair RM1000x SHIFT 1000W 80 Plus Gold Full Modular',
'psu-corsair-rm1000x-shift-1000w-80-plus-gold',
'Nguồn Corsair RM1000x SHIFT 1000W 80 Plus Gold với thiết kế connector ở bên',
5990000,
5590000,
40,
20,
'Corsair',
TRUE,
'/src/assets/Product/Hardware/PSU/Corsair RM1000x SHIFT/Corsair_RM1000x_SHIFT_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/PSU/Corsair RM1000x SHIFT/Corsair_RM1000x_SHIFT_1.jpg'),
JSON_OBJECT('wattage', '1000W', 'efficiency', '80 Plus Gold', 'modular', 'Full Modular', 'pcieCable', '5x 8-pin', 'fanSize', '135mm', 'warranty', '120 months')),
('PSU ASUS ROG THOR 1200W Platinum II 80 Plus Platinum',
'psu-asus-rog-thor-1200w-platinum-ii',
'Nguồn ASUS ROG THOR 1200W Platinum II với màn hình OLED',
9990000,
9490000,
20,
20,
'ASUS',
TRUE,
'/src/assets/Product/Hardware/PSU/ASUS ROG THOR 1200W/ASUS_ROG_THOR_1200W_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/PSU/ASUS ROG THOR 1200W/ASUS_ROG_THOR_1200W_1.jpg'),
JSON_OBJECT('wattage', '1200W', 'efficiency', '80 Plus Platinum', 'modular', 'Full Modular', 'oledDisplay', 'Yes', 'pcieCable', '6x 8-pin', 'fanSize', '135mm', 'warranty', '120 months')),

('PSU MSI MAG A850GL 850W 80 Plus Gold Full Modular',
'psu-msi-mag-a850gl-850w-80-plus-gold',
'Nguồn MSI MAG A850GL 850W 80 Plus Gold PCIe 5.0 Ready',
3490000,
3290000,
55,
20,
'MSI',
FALSE,
'/src/assets/Product/Hardware/PSU/MSI MAG A850GL/MSI_MAG_A850GL_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/PSU/MSI MAG A850GL/MSI_MAG_A850GL_1.jpg'),
JSON_OBJECT('wattage', '850W', 'efficiency', '80 Plus Gold', 'modular', 'Full Modular', 'pcie50', 'Yes', 'pcieCable', '4x 8-pin', 'fanSize', '135mm', 'warranty', '120 months')),

-- COOLING PRODUCTS
('Tản nhiệt nước NZXT Kraken Elite 360 RGB (360mm AIO)',
'cooling-nzxt-kraken-elite-360-rgb',
'Tản nhiệt nước NZXT Kraken Elite 360 với màn hình LCD 2.36 inch',
7990000,
7490000,
35,
18,
'NZXT',
TRUE,
'/src/assets/Product/Hardware/Cooling/NZXT Kraken Elite 360/NZXT_Kraken_Elite_360_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/Cooling/NZXT Kraken Elite 360/NZXT_Kraken_Elite_360_1.jpg'),
JSON_OBJECT('type', 'AIO Liquid Cooling', 'radiatorSize', '360mm', 'fanSize', '3x 120mm RGB', 'lcdScreen', '2.36 inch', 'socket', 'Intel LGA1700/1200/1151, AMD AM5/AM4', 'warranty', '72 months')),

('Tản nhiệt khí Noctua NH-D15 chromax.black',
'cooling-noctua-nh-d15-chromax-black',
'Tản nhiệt khí Noctua NH-D15 chromax.black hiệu năng đỉnh cao',
3290000,
2990000,
50,
18,
'Noctua',
TRUE,
'/src/assets/Product/Hardware/Cooling/Noctua NH-D15/Noctua_NH_D15_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/Cooling/Noctua NH-D15/Noctua_NH_D15_1.jpg'),
JSON_OBJECT('type', 'Air Cooling', 'heatpipes', '6x 6mm', 'fanSize', '2x 140mm', 'height', '165mm', 'socket', 'Intel LGA1700/1200/1151, AMD AM5/AM4', 'warranty', '72 months')),

('Tản nhiệt nước Corsair iCUE H150i Elite LCD XT (360mm)',
'cooling-corsair-icue-h150i-elite-lcd-xt',
'Tản nhiệt nước Corsair iCUE H150i Elite LCD XT với màn hình IPS',
6490000,
5990000,
40,
18,
'Corsair',
TRUE,
'/src/assets/Product/Hardware/Cooling/Corsair H150i Elite LCD/Corsair_H150i_Elite_LCD_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/Cooling/Corsair H150i Elite LCD/Corsair_H150i_Elite_LCD_1.jpg'),
JSON_OBJECT('type', 'AIO Liquid Cooling', 'radiatorSize', '360mm', 'fanSize', '3x 120mm RGB', 'lcdScreen', 'IPS 2.1 inch', 'socket', 'Intel LGA1700/1200/1151, AMD AM5/AM4', 'warranty', '60 months')),

-- CASE PRODUCTS
('Case Lian Li O11 Dynamic EVO (ATX, Mid Tower, Tempered Glass)',
'case-lian-li-o11-dynamic-evo-atx',
'Vỏ case Lian Li O11 Dynamic EVO với thiết kế kính cường lực 3 mặt',
4990000,
4690000,
45,
19,
'Lian Li',
TRUE,
'/src/assets/Product/Hardware/Case/Lian Li O11 Dynamic EVO/Lian_Li_O11_Dynamic_EVO_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/Case/Lian Li O11 Dynamic EVO/Lian_Li_O11_Dynamic_EVO_1.jpg'),
JSON_OBJECT('formFactor', 'Mid Tower ATX', 'material', 'Aluminum + Tempered Glass', 'fanSupport', 'Up to 13x 120mm', 'radiatorSupport', 'Top/Side/Bottom 360mm', 'maxGpuLength', '420mm', 'maxCpuCoolerHeight', '167mm', 'warranty', '24 months')),

('Case NZXT H9 Flow (ATX, Mid Tower, Mesh Front)',
'case-nzxt-h9-flow-atx',
'Vỏ case NZXT H9 Flow với mặt trước mesh thông thoáng',
3990000,
3690000,
50,
19,
'NZXT',
TRUE,
'/src/assets/Product/Hardware/Case/NZXT H9 Flow/NZXT_H9_Flow_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/Case/NZXT H9 Flow/NZXT_H9_Flow_1.jpg'),
JSON_OBJECT('formFactor', 'Mid Tower ATX', 'material', 'Steel + Tempered Glass', 'fanSupport', 'Up to 10x 120mm', 'radiatorSupport', 'Top/Front 360mm', 'maxGpuLength', '400mm', 'maxCpuCoolerHeight', '185mm', 'warranty', '24 months')),

('Case Fractal Design Torrent (E-ATX, Mid Tower, High Airflow)',
'case-fractal-design-torrent-eatx',
'Vỏ case Fractal Design Torrent với luồng khí mạnh mẽ',
5490000,
4990000,
35,
19,
'Fractal Design',
TRUE,
'/src/assets/Product/Hardware/Case/Fractal Torrent/Fractal_Torrent_1.jpg',
JSON_ARRAY('/src/assets/Product/Hardware/Case/Fractal Torrent/Fractal_Torrent_1.jpg'),
JSON_OBJECT('formFactor', 'Mid Tower E-ATX', 'material', 'Steel + Tempered Glass', 'includedFans', '2x 180mm RGB', 'fanSupport', 'Front 2x180mm or 3x140mm', 'radiatorSupport', 'Top/Bottom 360mm', 'maxGpuLength', '461mm', 'maxCpuCoolerHeight', '188mm', 'warranty', '24 months'));

-- Thêm sản phẩm Gaming Gear
-- CONSOLE PRODUCTS
INSERT INTO products (name, slug, description, price, salePrice, quantity, categoryId, brand, isFeatured, thumbnail, images, specifications) VALUES
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
    'cpu', 'AMD Zen 2 8-core',
    'gpu', 'AMD RDNA 3-based graphics engine',
    'memory', '16GB GDDR6',
    'storage', '2TB NVMe SSD',
    'resolution', 'Up to 8K',
    'frameRate', 'Up to 120fps',
    'connectivity', 'Wi-Fi 7, Bluetooth 5.3',
    'warranty', '12 months'
)),

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
    'cpu', 'AMD Zen 2 8-core @ 3.8GHz',
    'gpu', '12 TFLOPS AMD RDNA 2',
    'memory', '16GB GDDR6',
    'storage', '1TB NVMe SSD',
    'resolution', 'Up to 4K',
    'frameRate', 'Up to 120fps',
    'connectivity', 'Wi-Fi 6, Bluetooth 5.1',
    'warranty', '12 months'
)),

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
    'screen', '7-inch OLED 1280x720',
    'storage', '64GB',
    'battery', 'Up to 9 hours',
    'connectivity', 'Wi-Fi, Bluetooth 4.1',
    'modes', 'TV, Tabletop, Handheld',
    'warranty', '12 months'
)),

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
    'screen', '7.4-inch HDR OLED 1280x800 90Hz',
    'cpu', 'AMD APU (Zen 2 + RDNA 2)',
    'memory', '16GB LPDDR5',
    'storage', '1TB NVMe SSD',
    'battery', 'Up to 12 hours',
    'warranty', '12 months'
)),

-- KEYBOARD GAMING PRODUCTS
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
    'layout', 'TKL (Tenkeyless) - 87 keys',
    'switch', 'Logitech GX Tactile',
    'actuation', '1.9mm',
    'keycaps', 'PBT Double-shot',
    'rgb', 'Per-key RGB Lightsync',
    'polling', '1000Hz',
    'connectivity', 'USB-C Wired',
    'warranty', '24 months'
)),

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
    'layout', 'Full-size 104 keys',
    'switch', 'Razer Analog Optical Switch Gen-2',
    'actuation', 'Adjustable 1.5mm - 3.6mm',
    'keycaps', 'PBT Doubleshot',
    'rgb', 'Per-key Razer Chroma RGB',
    'polling', '8000Hz',
    'connectivity', 'USB-C Wired + Wireless 2.4GHz',
    'warranty', '24 months'
)),

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
    'layout', 'Full-size 104 keys',
    'switch', 'Cherry MX Speed Silver',
    'actuation', '1.2mm',
    'keycaps', 'PBT Double-shot',
    'rgb', 'Per-key RGB',
    'polling', '1000Hz',
    'connectivity', 'USB-C Wired',
    'palmRest', 'Magnetic leatherette',
    'warranty', '24 months'
)),

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
    'layout', 'TKL - 87 keys',
    'switch', 'OmniPoint 3.0 Adjustable Magnetic',
    'actuation', 'Adjustable 0.2mm - 3.8mm',
    'keycaps', 'PBT pudding',
    'rgb', 'Per-key PrismSync RGB',
    'polling', '1000Hz',
    'connectivity', 'USB-C Wired + Bluetooth',
    'oledDisplay', 'Yes',
    'warranty', '24 months'
)),

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
    'layout', '60% - 66 keys',
    'switch', 'Lekker L45 Hall Effect',
    'actuation', 'Adjustable 0.1mm - 4.0mm',
    'keycaps', 'PBT Double-shot',
    'rgb', 'Per-key RGB',
    'polling', '1000Hz',
    'rapidTrigger', 'Yes',
    'connectivity', 'USB-C Wired',
    'warranty', '24 months'
)),

-- MOUSE GAMING PRODUCTS
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
    'sensor', 'Hero 2 32K DPI',
    'dpi', 'Up to 32,000',
    'ips', '500+',
    'weight', '60g',
    'battery', 'Up to 95 hours',
    'polling', '1000Hz (2000Hz with dongle)',
    'connectivity', 'Lightspeed Wireless',
    'switches', 'Hybrid optical-mechanical',
    'warranty', '24 months'
)),

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
    'dpi', 'Up to 30,000',
    'ips', '750',
    'weight', '54g',
    'battery', 'Up to 90 hours',
    'polling', '4000Hz with HyperPolling Wireless Dongle',
    'connectivity', 'HyperSpeed Wireless',
    'switches', 'Gen-3 Optical Mouse Switches',
    'warranty', '24 months'
)),

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
    'sensor', 'PixArt PAW3395',
    'dpi', 'Up to 26,000',
    'weight', '37g',
    'material', 'Magnesium Alloy',
    'battery', 'Up to 160 hours',
    'polling', '1000Hz',
    'connectivity', 'Wireless 2.4GHz',
    'warranty', '12 months'
)),

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
    'sensor', 'PixArt PAW3395',
    'dpi', 'Up to 26,000',
    'weight', '55g',
    'battery', 'Up to 80 hours',
    'polling', '4000Hz',
    'connectivity', 'Wireless 2.4GHz',
    'switches', 'Huano Blue Shell Pink Dot',
    'warranty', '12 months'
)),

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
    'dpi', 'Up to 18,000',
    'weight', '89g',
    'buttons', '18 programmable buttons',
    'battery', 'Up to 180 hours',
    'polling', '1000Hz',
    'connectivity', 'Quantum 2.0 Wireless',
    'warranty', '24 months'
)),

-- HEADSET GAMING PRODUCTS
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
    '/src/assets/Product/Gaming-Gear/Headset/SteelSeries Arctis Nova Pro Wireless/SteelSeries_Nova_Pro_1.jpg',
    '/src/assets/Product/Gaming-Gear/Headset/SteelSeries Arctis Nova Pro Wireless/SteelSeries_Nova_Pro_1.jpg'
),
JSON_OBJECT(
    'driver', '40mm High-Fidelity Drivers',
    'frequency', '10-40,000 Hz',
    'impedance', '38 Ohm',
    'microphone', 'ClearCast Gen 2 - Fully Retractable Boom',
    'anc', 'Active Noise Cancellation',
    'battery', 'Dual battery system - Hot-swappable',
    'connectivity', '2.4GHz Wireless + Bluetooth 5.0',
    'audio', '360° Spatial Audio',
    'warranty', '24 months'
)),

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
    'driver', '50mm Graphene Drivers',
    'frequency', '20-20,000 Hz',
    'microphone', 'Blue VO!CE - Detachable 6mm',
    'battery', 'Up to 50 hours',
    'connectivity', 'Lightspeed Wireless + Bluetooth',
    'audio', 'DTS Headphone:X 2.0',
    'earcups', 'Memory foam with passive noise isolation',
    'weight', '345g',
    'warranty', '24 months'
)),

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
    'driver', 'Razer™ TriForce Titanium 50mm',
    'frequency', '12-28,000 Hz',
    'microphone', 'Razer™ HyperClear Super Wideband - Detachable',
    'battery', 'Up to 70 hours',
    'connectivity', 'HyperSpeed Wireless + Bluetooth 5.2',
    'audio', 'THX Spatial Audio',
    'weight', '320g',
    'warranty', '24 months'
)),

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
    'driver', 'Custom 50mm Dual Chamber',
    'frequency', '15-21,000 Hz',
    'microphone', 'Detachable noise-cancelling',
    'battery', 'Up to 300 hours',
    'connectivity', '2.4GHz Wireless',
    'audio', 'DTS Headphone:X',
    'weight', '318g',
    'warranty', '24 months'
)),

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
    'frequency', '10-50,000 Hz',
    'impedance', '80 Ohm',
    'microphone', 'AI-powered detachable boom',
    'battery', 'Up to 80 hours',
    'connectivity', '2.4GHz Wireless + Bluetooth 5.3',
    'audio', 'Dolby Atmos',
    'weight', '490g',
    'warranty', '24 months'
));

-- GAMING MONITOR PRODUCTS
INSERT INTO products (name, slug, description, price, salePrice, quantity, categoryId, brand, isFeatured, thumbnail, images, specifications) VALUES
-- OLED Gaming Monitors (Cao cấp nhất)
('ASUS ROG Swift OLED PG27AQDM 27" QHD 240Hz',
'asus-rog-swift-oled-pg27aqdm-27-qhd-240hz',
'Màn hình gaming OLED 27 inch QHD 240Hz với HDR True Black 400',
25990000,
24490000,
20,
21,
'ASUS',
TRUE,
'/src/assets/Product/Monitor/Gaming/ASUS ROG Swift OLED PG27AQDM/ASUS_PG27AQDM_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Gaming/ASUS ROG Swift OLED PG27AQDM/ASUS_PG27AQDM_1.jpg',
    '/src/assets/Product/Monitor/Gaming/ASUS ROG Swift OLED PG27AQDM/ASUS_PG27AQDM_2.jpg',
    '/src/assets/Product/Monitor/Gaming/ASUS ROG Swift OLED PG27AQDM/ASUS_PG27AQDM_3.jpg',
    '/src/assets/Product/Monitor/Gaming/ASUS ROG Swift OLED PG27AQDM/ASUS_PG27AQDM_4.jpg'
),
JSON_OBJECT(
    'screenSize', '27 inch',
    'resolution', '2560 x 1440 (QHD)',
    'panelType', 'OLED',
    'refreshRate', '240Hz',
    'responseTime', '0.03ms (GTG)',
    'brightness', '1000 nits (Peak)',
    'contrastRatio', '1,500,000:1',
    'hdr', 'DisplayHDR True Black 400',
    'colorGamut', '99% DCI-P3',
    'ports', '2x HDMI 2.0, 1x DisplayPort 1.4, 2x USB 3.2',
    'features', 'G-SYNC Compatible, Custom Heatsink, Uniform Brightness',
    'weight', '5.4 kg',
    'warranty', '36 months'
)),

('LG UltraGear OLED 27GR95QE-B 27" QHD 240Hz',
'lg-ultragear-oled-27gr95qe-b-27-qhd-240hz',
'Màn hình gaming OLED 27 inch với Anti-Glare coating',
23990000,
22490000,
25,
21,
'LG',
TRUE,
'/src/assets/Product/Monitor/Gaming/LG UltraGear 27GR95QE/LG_27GR95QE_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Gaming/LG UltraGear 27GR95QE/LG_27GR95QE_1.jpg',
    '/src/assets/Product/Monitor/Gaming/LG UltraGear 27GR95QE/LG_27GR95QE_2.jpg'
),
JSON_OBJECT(
    'screenSize', '27 inch',
    'resolution', '2560 x 1440 (QHD)',
    'panelType', 'OLED',
    'refreshRate', '240Hz',
    'responseTime', '0.03ms (GTG)',
    'brightness', '1000 nits (Peak HDR)',
    'contrastRatio', '1,500,000:1',
    'hdr', 'DisplayHDR True Black 400',
    'colorGamut', '98.5% DCI-P3',
    'ports', '2x HDMI 2.1, 1x DisplayPort 1.4, 4x USB 3.0',
    'features', 'G-SYNC Compatible, FreeSync Premium, Anti-Glare Coating',
    'weight', '6.1 kg',
    'warranty', '24 months'
)),

('Samsung Odyssey OLED G9 G95SC 49" Dual QHD 240Hz',
'samsung-odyssey-oled-g9-g95sc-49-dual-qhd-240hz',
'Màn hình cong siêu rộng 49 inch OLED 1800R',
46990000,
44990000,
15,
21,
'Samsung',
TRUE,
'/src/assets/Product/Monitor/Gaming/Samsung Odyssey OLED G9/Samsung_Odyssey_G9_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Gaming/Samsung Odyssey OLED G9/Samsung_Odyssey_G9_1.jpg',
    '/src/assets/Product/Monitor/Gaming/Samsung Odyssey OLED G9/Samsung_Odyssey_G9_2.jpg'
),
JSON_OBJECT(
    'screenSize', '49 inch',
    'resolution', '5120 x 1440 (Dual QHD)',
    'panelType', 'OLED',
    'curvature', '1800R',
    'refreshRate', '240Hz',
    'responseTime', '0.03ms (GTG)',
    'brightness', '1000 nits (Peak)',
    'contrastRatio', '1,000,000:1',
    'hdr', 'HDR10+',
    'colorGamut', '99.3% DCI-P3',
    'ports', '1x HDMI 2.1, 2x DisplayPort 1.4, 3x USB 3.0',
    'features', 'G-SYNC Compatible, FreeSync Premium Pro, Quantum HDR OLED',
    'weight', '11.5 kg',
    'warranty', '36 months'
)),

-- Mini-LED Gaming Monitors
('ASUS ROG Swift PG32UCDM 32" 4K 240Hz Mini-LED',
'asus-rog-swift-pg32ucdm-32-4k-240hz-mini-led',
'Màn hình gaming 4K 32 inch với 1152 zones Mini-LED',
35990000,
33990000,
18,
21,
'ASUS',
TRUE,
'/src/assets/Product/Monitor/Gaming/ASUS ROG Swift PG32UCDM/ASUS_PG32UCDM_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Gaming/ASUS ROG Swift PG32UCDM/ASUS_PG32UCDM_1.jpg',
    '/src/assets/Product/Monitor/Gaming/ASUS ROG Swift PG32UCDM/ASUS_PG32UCDM_2.jpg'
),
JSON_OBJECT(
    'screenSize', '32 inch',
    'resolution', '3840 x 2160 (4K UHD)',
    'panelType', 'IPS Mini-LED',
    'refreshRate', '240Hz',
    'responseTime', '1ms (GTG)',
    'brightness', '1400 nits (Peak)',
    'contrastRatio', '1000:1',
    'localDimming', '1152 zones',
    'hdr', 'DisplayHDR 1400',
    'colorGamut', '99% Adobe RGB, 98% DCI-P3',
    'ports', '2x HDMI 2.1, 1x DisplayPort 1.4, 4x USB 3.2',
    'features', 'G-SYNC Ultimate, Variable Overdrive',
    'warranty', '36 months'
)),

('Samsung Odyssey Neo G8 32" 4K 240Hz Mini-LED',
'samsung-odyssey-neo-g8-32-4k-240hz-mini-led',
'Màn hình cong 4K với Quantum Matrix Technology',
28990000,
26990000,
20,
21,
'Samsung',
TRUE,
'/src/assets/Product/Monitor/Gaming/Samsung Odyssey Neo G8/Samsung_Neo_G8_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Gaming/Samsung Odyssey Neo G8/Samsung_Neo_G8_1.jpg',
    '/src/assets/Product/Monitor/Gaming/Samsung Odyssey Neo G8/Samsung_Neo_G8_2.jpg'
),
JSON_OBJECT(
    'screenSize', '32 inch',
    'resolution', '3840 x 2160 (4K UHD)',
    'panelType', 'VA Mini-LED',
    'curvature', '1000R',
    'refreshRate', '240Hz',
    'responseTime', '1ms (GTG)',
    'brightness', '2000 nits (Peak)',
    'contrastRatio', '1,000,000:1 (Dynamic)',
    'hdr', 'HDR10+, HDR1400',
    'colorGamut', '95% DCI-P3',
    'ports', '2x HDMI 2.1, 1x DisplayPort 1.4, 3x USB 3.0',
    'features', 'FreeSync Premium Pro, Smart TV Features, Game Bar',
    'warranty', '36 months'
)),

-- Fast IPS Gaming Monitors (Tầm trung cao cấp)
('LG UltraGear 27GP950-B 27" 4K 144Hz Nano IPS',
'lg-ultragear-27gp950-b-27-4k-144hz-nano-ips',
'Màn hình gaming 4K 144Hz với Nano IPS và G-SYNC',
18990000,
17490000,
30,
21,
'LG',
TRUE,
'/src/assets/Product/Monitor/Gaming/LG UltraGear 27GP950/LG_27GP950_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Gaming/LG UltraGear 27GP950/LG_27GP950_1.jpg',
    '/src/assets/Product/Monitor/Gaming/LG UltraGear 27GP950/LG_27GP950_2.jpg'
),
JSON_OBJECT(
    'screenSize', '27 inch',
    'resolution', '3840 x 2160 (4K UHD)',
    'panelType', 'Nano IPS',
    'refreshRate', '144Hz (160Hz OC)',
    'responseTime', '1ms (GTG)',
    'brightness', '600 nits',
    'contrastRatio', '1000:1',
    'hdr', 'DisplayHDR 600, VESA Certified',
    'colorGamut', '98% DCI-P3, 135% sRGB',
    'ports', '2x HDMI 2.1, 1x DisplayPort 1.4, 2x USB 3.0',
    'features', 'G-SYNC Compatible, FreeSync Premium Pro, Sphere Lighting 2.0',
    'warranty', '24 months'
)),

('ASUS TUF Gaming VG27AQL3A 27" QHD 180Hz Fast IPS',
'asus-tuf-gaming-vg27aql3a-27-qhd-180hz-fast-ips',
'Màn hình gaming QHD 180Hz với ELMB Sync',
8990000,
7990000,
50,
21,
'ASUS',
TRUE,
'/src/assets/Product/Monitor/Gaming/ASUS TUF VG27AQL3A/ASUS_VG27AQL3A_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Gaming/ASUS TUF VG27AQL3A/ASUS_VG27AQL3A_1.jpg',
    '/src/assets/Product/Monitor/Gaming/ASUS TUF VG27AQL3A/ASUS_VG27AQL3A_2.jpg'
),
JSON_OBJECT(
    'screenSize', '27 inch',
    'resolution', '2560 x 1440 (QHD)',
    'panelType', 'Fast IPS',
    'refreshRate', '180Hz',
    'responseTime', '1ms (GTG)',
    'brightness', '400 nits',
    'contrastRatio', '1000:1',
    'hdr', 'HDR10',
    'colorGamut', '99% sRGB',
    'ports', '2x HDMI 2.0, 1x DisplayPort 1.4, 2x USB 3.0',
    'features', 'G-SYNC Compatible, FreeSync Premium, ELMB Sync, Variable Overdrive',
    'warranty', '36 months'
)),

('AOC AGON AG276QZD 27" QHD 240Hz Fast IPS',
'aoc-agon-ag276qzd-27-qhd-240hz-fast-ips',
'Màn hình gaming QHD 240Hz giá tốt',
10990000,
9990000,
40,
21,
'AOC',
TRUE,
'/src/assets/Product/Monitor/Gaming/AOC AGON AG276QZD/AOC_AG276QZD_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Gaming/AOC AGON AG276QZD/AOC_AG276QZD_1.jpg',
    '/src/assets/Product/Monitor/Gaming/AOC AGON AG276QZD/AOC_AG276QZD_2.jpg'
),
JSON_OBJECT(
    'screenSize', '27 inch',
    'resolution', '2560 x 1440 (QHD)',
    'panelType', 'Fast IPS',
    'refreshRate', '240Hz',
    'responseTime', '1ms (GTG)',
    'brightness', '400 nits',
    'contrastRatio', '1000:1',
    'hdr', 'HDR10',
    'colorGamut', '126% sRGB, 95% DCI-P3',
    'ports', '2x HDMI 2.0, 1x DisplayPort 1.4, 4x USB 3.2',
    'features', 'G-SYNC Compatible, FreeSync Premium Pro, Low Input Lag Mode',
    'warranty', '36 months'
)),

-- Fast TN/VA Gaming Monitors (Giá rẻ)
('MSI Optix G273QPF 27" QHD 165Hz Rapid IPS',
'msi-optix-g273qpf-27-qhd-165hz-rapid-ips',
'Màn hình gaming QHD 165Hz giá phải chăng',
6490000,
5990000,
60,
21,
'MSI',
FALSE,
'/src/assets/Product/Monitor/Gaming/MSI Optix G273QPF/MSI_G273QPF_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Gaming/MSI Optix G273QPF/MSI_G273QPF_1.jpg',
    '/src/assets/Product/Monitor/Gaming/MSI Optix G273QPF/MSI_G273QPF_2.jpg'
),
JSON_OBJECT(
    'screenSize', '27 inch',
    'resolution', '2560 x 1440 (QHD)',
    'panelType', 'Rapid IPS',
    'refreshRate', '165Hz',
    'responseTime', '1ms (GTG)',
    'brightness', '300 nits',
    'contrastRatio', '1000:1',
    'hdr', 'HDR Ready',
    'colorGamut', '95% DCI-P3, 139% sRGB',
    'ports', '2x HDMI 2.0, 1x DisplayPort 1.4, 1x USB-C',
    'features', 'FreeSync Premium, Night Vision, Less Blue Light',
    'warranty', '36 months'
)),

('ViewSonic XG2431 24" FHD 240Hz Fast IPS',
'viewsonic-xg2431-24-fhd-240hz-fast-ips',
'Màn hình gaming esports 24 inch 240Hz',
6990000,
6490000,
45,
21,
'ViewSonic',
FALSE,
'/src/assets/Product/Monitor/Gaming/ViewSonic XG2431/ViewSonic_XG2431_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Gaming/ViewSonic XG2431/ViewSonic_XG2431_1.jpg',
    '/src/assets/Product/Monitor/Gaming/ViewSonic XG2431/ViewSonic_XG2431_2.jpg'
),
JSON_OBJECT(
    'screenSize', '24 inch',
    'resolution', '1920 x 1080 (Full HD)',
    'panelType', 'Fast IPS',
    'refreshRate', '240Hz',
    'responseTime', '0.5ms (MPRT)',
    'brightness', '400 nits',
    'contrastRatio', '1000:1',
    'hdr', 'No',
    'colorGamut', '99% sRGB',
    'ports', '1x HDMI 2.0, 1x DisplayPort 1.2, 4x USB 3.0',
    'features', 'G-SYNC Compatible, FreeSync Premium, Pendulum Aim Point',
    'warranty', '36 months'
)),

-- PROFESSIONAL MONITOR PRODUCTS (Đồ họa, Thiết kế)
('BenQ SW321C 32" 4K IPS (99% Adobe RGB)',
'benq-sw321c-32-4k-ips-99-adobe-rgb',
'Màn hình chuyên nghiệp 4K cho nhiếp ảnh và thiết kế',
29990000,
27990000,
20,
22,
'BenQ',
TRUE,
'/src/assets/Product/Monitor/Professional/BenQ SW321C/BenQ_SW321C_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Professional/BenQ SW321C/BenQ_SW321C_1.jpg',
    '/src/assets/Product/Monitor/Professional/BenQ SW321C/BenQ_SW321C_2.jpg'
),
JSON_OBJECT(
    'screenSize', '32 inch',
    'resolution', '3840 x 2160 (4K UHD)',
    'panelType', 'IPS',
    'refreshRate', '60Hz',
    'brightness', '250 nits',
    'contrastRatio', '1000:1',
    'colorGamut', '99% Adobe RGB, 100% sRGB/Rec.709, 95% DCI-P3',
    'colorDepth', '10-bit (1.07 billion colors)',
    'deltaE', '≤2',
    'ports', '1x HDMI 2.0, 1x DisplayPort 1.4, 1x USB-C (PD 60W), USB Hub',
    'features', 'Hardware Calibration, Paper Color Sync, Uniformity Technology',
    'calibrator', 'Compatible with X-Rite i1Display Pro',
    'warranty', '36 months'
)),

('ASUS ProArt PA279CRV 27" 4K IPS (100% sRGB)',
'asus-proart-pa279crv-27-4k-ips-100-srgb',
'Màn hình ProArt 4K với Calman Verified',
13990000,
12990000,
30,
22,
'ASUS',
TRUE,
'/src/assets/Product/Monitor/Professional/ASUS ProArt PA279CRV/ASUS_PA279CRV_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Professional/ASUS ProArt PA279CRV/ASUS_PA279CRV_1.jpg',
    '/src/assets/Product/Monitor/Professional/ASUS ProArt PA279CRV/ASUS_PA279CRV_2.jpg'
),
JSON_OBJECT(
    'screenSize', '27 inch',
    'resolution', '3840 x 2160 (4K UHD)',
    'panelType', 'IPS',
    'refreshRate', '60Hz',
    'brightness', '350 nits',
    'contrastRatio', '1000:1',
    'colorGamut', '100% sRGB, 100% Rec.709, 99% DCI-P3',
    'colorDepth', '10-bit (1.07 billion colors)',
    'deltaE', '< 2',
    'ports', '1x HDMI 2.0, 1x DisplayPort 1.4, 1x USB-C (PD 96W), USB Hub',
    'features', 'Calman Verified, ProArt Preset, ProArt Palette',
    'warranty', '36 months'
)),

('Dell UltraSharp U2723DE 27" QHD IPS (USB-C Hub)',
'dell-ultrasharp-u2723de-27-qhd-ips-usb-c-hub',
'Màn hình văn phòng cao cấp với USB-C 90W',
11990000,
10990000,
35,
22,
'Dell',
TRUE,
'/src/assets/Product/Monitor/Professional/Dell UltraSharp U2723DE/Dell_U2723DE_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Professional/Dell UltraSharp U2723DE/Dell_U2723DE_1.jpg',
    '/src/assets/Product/Monitor/Professional/Dell UltraSharp U2723DE/Dell_U2723DE_2.jpg'
),
JSON_OBJECT(
    'screenSize', '27 inch',
    'resolution', '2560 x 1440 (QHD)',
    'panelType', 'IPS Black Technology',
    'refreshRate', '60Hz',
    'brightness', '350 nits',
    'contrastRatio', '2000:1',
    'colorGamut', '100% sRGB, 95% DCI-P3',
    'colorDepth', '10-bit via dithering',
    'deltaE', '< 2',
    'ports', '1x HDMI 2.0, 1x DisplayPort 1.4, 1x USB-C (PD 90W), USB Hub',
    'features', 'ComfortView Plus, Built-in KVM, Ethernet RJ45',
    'warranty', '36 months'
)),

('LG UltraFine 32UN880-B 32" 4K IPS Ergo Stand',
'lg-ultrafine-32un880-b-32-4k-ips-ergo-stand',
'Màn hình 4K với giá đỡ Ergo linh hoạt',
16990000,
15490000,
25,
22,
'LG',
TRUE,
'/src/assets/Product/Monitor/Professional/LG UltraFine 32UN880/LG_32UN880_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Professional/LG UltraFine 32UN880/LG_32UN880_1.jpg',
    '/src/assets/Product/Monitor/Professional/LG UltraFine 32UN880/LG_32UN880_2.jpg'
),
JSON_OBJECT(
    'screenSize', '31.5 inch',
    'resolution', '3840 x 2160 (4K UHD)',
    'panelType', 'IPS',
    'refreshRate', '60Hz',
    'brightness', '350 nits',
    'contrastRatio', '1000:1',
    'colorGamut', '95% DCI-P3',
    'colorDepth', '10-bit',
    'hdr', 'HDR10',
    'ports', '2x HDMI 2.0, 1x DisplayPort 1.4, 1x USB-C (PD 60W)',
    'features', 'Ergo Stand (Height/Tilt/Swivel/Pivot), FreeSync, On-Screen Control',
    'warranty', '24 months'
)),

-- OFFICE MONITOR PRODUCTS (Văn phòng)
('Dell P2723DE 27" QHD IPS (Budget Professional)',
'dell-p2723de-27-qhd-ips-budget-professional',
'Màn hình văn phòng QHD giá tốt với USB-C',
7990000,
7490000,
50,
23,
'Dell',
FALSE,
'/src/assets/Product/Monitor/Office/Dell P2723DE/Dell_P2723DE_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Office/Dell P2723DE/Dell_P2723DE_1.jpg',
    '/src/assets/Product/Monitor/Office/Dell P2723DE/Dell_P2723DE_2.jpg'
),
JSON_OBJECT(
    'screenSize', '27 inch',
    'resolution', '2560 x 1440 (QHD)',
    'panelType', 'IPS',
    'refreshRate', '60Hz',
    'brightness', '350 nits',
    'contrastRatio', '1000:1',
    'colorGamut', '99% sRGB',
    'ports', '1x HDMI 1.4, 1x DisplayPort 1.4, 1x USB-C (PD 65W), USB Hub',
    'features', 'ComfortView Plus, Built-in Ethernet, Height Adjust',
    'warranty', '36 months'
)),

('LG 27UP550-W 27" 4K IPS (Budget 4K)',
'lg-27up550-w-27-4k-ips-budget-4k',
'Màn hình 4K giá rẻ cho văn phòng',
6490000,
5990000,
60,
23,
'LG',
FALSE,
'/src/assets/Product/Monitor/Office/LG 27UP550/LG_27UP550_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Office/LG 27UP550/LG_27UP550_1.jpg',
    '/src/assets/Product/Monitor/Office/LG 27UP550/LG_27UP550_2.jpg'
),
JSON_OBJECT(
    'screenSize', '27 inch',
    'resolution', '3840 x 2160 (4K UHD)',
    'panelType', 'IPS',
    'refreshRate', '60Hz',
    'brightness', '300 nits',
    'contrastRatio', '1000:1',
    'colorGamut', '95% DCI-P3',
    'hdr', 'HDR10',
    'ports', '2x HDMI 2.0, 1x DisplayPort 1.4',
    'features', 'FreeSync, On-Screen Control, Reader Mode',
    'warranty', '24 months'
)),

('Samsung M8 32" 4K Smart Monitor (White)',
'samsung-m8-32-4k-smart-monitor-white',
'Smart Monitor 4K với tính năng giải trí',
9990000,
8990000,
40,
23,
'Samsung',
TRUE,
'/src/assets/Product/Monitor/Office/Samsung M8/Samsung_M8_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Office/Samsung M8/Samsung_M8_1.jpg',
    '/src/assets/Product/Monitor/Office/Samsung M8/Samsung_M8_2.jpg'
),
JSON_OBJECT(
    'screenSize', '32 inch',
    'resolution', '3840 x 2160 (4K UHD)',
    'panelType', 'VA',
    'refreshRate', '60Hz',
    'brightness', '400 nits',
    'contrastRatio', '3000:1',
    'colorGamut', '99% sRGB',
    'hdr', 'HDR10+',
    'ports', '1x HDMI, 1x USB-C (PD 65W), 2x USB 2.0',
    'features', 'Smart TV OS, Gaming Hub, SlimFit Camera, AirPlay 2',
    'warranty', '24 months'
)),

('BenQ GW2790QT 27" QHD IPS (Eye-Care)',
'benq-gw2790qt-27-qhd-ips-eye-care',
'Màn hình văn phòng QHD với công nghệ bảo vệ mắt',
6990000,
6490000,
55,
23,
'BenQ',
FALSE,
'/src/assets/Product/Monitor/Office/BenQ GW2790QT/BenQ_GW2790QT_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Office/BenQ GW2790QT/BenQ_GW2790QT_1.jpg',
    '/src/assets/Product/Monitor/Office/BenQ GW2790QT/BenQ_GW2790QT_2.jpg'
),
JSON_OBJECT(
    'screenSize', '27 inch',
    'resolution', '2560 x 1440 (QHD)',
    'panelType', 'IPS',
    'refreshRate', '75Hz',
    'brightness', '350 nits',
    'contrastRatio', '1000:1',
    'colorGamut', '99% sRGB',
    'ports', '1x HDMI 2.0, 1x DisplayPort 1.4, 1x USB-C (PD 65W), USB Hub',
    'features', 'Eye-Care Technology, Brightness Intelligence Plus, Low Blue Light',
    'warranty', '36 months'
)),

-- PORTABLE MONITOR PRODUCTS (Di động)
('ASUS ZenScreen OLED MQ16AH 15.6" FHD OLED',
'asus-zenscreen-oled-mq16ah-15-6-fhd-oled',
'Màn hình OLED di động 15.6 inch cao cấp',
10990000,
9990000,
30,
24,
'ASUS',
TRUE,
'/src/assets/Product/Monitor/Portable/ASUS ZenScreen OLED MQ16AH/ASUS_MQ16AH_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Portable/ASUS ZenScreen OLED MQ16AH/ASUS_MQ16AH_1.jpg',
    '/src/assets/Product/Monitor/Portable/ASUS ZenScreen OLED MQ16AH/ASUS_MQ16AH_2.jpg'
),
JSON_OBJECT(
    'screenSize', '15.6 inch',
    'resolution', '1920 x 1080 (Full HD)',
    'panelType', 'OLED',
    'refreshRate', '60Hz',
    'responseTime', '1ms',
    'brightness', '400 nits',
    'contrastRatio', '100,000:1',
    'colorGamut', '100% DCI-P3',
    'weight', '750g',
    'thickness', '9mm',
    'ports', '2x USB-C, 1x Micro HDMI',
    'features', 'Built-in Battery (7800mAh), Auto-rotate, Eye Care',
    'warranty', '24 months'
)),

('ViewSonic VG1655 15.6" FHD IPS Portable',
'viewsonic-vg1655-15-6-fhd-ips-portable',
'Màn hình di động giá rẻ cho công việc',
4990000,
4490000,
45,
24,
'ViewSonic',
FALSE,
'/src/assets/Product/Monitor/Portable/ViewSonic VG1655/ViewSonic_VG1655_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Portable/ViewSonic VG1655/ViewSonic_VG1655_1.jpg',
    '/src/assets/Product/Monitor/Portable/ViewSonic VG1655/ViewSonic_VG1655_2.jpg'
),
JSON_OBJECT(
    'screenSize', '15.6 inch',
    'resolution', '1920 x 1080 (Full HD)',
    'panelType', 'IPS',
    'refreshRate', '60Hz',
    'brightness', '250 nits',
    'contrastRatio', '800:1',
    'colorGamut', '72% NTSC',
    'weight', '800g',
    'thickness', '9.2mm',
    'ports', '1x USB-C, 1x Mini HDMI',
    'features', 'Smart Cover Stand, Blue Light Filter',
    'warranty', '36 months'
)),

('EVICIV 17.3" 4K Portable Monitor',
'eviciv-17-3-4k-portable-monitor',
'Màn hình di động 17.3 inch 4K cho gaming',
7990000,
7490000,
25,
24,
'EVICIV',
TRUE,
'/src/assets/Product/Monitor/Portable/EVICIV 17.3 4K/EVICIV_17_3_4K_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Portable/EVICIV 17.3 4K/EVICIV_17_3_4K_1.jpg',
    '/src/assets/Product/Monitor/Portable/EVICIV 17.3 4K/EVICIV_17_3_4K_2.jpg'
),
JSON_OBJECT(
    'screenSize', '17.3 inch',
    'resolution', '3840 x 2160 (4K UHD)',
    'panelType', 'IPS',
    'refreshRate', '60Hz',
    'brightness', '300 nits',
    'contrastRatio', '1000:1',
    'colorGamut', '100% sRGB',
    'weight', '950g',
    'thickness', '10mm',
    'ports', '2x USB-C, 2x Mini HDMI',
    'features', 'HDR Support, FreeSync, Protective Case',
    'warranty', '12 months'
)),

('Lenovo ThinkVision M14t 14" FHD Touch Portable',
'lenovo-thinkvision-m14t-14-fhd-touch-portable',
'Màn hình cảm ứng di động cho laptop',
6490000,
5990000,
35,
24,
'Lenovo',
FALSE,
'/src/assets/Product/Monitor/Portable/Lenovo ThinkVision M14t/Lenovo_M14t_1.jpg',
JSON_ARRAY(
    '/src/assets/Product/Monitor/Portable/Lenovo ThinkVision M14t/Lenovo_M14t_1.jpg',
    '/src/assets/Product/Monitor/Portable/Lenovo ThinkVision M14t/Lenovo_M14t_2.jpg'
),
JSON_OBJECT(
    'screenSize', '14 inch',
    'resolution', '1920 x 1080 (Full HD)',
    'panelType', 'IPS Touch',
    'refreshRate', '60Hz',
    'brightness', '300 nits',
    'contrastRatio', '700:1',
    'colorGamut', '72% NTSC',
    'weight', '698g',
    'thickness', '4.6mm',
    'ports', '2x USB-C',
    'features', '10-Point Touch, Auto-rotate, Low Blue Light',
    'warranty', '12 months'
));

-- Thêm đánh giá cho sản phẩm PC Gaming Luxury
INSERT INTO reviews (userId, productId, rating, comment, images, isApproved) VALUES
(2, 1, 5, 'I drew entire Europe map with this PC! Das ist großartig.', NULL, TRUE),
(3, 1, 5, 'Best PC I ever owned. I discovered the Theory Of Relativity thanks to this PC!', NULL, TRUE),
(4, 1, 4, 'I was able to launch Falcon 1 into space thanks to the PC I bought from this store. I am planning to update this PC for all employees in the Rocket Research and Development department at SpaceX.', NULL, TRUE),
(5, 1, 5, 'Mon Dieu! What sorcery is this magnificent contraption? As I first laid mine eyes upon this resplendent machine, adorned with luminous jewels that dance like fireflies in the twilight, I was utterly transported. The crystalline glass panel reveals intricate mechanisms within - a testament to human ingenuity that would make even Da Vinci weep with envy. When I did activate this mechanical marvel, it awakened with a gentle hum, as melodious as a harpsichord\'s whisper. The illuminated texts appeared before me with such clarity, as if conjured by Merlin himself! I composed my latest treatise "De Natura Machinarum Mirabilium" upon this device, and lo, the quill moved by invisible hands! The speed at which my thoughts manifested into written word - \'twas faster than any scribe in my château could ever dream! The moving pictures - oh, how they captivate! \'Tis as if I possess a window to realms beyond mortal comprehension. I witnessed battles of mythical beasts rendered in colors more vivid than the finest Flemish tapestries. This apparatus has elevated my scholarly pursuits to heights previously unattainable. I dare say, this is not merely a machine - \'tis a portal to the divine realm of knowledge itself! Should the Sun King Louis himself inquire, I would declare without hesitation: this is the most extraordinary acquisition of my entire noble lineage. Bravo to the artisans who crafted such magnificence!', NULL, TRUE),
(6, 1, 5, '# # # # # / - .... .. -..-. -. / -.-. # / -... # - / -.- .... # / .-.. # / # # # # # # # / - .. # - / .-.. # ..- / - .... .. -..-. -. / -.-. # / - # .. / -. .- -. / # .--.- --- / -.--. .-.. # / - .... .. -..-. -. / -.-. # --..-- / - # .. / -.- .... ---. / - .... --- .--.- - -.--.- / # # # # # # # / - .-. .. / -- # -. .... / - .... ..- # -. / - .... .. -..-. -. / - .--.- -- / - # / .- -. / -.--. -... .. # - / -- # -. .... --..-- / - .... ..- # -. / - .-. # .. --..-- / .-.. ---. -. --. / - # / -.-- -..-. -. -.--.- / # # # # # # # / -- # -.-. / ...- # -. / - .. # -. / - .-. .---. -. .... / -.. # / .... # ..- / .-.. # / -.--. -.-. .... # / .... # .. / # # # -. --. / - .-. # # -.-. / ...- .--.- / ... .- ..- -.--.- / # # # # # # # / -- .. -. .... / -- .. -. .... / -.-. .... .. / - .-. ..- -. --. / .... # ..- / # # -. .... / ... # / -.--. - .-. --- -. --. / -- # / -- # - / -.-. ---. / ... # / # # -. .... -.--.- / # # # # # # # / - .-. # / --. .. # / .... .--.- -- / -- # -.-. / - .... # / - .... .. -..-. -. / --.- ..- -.-- / -.--. -. --. # # .. / - .-. # / .. -- / .-.. # -. --. / --. .. # / --.- ..- -.-- / - .-. # .. -.--.- / # # # # # # # / -. --. ..- / --. .. # / ...- # -. --. / -. --. ---. -. / -.-. .... .. -..-. ..- / .... # .- / - .- .. / -.--. -.- # / -. --. ..- / -. ---. .. / -... # -.-- / -- # .. / .... # .- / - .- .. -.--.- / # # # # # # # / - .... .. -..-. -. / # # --- / - ..- # -. / .... --- .--.- -. / -... .--.- --- / # -. --. / -- .. -. .... / -.--. - .... .. -..-. -. / # # --- / .-.. ..- .--.- -. / .... # .. --..-- / -... .--.- --- / # -. --. / .-. # / .-. .--.- -. --. -.--.-', NULL, TRUE),
(7, 1, 5, '天機不可露 Thiên cơ bất khả lộ. 泄漏天機罪難逃 Tiết lậu thiên cơ tội nan đào (Lộ thiên cơ, tội khó thoát). 知命順天心自安 Tri mệnh thuận thiên tâm tự an (Biết mệnh, thuận trời, lòng tự yên). 莫問前程與後路 Mạc vấn tiền trình dữ hậu lộ (Chớ hỏi đường trước và sau). 冥冥之中有定數 Minh minh chi trung hữu định số (Trong mờ mịt có số định). 智者緘默守天規 Trí giả hàm mặc thủ thiên quy (Người trí im lặng giữ quy trời). 愚者妄言招禍災 Ngu giả vọng ngôn chiêu họa tai (Kẻ ngu nói bậy mời họa tai). 天道循環報應明 Thiên đạo tuần hoàn báo ứng minh (Thiên đạo luân hồi, báo ứng rõ ràng)', NULL, TRUE);

-- Cập nhật rating và numReviews cho sản phẩm
UPDATE products SET rating = 4.9, numReviews = 7 WHERE id = 1;

-- Tạo giỏ hàng mẫu cho user
INSERT INTO carts (userId, totalAmount) VALUES
(2, 0),
(3, 0),
(4, 0);

-- Thêm sản phẩm vào giỏ hàng mẫu
INSERT INTO cart_items (cartId, productId, quantity, price) VALUES
(1, 1, 1, 48800000),
(1, 9, 1, 3200000),
(2, 2, 1, 42000000),
(3, 13, 2, 5000000);

-- Cập nhật tổng tiền giỏ hàng
UPDATE carts SET totalAmount = 52000000 WHERE id = 1;
UPDATE carts SET totalAmount = 42000000 WHERE id = 2;
UPDATE carts SET totalAmount = 10000000 WHERE id = 3;

-- Tạo đơn hàng mẫu
INSERT INTO orders (orderCode, userId, fullName, email, phone, address, totalAmount, shippingFee, discount, paymentMethod, paymentStatus, orderStatus) VALUES
('ORD1733097600ABCD', 2, 'Austrian Artist', 'artist1933@example.com', '0123456789', '123 Vienna Street, Austria', 48800000, 500000, 0, 'banking', 'paid', 'delivered'),
('ORD1733097601EFGH', 3, 'Albert Einstein', 'einstein@example.com', '0987654321', '456 Princeton Ave, USA', 42000000, 500000, 2000000, 'cod', 'pending', 'confirmed');

-- Thêm chi tiết đơn hàng
INSERT INTO order_items (orderId, productId, productName, productImage, quantity, price, totalPrice) VALUES
(1, 1, 'PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC', 'pc-amd-luxury.jpg', 1, 48800000, 48800000),
(2, 2, 'PC Intel Gaming Ultra i9-14900KS - RTX 4090', 'pc-intel-ultra.jpg', 1, 42000000, 42000000);