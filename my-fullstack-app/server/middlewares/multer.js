import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Tạo thư mục uploads nếu chưa có
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình storage - lưu file tạm trước khi upload lên Cloudinary
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Tạo tên file unique: timestamp-random-originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

// Filter chỉ cho phép file ảnh
const imageFileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Chấp nhận file
    } else {
        cb(new Error('Chỉ chấp nhận file ảnh (JPG, PNG, WebP, GIF)'), false);
    }
};

// ========== UPLOAD SINGLE FILE ==========
// Field name là 'image' - frontend phải gửi file với key này
export const uploadSingle = multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Max 5MB
    }
}).single('image');

// ========== UPLOAD MULTIPLE FILES ==========
// Max 10 ảnh, field name là 'images'
export const uploadMultiple = multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
}).array('images', 10);

// ========== MIDDLEWARE XỬ LÝ LỖI MULTER ==========
export const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        // Lỗi từ Multer
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'Kích thước file không được vượt quá 5MB',
                error: true,
                success: false
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                message: 'Số lượng file không được vượt quá 10',
                error: true,
                success: false
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                message: 'Field name không đúng. Sử dụng "image" cho single hoặc "images" cho multiple',
                error: true,
                success: false
            });
        }
    }
    
    // Lỗi custom từ fileFilter
    if (error.message) {
        return res.status(400).json({
            message: error.message,
            error: true,
            success: false
        });
    }
    
    next(error);
};

export default multer({ storage, fileFilter: imageFileFilter });