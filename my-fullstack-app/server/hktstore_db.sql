CREATE DATABASE IF NOT EXISTS `hktstore_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `hktstore_db`;

-- Xóa các bảng cũ (nếu có) theo thứ tự đúng với FOREIGN KEY
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `wishlists`;
DROP TABLE IF EXISTS `vouchers`;
DROP TABLE IF EXISTS `user_addresses`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `product_price_history`;
DROP TABLE IF EXISTS `product_comparisons`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `password_reset_tokens`;
DROP TABLE IF EXISTS `otp_verifications`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `cart_items`;
DROP TABLE IF EXISTS `carts`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";



CREATE TABLE `carts` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `totalAmount` decimal(12,2) DEFAULT 0.00,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



INSERT INTO `carts` (`id`, `userId`, `totalAmount`, `createdAt`, `updatedAt`) VALUES
(2, 8, 71940000.00, '2025-12-05 07:47:34', '2025-12-08 09:56:50'),
(3, 12, 0.00, '2025-12-08 00:47:51', '2025-12-08 00:56:09');

-- --------------------------------------------------------

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `cartId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(12,2) NOT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------


CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `parentId` int(11) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `level` int(11) NOT NULL DEFAULT 1 COMMENT 'Cấp danh mục: 1 = Root, 2 = Sub, 3 = Third level'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `parentId`, `isActive`, `createdAt`, `updatedAt`, `level`) VALUES
(1, 'PC', 'pc', 'Máy tính để bàn các loại', NULL, NULL, 1, '2025-12-04 05:18:07', '2025-12-04 05:18:07', 1),
(2, 'Gaming Gear', 'gaming-gear', 'Thiết bị chơi game', NULL, NULL, 1, '2025-12-04 05:18:07', '2025-12-04 05:18:07', 1),
(3, 'Hardware', 'hardware', 'Linh kiện máy tính', NULL, NULL, 1, '2025-12-04 05:18:07', '2025-12-04 05:18:07', 1),
(4, 'Monitor', 'monitor', 'Màn hình máy tính', NULL, NULL, 1, '2025-12-04 05:18:07', '2025-12-04 05:18:07', 1),
(5, 'PC Gaming', 'pc-gaming', 'PC chơi game cao cấp', NULL, 1, 1, '2025-12-04 05:18:07', '2025-12-05 06:29:15', 2),
(6, 'PC Workstation', 'pc-workstation', 'PC làm việc chuyên nghiệp', NULL, 1, 1, '2025-12-04 05:18:07', '2025-12-05 06:29:15', 2),
(7, 'PC Office', 'pc-office', 'PC văn phòng', NULL, 1, 1, '2025-12-04 05:18:07', '2025-12-05 06:29:15', 2),
(8, 'Console', 'console', 'Máy chơi game Console', NULL, 2, 1, '2025-12-04 05:18:07', '2025-12-05 06:29:15', 2),
(9, 'Keyboard', 'keyboard', 'Bàn phím Gaming', NULL, 2, 1, '2025-12-04 05:18:07', '2025-12-05 06:29:15', 2),
(10, 'Mouse', 'mouse', 'Chuột Gaming', NULL, 2, 1, '2025-12-04 05:18:07', '2025-12-05 06:29:15', 2),
(11, 'Headset', 'headset', 'Tai nghe Gaming', NULL, 2, 1, '2025-12-04 05:18:07', '2025-12-05 06:29:15', 2),
(12, 'CPU', 'cpu', 'Bộ vi xử lý', NULL, 3, 1, '2025-12-04 05:18:07', '2025-12-05 06:29:15', 2),
(13, 'Mainboard', 'mainboard', 'Bo mạch chủ', NULL, 3, 1, '2025-12-04 05:18:07', '2025-12-05 06:29:15', 2),
(14, 'RAM', 'ram', 'Bộ nhớ RAM', NULL, 3, 1, '2025-12-04 05:18:07', '2025-12-05 06:29:15', 2),
(15, 'VGA', 'vga', 'Card màn hình', NULL, 3, 1, '2025-12-04 05:18:07', '2025-12-05 06:29:15', 2),
(16, 'SSD/HDD', 'ssd-hdd', 'Ổ cứng SSD và HDD', NULL, 3, 1, '2025-12-04 05:18:07', '2025-12-05 06:29:15', 2),
(17, 'Tản Nhiệt', 'cooling', 'Tản nhiệt CPU/VGA', NULL, 3, 1, '2025-12-04 05:18:07', '2025-12-05 06:29:15', 2),
(18, 'Case', 'case', 'Vỏ Case máy tính', NULL, 3, 1, '2025-12-04 05:18:07', '2025-12-05 06:29:15', 2),
(19, 'PSU', 'psu', 'Nguồn máy tính', NULL, 3, 1, '2025-12-04 05:18:07', '2025-12-05 06:29:15', 2),
(20, 'Gaming Monitor', 'gaming-monitor', 'Màn hình Gaming', NULL, 4, 1, '2025-12-04 05:18:07', '2025-12-05 06:29:15', 2),
(21, 'Professional Monitor', 'professional-monitor', 'Màn hình chuyên nghiệp cho đồ họa', NULL, 4, 1, '2025-12-04 05:18:07', '2025-12-05 06:29:15', 2),
(22, 'Office Monitor', 'office-monitor', 'Màn hình văn phòng', NULL, 4, 1, '2025-12-04 05:18:07', '2025-12-05 06:29:15', 2),
(23, 'Portable Monitor', 'portable-monitor', 'Màn hình di động', NULL, 4, 1, '2025-12-04 05:18:07', '2025-12-05 06:29:15', 2);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `type` enum('order','product','promotion','system') NOT NULL,
  `title` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `relatedId` int(11) DEFAULT NULL,
  `relatedType` varchar(50) DEFAULT NULL,
  `isRead` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `orderCode` varchar(20) NOT NULL,
  `userId` int(11) NOT NULL,
  `fullName` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `address` text NOT NULL,
  `province` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `ward` varchar(100) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `totalAmount` decimal(12,2) NOT NULL,
  `shippingFee` decimal(12,2) DEFAULT 0.00,
  `shippingMethod` enum('standard','express','same_day') DEFAULT 'standard',
  `estimatedDelivery` date DEFAULT NULL,
  `trackingNumber` varchar(100) DEFAULT NULL,
  `discount` decimal(12,2) DEFAULT 0.00,
  `voucherCode` varchar(50) DEFAULT NULL,
  `paymentMethod` enum('cod','banking','momo','vnpay') DEFAULT 'cod',
  `paymentStatus` enum('pending','paid','failed','refunded') DEFAULT 'pending',
  `orderStatus` enum('pending','confirmed','shipping','delivered','cancelled') DEFAULT 'pending',
  `paidAt` timestamp NULL DEFAULT NULL,
  `deliveredAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
--
-- Triggers `orders`
--
DELIMITER $$
CREATE TRIGGER `update_product_sold_after_order_completed` AFTER UPDATE ON `orders` FOR EACH ROW BEGIN
    IF NEW.orderStatus = 'delivered' AND OLD.orderStatus != 'delivered' THEN
        UPDATE products p
        INNER JOIN order_items oi ON p.id = oi.productId
        SET p.sold = p.sold + oi.quantity,
            p.saleCount = p.saleCount + oi.quantity
        WHERE oi.orderId = NEW.id;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `productName` varchar(200) NOT NULL,
  `productImage` varchar(255) DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `specifications` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`specifications`)),
  `quantity` int(11) NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `salePrice` decimal(12,2) DEFAULT NULL,
  `totalPrice` decimal(12,2) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `otp_verifications`
--

CREATE TABLE `otp_verifications` (
  `id` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `otp` varchar(6) NOT NULL,
  `type` enum('register','login','reset_password','change_email') NOT NULL,
  `expiresAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isVerified` tinyint(1) DEFAULT 0,
  `attempts` int(11) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expiresAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isUsed` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(12,2) NOT NULL,
  `salePrice` decimal(12,2) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `sold` int(11) DEFAULT 0,
  `saleCount` int(11) DEFAULT 0,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `thumbnail` varchar(255) DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `specifications` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`specifications`)),
  `categoryId` int(11) NOT NULL,
  `rating` decimal(2,1) DEFAULT 0.0,
  `numReviews` int(11) DEFAULT 0,
  `isFeatured` tinyint(1) DEFAULT 0,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `categoryLevel` int(11) DEFAULT NULL COMMENT 'Cấp danh mục của sản phẩm'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `slug`, `description`, `price`, `salePrice`, `quantity`, `sold`, `saleCount`, `images`, `thumbnail`, `brand`, `specifications`, `categoryId`, `rating`, `numReviews`, `isFeatured`, `isActive`, `createdAt`, `updatedAt`, `categoryLevel`) VALUES
