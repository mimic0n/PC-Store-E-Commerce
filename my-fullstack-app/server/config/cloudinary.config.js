import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Lấy đường dẫn thư mục hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env từ thư mục server (đường dẫn tuyệt đối)
const envPath = path.resolve(__dirname, '../.env');
console.log(' Loading .env from:', envPath);

const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error(' Error loading .env file:', result.error);
} else {
    console.log(' .env file loaded successfully');
}

// Debug: In ra giá trị THỰC TẾ
console.log('========== CLOUDINARY DEBUG ==========');
console.log('CLOUDINARY_CLOUD_NAME:', `"${process.env.CLOUDINARY_CLOUD_NAME}"`);
console.log('CLOUDINARY_API_KEY:', `"${process.env.CLOUDINARY_API_KEY}"`);
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '"***HIDDEN***"' : '"undefined"');
console.log('======================================');

// Kiểm tra giá trị trước khi config
if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'undefined') {
    console.error('❌CLOUDINARY_CLOUD_NAME is not set properly!');
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

// Test kết nối Cloudinary
console.log('🔄 Testing Cloudinary connection...');
cloudinary.api.ping()
    .then(() => {
        console.log(' Cloudinary connection successful!');
    })
    .catch((error) => {
        console.error(' Cloudinary connection failed:', error.message);
    });

export default cloudinary;