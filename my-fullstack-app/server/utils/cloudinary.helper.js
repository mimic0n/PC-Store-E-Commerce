/**
 * Tạo thumbnail URL từ Cloudinary URL
 * @param {string} url - URL gốc từ Cloudinary
 * @param {number} width - Chiều rộng (default: 100)
 * @param {number} height - Chiều cao (default: 100)
 */
export function getCloudinaryThumbnail(url, width = 100, height = 100) {
    if (!url) return null;
    return url.replace('/upload/', `/upload/w_${width},h_${height},c_fill/`);
}

/**
 * Chuyển sang WebP format
 * @param {string} url - URL gốc từ Cloudinary
 */
export function getCloudinaryWebP(url) {
    if (!url) return null;
    return url.replace('/upload/', '/upload/f_webp,q_auto/');
}

/**
 * Tạo responsive image URLs
 * @param {string} url - URL gốc
 */
export function getResponsiveUrls(url) {
    if (!url) return null;
    
    return {
        thumbnail: getCloudinaryThumbnail(url, 100, 100),
        small: url.replace('/upload/', '/upload/w_300,h_300,c_fill/'),
        medium: url.replace('/upload/', '/upload/w_600,h_600,c_fill/'),
        large: url.replace('/upload/', '/upload/w_1200,h_1200,c_fill/'),
        webp: getCloudinaryWebP(url)
    };
}