(1, 'PC AMD Gaming Mid Ryzen 7 7800X3D - RTX 4070 Ti', 'pc-amd-gaming-mid-ryzen-7-7800x3d-rtx-4070-ti', 'PC Gaming tầm trung mạnh mẽ', 32000000.00, 29000000.00, 25, 0, 0, NULL, 'pc-amd-mid.jpg', 'AMD', '{\"cpu\": \"AMD Ryzen 7 7800X3D\", \"vga\": \"NVIDIA RTX 4070 Ti\", \"ram\": \"32GB DDR5\", \"ssd\": \"1TB NVMe\", \"warranty\": \"36 months\"}', 5, 0.0, 0, 1, 1, '2025-12-04 05:18:07', '2025-12-05 06:29:15', 2),
(2, 'PC ULTRA GAMING I5 13400F - RTX 4060 8GB DUAL OC (Original Config)', 'pc-ultra-gaming-i5-13400f-rtx-4060-8gb-dual-oc-cau-hinh-goc', 'PC Gaming tầm trung với Intel Core i5 13400F và RTX 4060 8GB', 20580000.00, NULL, 30, 0, 0, '[\"/src/assets/Product/PC/PC-Gaming/PC Ultra Gaming i5 13400F RTX 4060/PC_Ultra_Gaming_i5_13400F_RTX_4060_1.jpg\", \"/src/assets/Product/PC/PC-Gaming/PC Ultra Gaming i5 13400F RTX 4060/PC_Ultra_Gaming_i5_13400F_RTX_4060_2.jpg\", \"/src/assets/Product/PC/PC-Gaming/PC Ultra Gaming i5 13400F RTX 4060/PC_Ultra_Gaming_i5_13400F_RTX_4060_3.jpg\", \"/src/assets/Product/PC/PC-Gaming/PC Ultra Gaming i5 13400F RTX 4060/PC_Ultra_Gaming_i5_13400F_RTX_4060_4.jpg\"]', '/src/assets/Product/PC/PC-Gaming/PC Ultra Gaming i5 13400F RTX 4060/PC_Ultra_Gaming_i5_13400F_RTX_4060_1.jpg', 'Intel', '{\"cpu\": \"Intel Core i5-13400F (Up To 4.60Ghz, 10 Cores 16 Threads, 20 MB Cache, LGA 1700)\", \"mainboard\": \"ASUS B760M-K PRIME DDR4\", \"ram\": \"SSTC 16GB Bus 3200Mhz DDR4 BLACK TẢN NHIỆT\", \"ssd\": \"HIKSEMI WAVE PRO 512GB M.2 2280 PCIe 3.0x4 (Đọc 3500MB/s, Ghi 1800MB/s)\", \"psu\": \"FSP HV PRO 650W (80 Plus Bronze/DÂY LIỀN/EU/ĐEN)\", \"vga\": \"COLORFUL GEFORCE RTX 4060 NB DUO 8GB-V\", \"case\": \"AIGO C218M BLACK - Include 4 FAN ARGB\", \"cooling\": \"JONSBO CR-1000\", \"warranty\": \"36 months\"}', 5, 0.0, 0, 1, 1, '2025-12-04 05:18:07', '2025-12-05 06:29:15', 2),
(3, 'PC Workstation- 3D Render- Edit Video i7 14700KF - RTX 5070 Ti 16GB OC', 'pc-workstation-3d-render-edit-video-i7-14700kf-rtx-5070-ti-16gb-oc', 'Professional PC Workstation for 3D rendering and video editing with Intel Core i7 14700KF and RTX 5070 Ti', 50890000.00, 47680000.00, 15, 0, 0, '[\"/src/assets/Product/PC/PC-Workstation/PC Workstation i7 14700KF - RTX 5070 Ti/PC_Workstation_i7_14700KF_RTX_5070_Ti_1.jpg\", \"/src/assets/Product/PC/PC-Workstation/PC Workstation i7 14700KF - RTX 5070 Ti/PC_Workstation_i7_14700KF_RTX_5070_Ti_2.jpg\", \"/src/assets/Product/PC/PC-Workstation/PC Workstation i7 14700KF - RTX 5070 Ti/PC_Workstation_i7_14700KF_RTX_5070_Ti_3.jpg\", \"/src/assets/Product/PC/PC-Workstation/PC Workstation i7 14700KF - RTX 5070 Ti/PC_Workstation_i7_14700KF_RTX_5070_Ti_4.jpg\", \"/src/assets/Product/PC/PC-Workstation/PC Workstation i7 14700KF - RTX 5070 Ti/PC_Workstation_i7_14700KF_RTX_5070_Ti_5.jpg\", \"/src/assets/Product/PC/PC-Workstation/PC Workstation i7 14700KF - RTX 5070 Ti/PC_Workstation_i7_14700KF_RTX_5070_Ti_6.jpg\", \"/src/assets/Product/PC/PC-Workstation/PC Workstation i7 14700KF - RTX 5070 Ti/PC_Workstation_i7_14700KF_RTX_5070_Ti_7.jpg\", \"/src/assets/Product/PC/PC-Workstation/PC Workstation i7 14700KF - RTX 5070 Ti/PC_Workstation_i7_14700KF_RTX_5070_Ti_8.jpg\", \"/src/assets/Product/PC/PC-Workstation/PC Workstation i7 14700KF - RTX 5070 Ti/PC_Workstation_i7_14700KF_RTX_5070_Ti_9.jpg\", \"/src/assets/Product/PC/PC-Workstation/PC Workstation i7 14700KF - RTX 5070 Ti/PC_Workstation_i7_14700KF_RTX_5070_Ti_10.jpg\"]', '/src/assets/Product/PC/PC-Workstation/PC Workstation i7 14700KF - RTX 5070 Ti/PC_Workstation_i7_14700KF_RTX_5070_Ti_1.jpg', 'Intel', '{\"cpu\": \"Intel Core i7 14700KF (20 Core - 28 Thread - Base 3.4Ghz - Turbo 5.6Mhz)\", \"mainboard\": \"GIGABYTE Z790 D WIFI DDR5\", \"ram\": \"GEIL SPEAR V 32GB (2x16GB) BUSS 5200MHZ DDR5 BLACK\", \"ssd\": \"HIKSEMI WAVE 512GB M.2 2280 PCIe 3.0x4\", \"psu\": \"FSP VITA 850BD - 850W PPA8504502 BRONZE\", \"vga\": \"ZOTAC GAMING GeForce RTX 5070Ti SOLID SFF OC 16GB GDDR7\", \"case\": \"ANTEC C3 BLACK - Include 4 FAN ARGB\", \"cooling\": \"Thermalright Peerless Assassin 120 SE ARGB BLACK\", \"warranty\": \"36 months\"}', 6, 0.0, 0, 1, 1, '2025-12-04 05:18:07', '2025-12-05 06:29:15', 2),
(4, 'CARD MÀN HÌNH COLORFUL GEFORCE RTX 4060 NB DUO 8GB-V', 'card-man-hinh-colorful-geforce-rtx-4060-nb-duo-8gb-v', 'Card màn hình NVIDIA GeForce RTX 4060 8GB GDDR6 hiệu năng cao', 8399000.00, NULL, 45, 0, 0, '[\"/src/assets/Product/Hardware/VGA/Colorful RTX 4060 NB DUO/Colorful_RTX_4060_NB_DUO_1.jpg\", \"/src/assets/Product/Hardware/VGA/Colorful RTX 4060 NB DUO/Colorful_RTX_4060_NB_DUO_2.jpg\", \"/src/assets/Product/Hardware/VGA/Colorful RTX 4060 NB DUO/Colorful_RTX_4060_NB_DUO_3.jpg\", \"/src/assets/Product/Hardware/VGA/Colorful RTX 4060 NB DUO/Colorful_RTX_4060_NB_DUO_4.jpg\", \"/src/assets/Product/Hardware/VGA/Colorful RTX 4060 NB DUO/Colorful_RTX_4060_NB_DUO_5.jpg\", \"/src/assets/Product/Hardware/VGA/Colorful RTX 4060 NB DUO/Colorful_RTX_4060_NB_DUO_6.jpg\"]', '/src/assets/Product/Hardware/VGA/Colorful RTX 4060 NB DUO/Colorful_RTX_4060_NB_DUO_1.jpg', 'NVIDIA', '{\"memory\": \"8GB GDDR6\", \"clockSpeed\": \"1830 MHz\", \"boostSpeed\": \"2460 MHz\", \"memoryBus\": \"128-bit\", \"tdp\": \"115W\", \"connector\": \"DisplayPort 1.4a (x3), HDMI 2.1\", \"powerRequirement\": \"550W\", \"warranty\": \"36 months\"}', 15, 0.0, 0, 0, 1, '2025-12-04 05:18:08', '2025-12-05 06:29:15', 2),
(5, 'VGA ASUS ROG STRIX RTX 4090 OC 24GB GDDR6X', 'vga-asus-rog-strix-rtx-4090-oc-24gb', 'Card màn hình ASUS ROG STRIX RTX 4090 OC Edition mạnh mẽ nhất', 54990000.00, 52990000.00, 15, 0, 0, '[\"/src/assets/Product/Hardware/VGA/ASUS ROG RTX 4090/ASUS_ROG_RTX_4090_1.jpg\"]', '/src/assets/Product/Hardware/VGA/ASUS ROG RTX 4090/ASUS_ROG_RTX_4090_1.jpg', 'ASUS', '{\"gpu\": \"NVIDIA RTX 4090\", \"memory\": \"24GB GDDR6X\", \"memoryBus\": \"384-bit\", \"coreClock\": \"2640 MHz (Boost)\", \"tdp\": \"450W\", \"connector\": \"3x DP 1.4a, 2x HDMI 2.1\", \"powerPin\": \"3x 8-pin\", \"cooling\": \"Triple Fan\", \"warranty\": \"36 months\"}', 15, 0.0, 0, 1, 1, '2025-12-04 05:18:08', '2025-12-05 06:29:15', 2),
(6, 'Mainboard ASUS ROG STRIX X870E-H GAMING WIFI 7 Hatsune Miku Edition', 'mainboard-asus-rog-strix-x870e-h-gaming-wifi-7-hatsune-miku-edition', 'Bo mạch chủ ASUS ROG STRIX X870E-H phiên bản Hatsune Miku cao cấp với WiFi 7', 16990000.00, 14890000.00, 20, 0, 0, '[\"/src/assets/Product/Hardware/Mainboard/ASUS ROG STRIX X870E-H Hatsune Miku/ASUS_ROG_STRIX_X870E_H_Hatsune_Miku_1.jpg\", \"/src/assets/Product/Hardware/Mainboard/ASUS ROG STRIX X870E-H Hatsune Miku/ASUS_ROG_STRIX_X870E_H_Hatsune_Miku_2.jpg\", \"/src/assets/Product/Hardware/Mainboard/ASUS ROG STRIX X870E-H Hatsune Miku/ASUS_ROG_STRIX_X870E_H_Hatsune_Miku_3.jpg\", \"/src/assets/Product/Hardware/Mainboard/ASUS ROG STRIX X870E-H Hatsune Miku/ASUS_ROG_STRIX_X870E_H_Hatsune_Miku_4.jpg\", \"/src/assets/Product/Hardware/Mainboard/ASUS ROG STRIX X870E-H Hatsune Miku/ASUS_ROG_STRIX_X870E_H_Hatsune_Miku_5.jpg\", \"/src/assets/Product/Hardware/Mainboard/ASUS ROG STRIX X870E-H Hatsune Miku/ASUS_ROG_STRIX_X870E_H_Hatsune_Miku_6.jpg\", \"/src/assets/Product/Hardware/Mainboard/ASUS ROG STRIX X870E-H Hatsune Miku/ASUS_ROG_STRIX_X870E_H_Hatsune_Miku_7.jpg\", \"/src/assets/Product/Hardware/Mainboard/ASUS ROG STRIX X870E-H Hatsune Miku/ASUS_ROG_STRIX_X870E_H_Hatsune_Miku_8.jpg\", \"/src/assets/Product/Hardware/Mainboard/ASUS ROG STRIX X870E-H Hatsune Miku/ASUS_ROG_STRIX_X870E_H_Hatsune_Miku_9.jpg\"]', '/src/assets/Product/Hardware/Mainboard/ASUS ROG STRIX X870E-H Hatsune Miku/ASUS_ROG_STRIX_X870E_H_Hatsune_Miku_1.jpg', 'ASUS', '{\"socket\": \"AMD Socket AM5 for AMD Ryzen™ 9000, 8000 and 7000 Series desktop processors\", \"formFactor\": \"ATX\", \"ramSlots\": \"4 khe (Tối đa 256GB)\", \"pciSlots\": \"1 x PCIe 5.0 x16 slot (supports x16 mode), 1 x PCIe 4.0 x16 slot (supports x8/x4 mode), 1 x PCIe 4.0 x16 slot (supports x4 mode)\", \"storageSlots\": \"4 x M.2 slot, 4 x SATA 6Gb/s ports\", \"chipset\": \"AMD X870E\", \"wifi\": \"WiFi 7\", \"specialEdition\": \"Hatsune Miku Limited Edition\", \"warranty\": \"36 months\"}', 13, 0.0, 0, 1, 1, '2025-12-04 05:18:08', '2025-12-05 06:29:15', 2),
(7, 'Mainboard ASUS ROG MAXIMUS Z790 HERO (LGA1700, DDR5, WiFi 7)', 'mainboard-asus-rog-maximus-z790-hero', 'Bo mạch chủ ASUS ROG MAXIMUS Z790 HERO cao cấp cho Intel Gen 14', 15990000.00, 14990000.00, 25, 0, 0, '[\"/src/assets/Product/Hardware/Mainboard/ASUS ROG Z790 HERO/ASUS_ROG_Z790_HERO_1.jpg\"]', '/src/assets/Product/Hardware/Mainboard/ASUS ROG Z790 HERO/ASUS_ROG_Z790_HERO_1.jpg', 'ASUS', '{\"socket\": \"LGA1700\", \"chipset\": \"Intel Z790\", \"formFactor\": \"ATX\", \"ramSlots\": \"4 x DDR5 (Max 192GB)\", \"ramSpeed\": \"Up to DDR5-7800+\", \"pciSlots\": \"1x PCIe 5.0 x16 , 1x PCIe 4.0 x16\", \"m2Slots\": \"5x M.2\", \"wifi\": \"WiFi 7\", \"warranty\": \"36 months\"}', 13, 0.0, 0, 1, 1, '2025-12-04 05:18:08', '2025-12-05 06:29:15', 2),
(8, 'CPU Intel Core Ultra 9 285K (Up to 5.7GHz, 24 Cores - 24 Threads, 36MB Cache, Arrow Lake-S)', 'cpu-intel-core-ultra-9-285k-up-to-5-7ghz-24-nhan-24-luong-36mb-cache-arrow-lake-s', 'Bộ vi xử lý Intel Core Ultra 9 thế hệ mới với kiến trúc Arrow Lake-S', 17699000.00, 16190000.00, 50, 0, 0, '[\"/src/assets/Product/Hardware/CPU/Intel Core Ultra 9 285K/Intel_Core_Ultra_9_285K_1.jpg\", \"/src/assets/Product/Hardware/CPU/Intel Core Ultra 9 285K/Intel_Core_Ultra_9_285K_2.jpg\"]', '/src/assets/Product/Hardware/CPU/Intel Core Ultra 9 285K/Intel_Core_Ultra_9_285K_1.jpg', 'Intel', '{\"model\": \"Intel Core Ultra 9 285K\", \"cores\": \"24 Cores (8P-Core + 16E-Core)\", \"threads\": \"24 Threads\", \"socket\": \"LGA 1851\", \"boostClockPCore\": \"5.7 GHz\", \"boostClockECore\": \"4.6 GHz\", \"cache\": \"36MB\", \"tdp\": \"125W\", \"architecture\": \"Arrow Lake-S\", \"warranty\": \"36 months\"}', 12, 0.0, 0, 1, 1, '2025-12-04 05:18:08', '2025-12-05 06:29:15', 2),
(9, 'CPU AMD Ryzen 9 7950X3D (16 Core 32 Thread, Up to 5.7GHz, 144MB Cache)', 'cpu-amd-ryzen-9-7950x3d', 'CPU AMD Ryzen 9 7950X3D với công nghệ 3D V-Cache mạnh mẽ cho gaming và workstation', 15990000.00, 14990000.00, 35, 0, 0, '[\"/src/assets/Product/Hardware/CPU/AMD Ryzen 9 7950X3D/AMD_Ryzen_9_7950X3D_1.jpg\", \"/src/assets/Product/Hardware/CPU/AMD Ryzen 9 7950X3D/AMD_Ryzen_9_7950X3D_2.jpg\"]', '/src/assets/Product/Hardware/CPU/AMD Ryzen 9 7950X3D/AMD_Ryzen_9_7950X3D_1.jpg', 'AMD', '{\"model\": \"Ryzen 9 7950X3D\", \"cores\": \"16\", \"threads\": \"32\", \"socket\": \"AM5\", \"baseClock\": \"4.2 GHz\", \"boostClock\": \"5.7 GHz\", \"cache\": \"144MB\", \"tdp\": \"120W\", \"warranty\": \"36 months\"}', 12, 0.0, 0, 1, 1, '2025-12-04 05:18:08', '2025-12-05 06:29:15', 2),
(10, 'RAM Corsair Vengeance RGB 32GB (2x16GB) DDR5 5600MHz', 'ram-corsair-vengeance-rgb-32gb-ddr5-5600', 'RAM Corsair Vengeance RGB DDR5 5600MHz với RGB Lighting', 3990000.00, 3690000.00, 90, 0, 0, '[\"/src/assets/Product/Hardware/RAM/Corsair Vengeance RGB/Corsair_Vengeance_RGB_1.jpg\"]', '/src/assets/Product/Hardware/RAM/Corsair Vengeance RGB/Corsair_Vengeance_RGB_1.jpg', 'Corsair', '{\"capacity\": \"32GB (2x16GB)\", \"type\": \"DDR5\", \"speed\": \"5600MHz\", \"latency\": \"CL36-36-36-76\", \"voltage\": \"1.25V\", \"rgb\": \"Yes\", \"warranty\": \"Lifetime\"}', 14, 0.0, 0, 1, 1, '2025-12-04 05:18:08', '2025-12-05 06:29:15', 2),
(11, 'RAM Kingston Fury Beast 16GB (2x8GB) DDR4 3200MHz', 'ram-kingston-fury-beast-16gb-ddr4-3200', 'RAM Kingston Fury Beast DDR4 3200MHz giá tốt cho PC Gaming', 1690000.00, 1590000.00, 120, 0, 0, '[\"/src/assets/Product/Hardware/RAM/Kingston Fury Beast/Kingston_Fury_Beast_1.jpg\"]', '/src/assets/Product/Hardware/RAM/Kingston Fury Beast/Kingston_Fury_Beast_1.jpg', 'Kingston', '{\"capacity\": \"16GB (2x8GB)\", \"type\": \"DDR4\", \"speed\": \"3200MHz\", \"latency\": \"CL16\", \"voltage\": \"1.35V\", \"rgb\": \"No\", \"warranty\": \"Lifetime\"}', 14, 0.0, 0, 0, 1, '2025-12-04 05:18:08', '2025-12-05 06:29:15', 2),
(12, 'SSD Samsung 990 PRO 2TB M.2 NVMe PCIe Gen4 x4', 'ssd-samsung-990-pro-2tb-m2-nvme', 'Ổ cứng SSD Samsung 990 PRO 2TB tốc độ đọc/ghi cực nhanh', 5990000.00, 5490000.00, 60, 0, 0, '[\"/src/assets/Product/Hardware/SSD/Samsung 990 PRO/Samsung_990_PRO_1.jpg\"]', '/src/assets/Product/Hardware/SSD/Samsung 990 PRO/Samsung_990_PRO_1.jpg', 'Samsung', '{\"capacity\": \"2TB\", \"interface\": \"M.2 NVMe PCIe Gen4 x4\", \"formFactor\": \"M.2 2280\", \"readSpeed\": \"7450 MB/s\", \"writeSpeed\": \"6900 MB/s\", \"tbw\": \"1200 TBW\", \"warranty\": \"60 months\"}', 16, 0.0, 0, 1, 1, '2025-12-04 05:18:08', '2025-12-05 06:29:15', 2),
(13, 'Tản nhiệt nước NZXT Kraken Elite 360 RGB (360mm AIO)', 'cooling-nzxt-kraken-elite-360-rgb', 'Tản nhiệt nước NZXT Kraken Elite 360 với màn hình LCD 2.36 inch', 7990000.00, 7490000.00, 35, 0, 0, '[\"/src/assets/Product/Hardware/Cooling/NZXT Kraken Elite 360/NZXT_Kraken_Elite_360_1.jpg\"]', '/src/assets/Product/Hardware/Cooling/NZXT Kraken Elite 360/NZXT_Kraken_Elite_360_1.jpg', 'NZXT', '{\"type\": \"AIO Liquid Cooling\", \"radiatorSize\": \"360mm\", \"fanSize\": \"3x 120mm RGB\", \"lcdScreen\": \"2.36 inch\", \"socket\": \"Intel LGA1700/1200/1151, AMD AM5/AM4\", \"warranty\": \"72 months\"}', 17, 0.0, 0, 1, 1, '2025-12-04 05:18:08', '2025-12-05 06:29:15', 2),
(14, 'Case Fractal Design Torrent (E-ATX, Mid Tower, High Airflow)', 'case-fractal-design-torrent-eatx', 'Vỏ case Fractal Design Torrent với luồng khí mạnh mẽ', 5490000.00, 4990000.00, 35, 0, 0, '[\"/src/assets/Product/Hardware/Case/Fractal Torrent/Fractal_Torrent_1.jpg\"]', '/src/assets/Product/Hardware/Case/Fractal Torrent/Fractal_Torrent_1.jpg', 'Fractal Design', '{\"formFactor\": \"Mid Tower E-ATX\", \"material\": \"Steel + Tempered Glass\", \"includedFans\": \"2x 180mm RGB\", \"fanSupport\": \"Front 2x180mm or 3x140mm\", \"radiatorSupport\": \"Top/Bottom 360mm\", \"maxGpuLength\": \"461mm\", \"maxCpuCoolerHeight\": \"188mm\", \"warranty\": \"24 months\"}', 18, 0.0, 0, 1, 1, '2025-12-04 05:18:08', '2025-12-05 06:29:15', 2),
(15, 'PSU MSI MAG A850GL 850W 80 Plus Gold Full Modular', 'psu-msi-mag-a850gl-850w-80-plus-gold', 'Nguồn MSI MAG A850GL 850W 80 Plus Gold PCIe 5.0 Ready', 3490000.00, 3290000.00, 55, 0, 0, '[\"/src/assets/Product/Hardware/PSU/MSI MAG A850GL/MSI_MAG_A850GL_1.jpg\"]', '/src/assets/Product/Hardware/PSU/MSI MAG A850GL/MSI_MAG_A850GL_1.jpg', 'MSI', '{\"wattage\": \"850W\", \"efficiency\": \"80 Plus Gold\", \"modular\": \"Full Modular\", \"pcie50\": \"Yes\", \"pcieCable\": \"4x 8-pin\", \"fanSize\": \"135mm\", \"warranty\": \"120 months\"}', 19, 0.0, 0, 0, 1, '2025-12-04 05:18:08', '2025-12-05 06:29:15', 2),
(16, 'Sony PlayStation 5 Pro 2TB (CFI-7000 Series)', 'sony-playstation-5-pro-2tb-cfi-7000', 'Console PS5 Pro với GPU nâng cấp, 2TB SSD, hỗ trợ 8K gaming', 23990000.00, 22490000.00, 25, 0, 0, '[\"/src/assets/Product/Gaming-Gear/Console/PS5 Pro/PS5_Pro_1.jpg\", \"/src/assets/Product/Gaming-Gear/Console/PS5 Pro/PS5_Pro_2.jpg\", \"/src/assets/Product/Gaming-Gear/Console/PS5 Pro/PS5_Pro_3.jpg\", \"/src/assets/Product/Gaming-Gear/Console/PS5 Pro/PS5_Pro_4.jpg\"]', '/src/assets/Product/Gaming-Gear/Console/PS5 Pro/PS5_Pro_1.jpg', 'Sony', '{\"cpu\": \"AMD Zen 2 8-core (Enhanced)\", \"gpu\": \"AMD RDNA 3 (16.7 TFLOPS)\", \"ram\": \"16GB GDDR6\", \"storage\": \"2TB SSD\", \"resolution\": \"4K/8K\", \"fps\": \"Up to 120fps\", \"rayTracing\": \"Yes\", \"warranty\": \"12 months\"}', 8, 0.0, 0, 1, 1, '2025-12-04 05:18:08', '2025-12-05 06:29:15', 2),
(17, 'Microsoft Xbox Series X 1TB (Carbon Black)', 'microsoft-xbox-series-x-1tb-carbon-black', 'Console Xbox Series X thế hệ mới với 1TB SSD, hỗ trợ 4K 120fps', 13990000.00, 12990000.00, 30, 0, 0, '[\"/src/assets/Product/Gaming-Gear/Console/Xbox Series X/Xbox_Series_X_1.jpg\", \"/src/assets/Product/Gaming-Gear/Console/Xbox Series X/Xbox_Series_X_2.jpg\"]', '/src/assets/Product/Gaming-Gear/Console/Xbox Series X/Xbox_Series_X_1.jpg', 'Microsoft', '{\"cpu\": \"AMD Zen 2 8-core 3.8GHz\", \"gpu\": \"AMD RDNA 2 (12 TFLOPS)\", \"ram\": \"16GB GDDR6\", \"storage\": \"1TB NVMe SSD\", \"resolution\": \"4K\", \"fps\": \"Up to 120fps\", \"rayTracing\": \"Yes\", \"warranty\": \"12 months\"}', 8, 0.0, 0, 1, 1, '2025-12-04 05:18:08', '2025-12-05 06:29:15', 2),
(18, 'Nintendo Switch OLED Model (White)', 'nintendo-switch-oled-model-white', 'Nintendo Switch OLED với màn hình 7-inch OLED, 64GB storage', 8990000.00, 8490000.00, 40, 0, 0, '[\"/src/assets/Product/Gaming-Gear/Console/Switch OLED/Switch_OLED_1.jpg\", \"/src/assets/Product/Gaming-Gear/Console/Switch OLED/Switch_OLED_2.jpg\"]', '/src/assets/Product/Gaming-Gear/Console/Switch OLED/Switch_OLED_1.jpg', 'Nintendo', '{\"screen\": \"7 inch OLED (1280x720)\", \"cpu\": \"NVIDIA Custom Tegra\", \"storage\": \"64GB\", \"batteryLife\": \"4.5 - 9 hours\", \"modes\": \"TV/Tabletop/Handheld\", \"tvResolution\": \"1080p\", \"warranty\": \"12 months\"}', 8, 0.0, 0, 1, 1, '2025-12-04 05:18:08', '2025-12-05 06:29:15', 2),
(19, 'Steam Deck OLED 1TB', 'steam-deck-oled-1tb', 'Handheld gaming PC Steam Deck OLED với màn hình HDR', 16990000.00, 15990000.00, 20, 0, 0, '[\"/src/assets/Product/Gaming-Gear/Console/Steam Deck OLED/Steam_Deck_OLED_1.jpg\", \"/src/assets/Product/Gaming-Gear/Console/Steam Deck OLED/Steam_Deck_OLED_2.jpg\"]', '/src/assets/Product/Gaming-Gear/Console/Steam Deck OLED/Steam_Deck_OLED_1.jpg', 'Valve', '{\"screen\": \"7.4 inch HDR OLED (1280x800)\", \"cpu\": \"AMD APU Zen 2 4-core\", \"gpu\": \"AMD RDNA 2 (8 CUs)\", \"ram\": \"16GB LPDDR5\", \"storage\": \"1TB NVMe SSD\", \"batteryLife\": \"3 - 12 hours\", \"warranty\": \"12 months\"}', 8, 0.0, 0, 1, 1, '2025-12-04 05:18:08', '2025-12-05 06:29:15', 2),
(20, 'Logitech G Pro X TKL Rapid (Tactile Switch)', 'logitech-g-pro-x-tkl-rapid-tactile', 'Bàn phím cơ gaming TKL với GX Tactile switch, tốc độ phản hồi nhanh', 3990000.00, 3690000.00, 50, 0, 0, '[\"/src/assets/Product/Gaming-Gear/Keyboard/Logitech G Pro X TKL/Logitech_G_Pro_X_TKL_1.jpg\", \"/src/assets/Product/Gaming-Gear/Keyboard/Logitech G Pro X TKL/Logitech_G_Pro_X_TKL_2.jpg\"]', '/src/assets/Product/Gaming-Gear/Keyboard/Logitech G Pro X TKL/Logitech_G_Pro_X_TKL_1.jpg', 'Logitech', '{\"layout\": \"TKL (Tenkeyless)\", \"switch\": \"GX Tactile (Hot-swappable)\", \"connection\": \"USB-C / Wireless\", \"rgb\": \"LIGHTSYNC RGB\", \"pollingRate\": \"1000Hz\", \"keycaps\": \"Double-shot PBT\", \"warranty\": \"24 months\"}', 9, 0.0, 0, 1, 1, '2025-12-04 05:18:08', '2025-12-05 06:29:15', 2),
(21, 'Wooting 60HE+ (Hall Effect)', 'wooting-60he-plus-hall-effect', 'Bàn phím 60% với Hall Effect Analog switch, Rapid Trigger', 4790000.00, 4290000.00, 30, 0, 0, '[\"/src/assets/Product/Gaming-Gear/Keyboard/Wooting 60HE Plus/Wooting_60HE_Plus_1.jpg\", \"/src/assets/Product/Gaming-Gear/Keyboard/Wooting 60HE Plus/Wooting_60HE_Plus_2.jpg\"]', '/src/assets/Product/Gaming-Gear/Keyboard/Wooting 60HE Plus/Wooting_60HE_Plus_1.jpg', 'Wooting', '{\"layout\": \"60%\", \"switch\": \"Gateron Lekker (Hall Effect)\", \"connection\": \"USB-C\", \"rgb\": \"Per-key RGB\", \"pollingRate\": \"1000Hz\", \"rapidTrigger\": \"Yes (0.1mm)\", \"analogInput\": \"Yes\", \"warranty\": \"24 months\"}', 9, 0.0, 0, 1, 1, '2025-12-04 05:18:08', '2025-12-05 06:29:15', 2),
(22, 'Finalmouse UltralightX (Starlight Pro)', 'finalmouse-ultralightx-starlight-pro', 'Chuột gaming siêu nhẹ 37g với magnesium alloy', 6990000.00, 6490000.00, 20, 0, 0, '[\"/src/assets/Product/Gaming-Gear/Mouse/Finalmouse UltralightX/Finalmouse_UltralightX_1.jpg\", \"/src/assets/Product/Gaming-Gear/Mouse/Finalmouse UltralightX/Finalmouse_UltralightX_2.jpg\"]', '/src/assets/Product/Gaming-Gear/Mouse/Finalmouse UltralightX/Finalmouse_UltralightX_1.jpg', 'Finalmouse', '{\"sensor\": \"Finalsensor\", \"dpi\": \"400-3200\", \"weight\": \"37g\", \"material\": \"Magnesium Alloy\", \"connection\": \"Wireless\", \"pollingRate\": \"8000Hz\", \"battery\": \"150+ hours\", \"warranty\": \"12 months\"}', 10, 0.0, 0, 1, 1, '2025-12-04 05:18:08', '2025-12-05 06:29:15', 2),
(23, 'Lamzu Atlantis Mini Pro (4K Wireless)', 'lamzu-atlantis-mini-pro-4k-wireless', 'Chuột gaming không dây nhỏ gọn với 4K polling rate', 2990000.00, 2690000.00, 45, 0, 0, '[\"/src/assets/Product/Gaming-Gear/Mouse/Lamzu Atlantis Mini Pro/Lamzu_Atlantis_Mini_Pro_1.jpg\", \"/src/assets/Product/Gaming-Gear/Mouse/Lamzu Atlantis Mini Pro/Lamzu_Atlantis_Mini_Pro_2.jpg\"]', '/src/assets/Product/Gaming-Gear/Mouse/Lamzu Atlantis Mini Pro/Lamzu_Atlantis_Mini_Pro_1.jpg', 'Lamzu', '{\"sensor\": \"PAW3395\", \"dpi\": \"100-26,000\", \"weight\": \"49g\", \"connection\": \"4K Wireless / Wired\", \"pollingRate\": \"4000Hz\", \"battery\": \"70 hours\", \"buttons\": \"5\", \"warranty\": \"12 months\"}', 10, 0.0, 0, 1, 1, '2025-12-04 05:18:08', '2025-12-05 06:29:15', 2),
(24, 'Audeze Maxwell Wireless (PC/PS)', 'audeze-maxwell-wireless-pc-ps', 'Tai nghe gaming audiophile với Planar Magnetic Driver 90mm', 9990000.00, 9490000.00, 20, 0, 0, '[\"/src/assets/Product/Gaming-Gear/Headset/Audeze Maxwell/Audeze_Maxwell_1.jpg\", \"/src/assets/Product/Gaming-Gear/Headset/Audeze Maxwell/Audeze_Maxwell_2.jpg\"]', '/src/assets/Product/Gaming-Gear/Headset/Audeze Maxwell/Audeze_Maxwell_1.jpg', 'Audeze', '{\"driver\": \"90mm Planar Magnetic\", \"frequency\": \"10Hz - 50kHz\", \"connection\": \"2.4GHz / Bluetooth / 3.5mm / USB-C\", \"microphone\": \"Detachable Broadcast-grade\", \"battery\": \"80+ hours\", \"dolbyAtmos\": \"Yes\", \"weight\": \"490g\", \"warranty\": \"24 months\"}', 11, 0.0, 0, 1, 1, '2025-12-04 05:18:08', '2025-12-05 06:29:15', 2),
(25, 'LG UltraGear 27GR95QE 27\" OLED 240Hz', 'lg-ultragear-27gr95qe-27-oled-240hz', 'Màn hình gaming OLED 27 inch QHD 240Hz với Anti-Glare Low Reflection', 19990000.00, 18490000.00, 30, 0, 0, '[\"/src/assets/Product/Monitor/Gaming-Monitor/LG UltraGear 27GR95QE/LG_27GR95QE_1.jpg\", \"/src/assets/Product/Monitor/Gaming-Monitor/LG UltraGear 27GR95QE/LG_27GR95QE_2.jpg\"]', '/src/assets/Product/Monitor/Gaming-Monitor/LG UltraGear 27GR95QE/LG_27GR95QE_1.jpg', 'LG', '{\"screenSize\": \"27 inch\", \"resolution\": \"2560x1440 (QHD)\", \"panelType\": \"OLED\", \"refreshRate\": \"240Hz\", \"responseTime\": \"0.03ms GTG\", \"hdr\": \"DisplayHDR True Black 400\", \"colorGamut\": \"98.5% DCI-P3\", \"connectivity\": \"HDMI 2.1 x2, DP 1.4, USB 3.0\", \"gsync\": \"NVIDIA G-SYNC Compatible\", \"warranty\": \"24 months\"}', 20, 0.0, 0, 1, 1, '2025-12-04 05:18:08', '2025-12-05 06:29:15', 2),
(26, 'ASUS VG279QM1A 27\" IPS 280Hz', 'asus-vg279qm1a-27-ips-280hz', 'Màn hình gaming IPS 27 inch Full HD 280Hz giá tốt', 7990000.00, 7490000.00, 45, 0, 0, '[\"/src/assets/Product/Monitor/Gaming-Monitor/ASUS VG279QM1A/ASUS_VG279QM1A_1.jpg\", \"/src/assets/Product/Monitor/Gaming-Monitor/ASUS VG279QM1A/ASUS_VG279QM1A_2.jpg\"]', '/src/assets/Product/Monitor/Gaming-Monitor/ASUS VG279QM1A/ASUS_VG279QM1A_1.jpg', 'ASUS', '{\"screenSize\": \"27 inch\", \"resolution\": \"1920x1080 (Full HD)\", \"panelType\": \"IPS\", \"refreshRate\": \"280Hz\", \"responseTime\": \"1ms GTG\", \"hdr\": \"HDR10\", \"colorGamut\": \"99% sRGB\", \"connectivity\": \"HDMI 2.0 x2, DP 1.2\", \"gsync\": \"G-SYNC Compatible / FreeSync Premium\", \"warranty\": \"36 months\"}', 20, 0.0, 0, 0, 1, '2025-12-04 05:18:08', '2025-12-05 06:29:15', 2),
(27, 'ASUS ProArt PA32UCR-K 32\" 4K HDR IPS', 'asus-proart-pa32ucr-k-32-4k-hdr-ips', 'Màn hình đồ họa chuyên nghiệp 32 inch 4K với độ chính xác màu Delta E < 1', 32990000.00, 30990000.00, 20, 0, 0, '[\"/src/assets/Product/Monitor/Professional-Monitor/ASUS ProArt PA32UCR-K/ASUS_PA32UCR_K_1.jpg\", \"/src/assets/Product/Monitor/Professional-Monitor/ASUS ProArt PA32UCR-K/ASUS_PA32UCR_K_2.jpg\"]', '/src/assets/Product/Monitor/Professional-Monitor/ASUS ProArt PA32UCR-K/ASUS_PA32UCR_K_1.jpg', 'ASUS', '{\"screenSize\": \"32 inch\", \"resolution\": \"3840x2160 (4K UHD)\", \"panelType\": \"IPS\", \"refreshRate\": \"60Hz\", \"colorAccuracy\": \"Delta E < 1\", \"colorGamut\": \"100% sRGB, 99% Adobe RGB, 98% DCI-P3\", \"hdr\": \"DisplayHDR 1000\", \"brightness\": \"1000 nits peak\", \"connectivity\": \"HDMI 2.0 x3, DP 1.4, USB-C 96W, Thunderbolt 3\", \"calibration\": \"Hardware Calibration, Calman Ready\", \"warranty\": \"36 months\"}', 21, 0.0, 0, 1, 1, '2025-12-04 05:18:08', '2025-12-05 06:29:15', 2);
(28, 'LG UltraFine 32UQ850V-W 32\" 4K Nano IPS', 'lg-ultrafine-32uq850v-w-32-4k-nano-ips', 'Màn hình đồ họa LG UltraFine 32 inch 4K với Nano IPS và Ergo Stand', 16990000.00, 15490000.00, 30, 0, 0, '[\"/src/assets/Product/Monitor/Professional-Monitor/LG UltraFine 32UQ850V/LG_32UQ850V_1.jpg\", \"/src/assets/Product/Monitor/Professional-Monitor/LG UltraFine 32UQ850V/LG_32UQ850V_2.jpg\"]', '/src/assets/Product/Monitor/Professional-Monitor/LG UltraFine 32UQ850V/LG_32UQ850V_1.jpg', 'LG', '{\"screenSize\": \"31.5 inch\", \"resolution\": \"3840x2160 (4K UHD)\", \"panelType\": \"Nano IPS\", \"refreshRate\": \"60Hz\", \"colorAccuracy\": \"Delta E < 2\", \"colorGamut\": \"98% DCI-P3\", \"hdr\": \"DisplayHDR 400\", \"brightness\": \"400 nits\", \"connectivity\": \"HDMI 2.0 x2, DP 1.4, USB-C 90W\", \"stand\": \"Ergo Stand (Height/Tilt/Swivel/Pivot)\", \"warranty\": \"36 months\"}', 21, 0.0, 0, 1, 1, '2025-12-04 05:18:08', '2025-12-05 06:29:15', 2),
(29, 'EIZO ColorEdge CG2700S 27\" WQHD IPS', 'eizo-coloredge-cg2700s-27-wqhd-ips', 'Màn hình chuyên nghiệp EIZO ColorEdge 27 inch WQHD cho color grading', 52990000.00, 49990000.00, 10, 0, 0, '[\"/src/assets/Product/Monitor/Professional-Monitor/EIZO CG2700S/EIZO_CG2700S_1.jpg\", \"/src/assets/Product/Monitor/Professional-Monitor/EIZO CG2700S/EIZO_CG2700S_2.jpg\"]', '/src/assets/Product/Monitor/Professional-Monitor/EIZO CG2700S/EIZO_CG2700S_1.jpg', 'EIZO', '{\"screenSize\": \"27 inch\", \"resolution\": \"2560x1440 (WQHD)\", \"panelType\": \"IPS\", \"refreshRate\": \"60Hz\", \"colorAccuracy\": \"Delta E < 0.5\", \"colorGamut\": \"100% sRGB, 99% Adobe RGB, 98% DCI-P3\", \"hdr\": \"HLG / PQ\", \"brightness\": \"500 nits\", \"bitDepth\": \"10-bit (True)\", \"connectivity\": \"HDMI 2.0 x2, DP 1.4, USB-C 94W\", \"calibration\": \"Built-in Calibration Sensor\", \"warranty\": \"60 months\"}', 21, 0.0, 0, 1, 1, '2025-12-04 05:18:08', '2025-12-05 06:29:15', 2),
(30, 'Dell P2723QE 27\" 4K USB-C Hub Monitor', 'dell-p2723qe-27-4k-usb-c-hub-monitor', 'Màn hình văn phòng Dell 27 inch 4K với USB-C Hub tích hợp', 11990000.00, 10990000.00, 40, 0, 0, '[\"/src/assets/Product/Monitor/Office-Monitor/Dell P2723QE/Dell_P2723QE_1.jpg\", \"/src/assets/Product/Monitor/Office-Monitor/Dell P2723QE/Dell_P2723QE_2.jpg\"]', '/src/assets/Product/Monitor/Office-Monitor/Dell P2723QE/Dell_P2723QE_1.jpg', 'Dell', '{\"screenSize\": \"27 inch\", \"resolution\": \"3840x2160 (4K UHD)\", \"panelType\": \"IPS\", \"refreshRate\": \"60Hz\", \"responseTime\": \"5ms\", \"colorGamut\": \"99% sRGB\", \"brightness\": \"350 nits\", \"connectivity\": \"HDMI 1.4, DP 1.4, USB-C 90W, RJ45, USB 3.2 Hub\", \"features\": \"ComfortView Plus (Low Blue Light)\", \"warranty\": \"36 months\"}', 22, 0.0, 0, 1, 1, '2025-12-04 05:18:08', '2025-12-05 06:29:15', 2),
(31, 'ASUS ProArt PA278QV 27\" WQHD IPS', 'asus-proart-pa278qv-27-wqhd-ips', 'Màn hình văn phòng ASUS ProArt 27 inch WQHD với factory calibration', 7990000.00, 7490000.00, 55, 0, 0, '[\"/src/assets/Product/Monitor/Office-Monitor/ASUS PA278QV/ASUS_PA278QV_1.jpg\", \"/src/assets/Product/Monitor/Office-Monitor/ASUS PA278QV/ASUS_PA278QV_2.jpg\"]', '/src/assets/Product/Monitor/Office-Monitor/ASUS PA278QV/ASUS_PA278QV_1.jpg', 'ASUS', '{\"screenSize\": \"27 inch\", \"resolution\": \"2560x1440 (WQHD)\", \"panelType\": \"IPS\", \"refreshRate\": \"75Hz\", \"responseTime\": \"5ms\", \"colorAccuracy\": \"Delta E < 2\", \"colorGamut\": \"100% sRGB, 100% Rec.709\", \"brightness\": \"350 nits\", \"connectivity\": \"HDMI 1.4, DP 1.2, Mini DP, USB Hub\", \"features\": \"Factory Calibrated, ProArt Palette\", \"warranty\": \"36 months\"}', 22, 0.0, 0, 1, 1, '2025-12-04 05:18:08', '2025-12-05 06:29:15', 2),
(32, 'ViewSonic VP16-OLED 15.6\" 4K OLED', 'viewsonic-vp16-oled-15-6-4k-oled', 'Màn hình di động ViewSonic VP16-OLED 15.6 inch 4K cho đồ họa', 14990000.00, 13990000.00, 25, 0, 0, '[\"/src/assets/Product/Monitor/Portable-Monitor/ViewSonic VP16-OLED/ViewSonic_VP16_OLED_1.jpg\", \"/src/assets/Product/Monitor/Portable-Monitor/ViewSonic VP16-OLED/ViewSonic_VP16_OLED_2.jpg\"]', '/src/assets/Product/Monitor/Portable-Monitor/ViewSonic VP16-OLED/ViewSonic_VP16_OLED_1.jpg', 'ViewSonic', '{\"screenSize\": \"15.6 inch\", \"resolution\": \"3840x2160 (4K UHD)\", \"panelType\": \"OLED\", \"refreshRate\": \"60Hz\", \"responseTime\": \"1ms\", \"colorAccuracy\": \"Delta E < 2\", \"colorGamut\": \"100% DCI-P3, 100% Adobe RGB\", \"hdr\": \"DisplayHDR True Black 400\", \"brightness\": \"400 nits\", \"weight\": \"760g\", \"connectivity\": \"USB-C x2, Mini HDMI\", \"warranty\": \"36 months\"}', 23, 0.0, 0, 1, 1, '2025-12-04 05:18:08', '2025-12-05 06:29:15', 2),
(33, 'INNOCN 15K1F 15.6\" OLED 144Hz', 'innocn-15k1f-15-6-oled-144hz', 'Màn hình di động gaming INNOCN 15.6 inch OLED 144Hz', 8990000.00, 7990000.00, 40, 0, 0, '[\"/src/assets/Product/Monitor/Portable-Monitor/INNOCN 15K1F/INNOCN_15K1F_1.jpg\", \"/src/assets/Product/Monitor/Portable-Monitor/INNOCN 15K1F/INNOCN_15K1F_2.jpg\"]', '/src/assets/Product/Monitor/Portable-Monitor/INNOCN 15K1F/INNOCN_15K1F_1.jpg', 'INNOCN', '{\"screenSize\": \"15.6 inch\", \"resolution\": \"1920x1080 (Full HD)\", \"panelType\": \"OLED\", \"refreshRate\": \"144Hz\", \"responseTime\": \"1ms\", \"colorGamut\": \"100% DCI-P3\", \"hdr\": \"DisplayHDR True Black 400\", \"brightness\": \"400 nits\", \"weight\": \"620g\", \"connectivity\": \"USB-C x2, Mini HDMI\", \"features\": \"AMD FreeSync, Built-in Battery (4h)\", \"warranty\": \"24 months\"}', 23, 0.0, 0, 1, 1, '2025-12-04 05:18:08', '2025-12-05 06:29:15', 2),
(34, 'PC Office Intel Core i5-13400 - 16GB RAM - 512GB SSD', 'pc-office-intel-core-i5-13400-16gb-ram-512gb-ssd', 'PC văn phòng hiệu năng cao với Intel Core i5 thế hệ 13', 12990000.00, 11990000.00, 47, 0, 0, '[\"/src/assets/Product/PC/PC-Office/PC Office i5-13400/PC_Office_i5_13400_1.jpg\", \"/src/assets/Product/PC/PC-Office/PC Office i5-13400/PC_Office_i5_13400_2.jpg\"]', '/src/assets/Product/PC/PC-Office/PC Office i5-13400/PC_Office_i5_13400_1.jpg', 'Intel', '{\"cpu\": \"Intel Core i5-13400 (10 cores, 16 threads, Up to 4.6GHz)\", \"mainboard\": \"ASUS PRIME H610M-E DDR4\", \"ram\": \"Kingston Fury Beast 16GB (2x8GB) DDR4 3200MHz\", \"ssd\": \"Kingston NV2 512GB M.2 NVMe PCIe 4.0\", \"psu\": \"FSP HV PRO 450W 80 Plus\", \"case\": \"Deepcool MATREXX 40 3FS\", \"cooling\": \"Intel Stock Cooler\", \"os\": \"Windows 11 Pro (Activated)\", \"warranty\": \"24 months\"}', 7, 0.0, 0, 1, 1, '2025-12-04 05:18:09', '2025-12-07 14:38:32', 2),
(35, 'PC Office AMD Ryzen 5 5600G - 16GB RAM - 512GB SSD', 'pc-office-amd-ryzen-5-5600g-16gb-ram-512gb-ssd', 'PC văn phòng AMD với đồ họa tích hợp Radeon Vega', 10990000.00, 9990000.00, 58, 0, 0, '[\"/src/assets/Product/PC/PC-Office/PC Office Ryzen 5 5600G/PC_Office_R5_5600G_1.jpg\", \"/src/assets/Product/PC/PC-Office/PC Office Ryzen 5 5600G/PC_Office_R5_5600G_2.jpg\"]', '/src/assets/Product/PC/PC-Office/PC Office Ryzen 5 5600G/PC_Office_R5_5600G_1.jpg', 'AMD', '{\"cpu\": \"AMD Ryzen 5 5600G (6 cores, 12 threads, Up to 4.4GHz)\", \"gpu\": \"AMD Radeon Graphics (Integrated)\", \"mainboard\": \"Gigabyte A520M DS3H\", \"ram\": \"TEAMGROUP T-Force Vulcan Z 16GB (2x8GB) DDR4 3200MHz\", \"ssd\": \"HIKSEMI WAVE 512GB M.2 NVMe\", \"psu\": \"FSP HV PRO 450W 80 Plus\", \"case\": \"Xigmatek NYX 3F\", \"cooling\": \"AMD Wraith Stealth Cooler\", \"os\": \"Windows 11 Home (Activated)\", \"warranty\": \"24 months\"}', 7, 0.0, 0, 1, 1, '2025-12-04 05:18:09', '2025-12-08 00:54:54', 2);
-- --------------------------------------------------------

--
-- Table structure for table `product_comparisons`
--

CREATE TABLE `product_comparisons` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `productIds` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`productIds`)),
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_price_history`
--

CREATE TABLE `product_price_history` (
  `id` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `oldPrice` decimal(12,2) NOT NULL,
  `newPrice` decimal(12,2) NOT NULL,
  `oldSalePrice` decimal(12,2) DEFAULT NULL,
  `newSalePrice` decimal(12,2) DEFAULT NULL,
  `changedBy` int(11) DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `comment` text DEFAULT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `isApproved` tinyint(1) DEFAULT 1,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Triggers `reviews`
--
DELIMITER $$
CREATE TRIGGER `update_product_rating_after_review_delete` AFTER DELETE ON `reviews` FOR EACH ROW BEGIN
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
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_product_rating_after_review_insert` AFTER INSERT ON `reviews` FOR EACH ROW BEGIN
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
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_product_rating_after_review_update` AFTER UPDATE ON `reviews` FOR EACH ROW BEGIN
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
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullName` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `dateOfBirth` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `avatar` varchar(255) DEFAULT 'default-avatar.png',
  `role` enum('user','admin') DEFAULT 'user',
  `isActive` tinyint(1) DEFAULT 1,
  `isEmailVerified` tinyint(1) DEFAULT 0,
  `isPhoneVerified` tinyint(1) DEFAULT 0,
  `isVerified` tinyint(1) DEFAULT 0,
  `lastLoginAt` timestamp NULL DEFAULT NULL,
  `otp` varchar(6) DEFAULT NULL,
  `otpExpiry` timestamp NULL DEFAULT NULL,
  `refreshToken` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullName`, `email`, `password`, `phone`, `address`, `dateOfBirth`, `gender`, `avatar`, `role`, `isActive`, `isEmailVerified`, `isPhoneVerified`, `isVerified`, `lastLoginAt`, `otp`, `otpExpiry`, `refreshToken`, `createdAt`, `updatedAt`) VALUES
(1, 'Admin HKTStore', 'admin@hktstore.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0123456789', NULL, NULL, NULL, 'default-avatar.png', 'admin', 1, 1, 0, 1, NULL, NULL, NULL, NULL, '2025-12-04 05:18:07', '2025-12-04 05:18:07'),
(2, 'Austrian Artist', 'artist1933@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0111222333', NULL, NULL, NULL, 'default-avatar.png', 'user', 1, 1, 0, 1, NULL, NULL, NULL, NULL, '2025-12-04 05:18:07', '2025-12-04 05:18:07'),
(3, 'Albert Einstein', 'einstein@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0222333444', NULL, NULL, NULL, 'default-avatar.png', 'user', 1, 1, 0, 1, NULL, NULL, NULL, NULL, '2025-12-04 05:18:07', '2025-12-04 05:18:07'),
(4, 'Elon Musk', 'elon@spacex.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0333444555', NULL, NULL, NULL, 'default-avatar.png', 'user', 1, 1, 0, 1, NULL, NULL, NULL, NULL, '2025-12-04 05:18:07', '2025-12-04 05:18:07'),
(5, 'Soltuné Montepré', 'soltune@chateau.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0444555666', NULL, NULL, NULL, 'default-avatar.png', 'user', 1, 1, 0, 1, NULL, NULL, NULL, NULL, '2025-12-04 05:18:07', '2025-12-04 05:18:07'),
(6, 'Vanga', 'vanga@prophecy.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0555666777', NULL, NULL, NULL, 'default-avatar.png', 'user', 1, 1, 0, 1, NULL, NULL, NULL, NULL, '2025-12-04 05:18:07', '2025-12-04 05:18:07'),
(7, 'Gia Cát Lượng', 'kongming@shu.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0666777888', NULL, NULL, NULL, 'default-avatar.png', 'user', 1, 1, 0, 1, NULL, NULL, NULL, NULL, '2025-12-04 05:18:07', '2025-12-04 05:18:07'),
(8, 'RiyaKi wa Renako ga DAISUKI', 'kimthonglord@gmail.com', '$2b$10$t8uE8eWU4FLfyC1gbL/zrOAOqb4asoAuZGnHP9D9r2IqSRsavenu2', '0912345678', NULL, NULL, NULL, 'default-avatar.png', 'admin', 1, 0, 0, 1, '2025-12-08 01:08:23', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzY1MTU2MTAzLCJleHAiOjE3NjU3NjA5MDN9.8Fpmu_k9TRNuZ98jEyTDLvoT2ggyRJ32qSU176Wj5Io', '2025-12-04 05:23:35', '2025-12-08 01:08:23'),
(11, 'Administrator', 'admin1@hktstore.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.LLzXQNMWZy1NwYQ6CS', '0123456789', NULL, NULL, NULL, 'default-avatar.png', 'user', 1, 1, 1, 1, NULL, '586176', '2025-12-04 18:15:31', NULL, '2025-12-04 18:02:22', '2025-12-05 07:46:04'),
(12, 'Đinh Văn Sang', 'doilakho69@gmail.com', '$2b$10$BVq81KuBkGUzPn/nxhqxPeZx15bBw2s0GNHyGLA.B/ROcH1btrAoy', NULL, NULL, NULL, NULL, 'default-avatar.png', 'user', 1, 0, 0, 1, '2025-12-08 00:44:34', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImlhdCI6MTc2NTE1NDY3NCwiZXhwIjoxNzY1NzU5NDc0fQ.kuvHSrCYKYxVOLHU_9ytCfGSA-xUlRjD8LcdEQMyxkA', '2025-12-05 15:31:28', '2025-12-08 00:44:34');

-- --------------------------------------------------------

--
-- Table structure for table `user_addresses`
--

CREATE TABLE `user_addresses` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `fullName` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `province` varchar(100) NOT NULL,
  `district` varchar(100) NOT NULL,
  `ward` varchar(100) NOT NULL,
  `addressDetail` text NOT NULL,
  `isDefault` tinyint(1) DEFAULT 0,
  `addressType` enum('home','office','other') DEFAULT 'home',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vouchers`
--

CREATE TABLE `vouchers` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `discountType` enum('percentage','fixed') NOT NULL,
  `discountValue` decimal(12,2) NOT NULL,
  `minOrderAmount` decimal(12,2) DEFAULT 0.00,
  `maxDiscountAmount` decimal(12,2) DEFAULT NULL,
  `usageLimit` int(11) DEFAULT NULL,
  `usedCount` int(11) DEFAULT 0,
  `categoryId` int(11) DEFAULT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vouchers`
--

INSERT INTO `vouchers` (`id`, `code`, `description`, `discountType`, `discountValue`, `minOrderAmount`, `maxDiscountAmount`, `usageLimit`, `usedCount`, `categoryId`, `startDate`, `endDate`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 'WELCOME10', 'Giảm 10% cho đơn hàng đầu tiên', 'percentage', 10.00, 500000.00, 500000.00, 1000, 0, NULL, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 1, '2025-12-04 05:18:09', '2025-12-04 05:18:09'),
(2, 'GAMING50K', 'Giảm 50.000đ cho Gaming Gear', 'fixed', 50000.00, 1000000.00, NULL, 500, 0, NULL, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 1, '2025-12-04 05:18:09', '2025-12-04 05:18:09'),
(3, 'HARDWARE100K', 'Giảm 100.000đ cho linh kiện Hardware', 'fixed', 100000.00, 3000000.00, NULL, 300, 0, NULL, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 1, '2025-12-04 05:18:09', '2025-12-04 05:18:09'),
(4, 'MONITOR15', 'Giảm 15% cho Monitor', 'percentage', 15.00, 5000000.00, 2000000.00, 200, 0, NULL, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 1, '2025-12-04 05:18:09', '2025-12-04 05:18:09'),
(5, 'BLACKFRIDAY', 'Black Friday Sale - Giảm 20%', 'percentage', 20.00, 2000000.00, 3000000.00, 1000, 0, NULL, '2024-11-25 00:00:00', '2024-11-30 23:59:59', 1, '2025-12-04 05:18:09', '2025-12-04 05:18:09'),
(6, 'FREESHIP', 'Miễn phí vận chuyển cho đơn từ 500K', 'fixed', 30000.00, 500000.00, NULL, 2000, 0, NULL, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 1, '2025-12-04 05:18:09', '2025-12-04 05:18:09');

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

CREATE TABLE `wishlists` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userId` (`userId`),
  ADD KEY `idx_userId` (`userId`),
  ADD KEY `carts_user_id` (`userId`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_cart_product` (`cartId`,`productId`),
  ADD UNIQUE KEY `cart_items_cart_id_product_id` (`cartId`,`productId`),
  ADD KEY `idx_cartId` (`cartId`),
  ADD KEY `idx_productId` (`productId`),
  ADD KEY `cart_items_cart_id` (`cartId`),
  ADD KEY `cart_items_product_id` (`productId`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_slug` (`slug`),
  ADD KEY `idx_parentId` (`parentId`),
  ADD KEY `idx_isActive` (`isActive`),
  ADD KEY `categories_slug` (`slug`),
  ADD KEY `categories_parent_id` (`parentId`),
  ADD KEY `categories_is_active` (`isActive`),
  ADD KEY `idx_category_level` (`level`),
  ADD KEY `categories_level` (`level`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_userId` (`userId`),
  ADD KEY `idx_isRead` (`isRead`),
  ADD KEY `idx_createdAt` (`createdAt`),
  ADD KEY `notifications_user_id` (`userId`),
  ADD KEY `notifications_is_read` (`isRead`),
  ADD KEY `notifications_created_at` (`createdAt`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orderCode` (`orderCode`),
  ADD KEY `idx_orderCode` (`orderCode`),
  ADD KEY `idx_userId` (`userId`),
  ADD KEY `idx_orderStatus` (`orderStatus`),
  ADD KEY `idx_paymentStatus` (`paymentStatus`),
  ADD KEY `idx_createdAt` (`createdAt`),
  ADD KEY `idx_voucherCode` (`voucherCode`),
  ADD KEY `orders_order_code` (`orderCode`),
  ADD KEY `orders_user_id` (`userId`),
  ADD KEY `orders_order_status` (`orderStatus`),
  ADD KEY `orders_payment_status` (`paymentStatus`),
  ADD KEY `orders_created_at` (`createdAt`),
  ADD KEY `orders_voucher_code` (`voucherCode`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_orderId` (`orderId`),
  ADD KEY `idx_productId` (`productId`),
  ADD KEY `order_items_order_id` (`orderId`),
  ADD KEY `order_items_product_id` (`productId`);

--
-- Indexes for table `otp_verifications`
--
ALTER TABLE `otp_verifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_otp` (`otp`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_expiresAt` (`expiresAt`),
  ADD KEY `fk_otp_user` (`userId`),
  ADD KEY `otp_verifications_email` (`email`),
  ADD KEY `otp_verifications_otp` (`otp`),
  ADD KEY `otp_verifications_type` (`type`),
  ADD KEY `otp_verifications_expires_at` (`expiresAt`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_token` (`token`),
  ADD KEY `idx_userId` (`userId`),
  ADD KEY `idx_expiresAt` (`expiresAt`),
  ADD KEY `password_reset_tokens_token` (`token`),
  ADD KEY `password_reset_tokens_user_id` (`userId`),
  ADD KEY `password_reset_tokens_expires_at` (`expiresAt`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_slug` (`slug`),
  ADD KEY `idx_categoryId` (`categoryId`),
  ADD KEY `idx_price` (`price`),
  ADD KEY `idx_rating` (`rating`),
  ADD KEY `idx_isFeatured` (`isFeatured`),
  ADD KEY `idx_isActive` (`isActive`),
  ADD KEY `idx_brand` (`brand`),
  ADD KEY `idx_saleCount` (`saleCount`),
  ADD KEY `products_slug` (`slug`),
  ADD KEY `products_category_id` (`categoryId`),
  ADD KEY `products_price` (`price`),
  ADD KEY `products_rating` (`rating`),
  ADD KEY `products_is_featured` (`isFeatured`),
  ADD KEY `products_is_active` (`isActive`),
  ADD KEY `products_brand` (`brand`),
  ADD KEY `products_sale_count` (`saleCount`),
  ADD KEY `idx_product_category_level` (`categoryLevel`),
  ADD KEY `products_category_level` (`categoryLevel`);

--
-- Indexes for table `product_comparisons`
--
ALTER TABLE `product_comparisons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_userId` (`userId`),
  ADD KEY `product_comparisons_user_id` (`userId`);

--
-- Indexes for table `product_price_history`
--
ALTER TABLE `product_price_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_productId` (`productId`),
  ADD KEY `idx_createdAt` (`createdAt`),
  ADD KEY `fk_price_history_user` (`changedBy`),
  ADD KEY `product_price_history_product_id` (`productId`),
  ADD KEY `product_price_history_created_at` (`createdAt`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_product_review` (`userId`,`productId`),
  ADD UNIQUE KEY `reviews_user_id_product_id` (`userId`,`productId`),
  ADD KEY `idx_userId` (`userId`),
  ADD KEY `idx_productId` (`productId`),
  ADD KEY `idx_rating` (`rating`),
  ADD KEY `idx_isApproved` (`isApproved`),
  ADD KEY `reviews_user_id` (`userId`),
  ADD KEY `reviews_product_id` (`productId`),
  ADD KEY `reviews_rating` (`rating`),
  ADD KEY `reviews_is_approved` (`isApproved`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_role` (`role`),
  ADD KEY `idx_isActive` (`isActive`),
  ADD KEY `idx_isVerified` (`isVerified`),
  ADD KEY `users_role` (`role`),
  ADD KEY `users_is_active` (`isActive`),
  ADD KEY `users_is_verified` (`isVerified`);

--
-- Indexes for table `user_addresses`
--
ALTER TABLE `user_addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_userId` (`userId`),
  ADD KEY `idx_isDefault` (`isDefault`),
  ADD KEY `user_addresses_user_id` (`userId`),
  ADD KEY `user_addresses_is_default` (`isDefault`);

--
-- Indexes for table `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `idx_code` (`code`),
  ADD KEY `idx_categoryId` (`categoryId`),
  ADD KEY `idx_isActive` (`isActive`),
  ADD KEY `idx_dates` (`startDate`,`endDate`),
  ADD KEY `vouchers_code` (`code`),
  ADD KEY `vouchers_category_id` (`categoryId`),
  ADD KEY `vouchers_is_active` (`isActive`),
  ADD KEY `vouchers_start_date_end_date` (`startDate`,`endDate`);

--
-- Indexes for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_product_wishlist` (`userId`,`productId`),
  ADD UNIQUE KEY `wishlists_user_id_product_id` (`userId`,`productId`),
  ADD KEY `idx_userId` (`userId`),
  ADD KEY `idx_productId` (`productId`),
  ADD KEY `wishlists_user_id` (`userId`),
  ADD KEY `wishlists_product_id` (`productId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `otp_verifications`
--
ALTER TABLE `otp_verifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

--
-- AUTO_INCREMENT for table `product_comparisons`
--
ALTER TABLE `product_comparisons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_price_history`
--
ALTER TABLE `product_price_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `user_addresses`
--
ALTER TABLE `user_addresses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `wishlists`
--
ALTER TABLE `wishlists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `fk_cart_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `fk_cartitem_cart` FOREIGN KEY (`cartId`) REFERENCES `carts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cartitem_product` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `fk_category_parent` FOREIGN KEY (`parentId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notification_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_order_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_orderitem_order` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_orderitem_product` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `otp_verifications`
--
ALTER TABLE `otp_verifications`
  ADD CONSTRAINT `fk_otp_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD CONSTRAINT `fk_reset_token_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_product_category` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `product_comparisons`
--
ALTER TABLE `product_comparisons`
  ADD CONSTRAINT `fk_comparison_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product_price_history`
--
ALTER TABLE `product_price_history`
  ADD CONSTRAINT `fk_price_history_product` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_price_history_user` FOREIGN KEY (`changedBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `fk_review_product` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_review_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_addresses`
--
ALTER TABLE `user_addresses`
  ADD CONSTRAINT `fk_address_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `vouchers`
--
ALTER TABLE `vouchers`
  ADD CONSTRAINT `fk_voucher_category` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `fk_wishlist_product` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_wishlist_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

