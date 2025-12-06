import User from '../models/User.model.js';  
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendVerifyEmail from '../config/sendEmail.js';  
import sendEmail from '../config/emailService.js';
import VerificationEmail from '../utils/verifyEmailTemplate.js'; 
import generateAccessToken from '../utils/generateAccessToken.js';
import generateRefreshToken from '../utils/generateRefreshToken.js';
import { getResponsiveUrls } from '../utils/cloudinary.helper.js';
import cloudinary from '../config/cloudinary.config.js'; 
import fs from 'fs';


export async function resigterForUser(request, response) { 
    try {
        const { fullName, email, password } = request.body;
        
        if (!fullName || !email || !password) { 
            return response.status(400).json({
                message: 'Vui lòng điền đầy đủ thông tin',
                error: true,
                success: false
            });
        }

        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) { 
            return response.status(400).json({  
                message: 'Email đã được sử dụng, vui lòng sử dụng email khác',
                error: true,
                success: false
            });
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Xóa hash password thủ công vì model đã có hook tự động hash
        const newUser = await User.create({
            fullName: fullName,
            email: email,
            password: password,  // Hook sẽ tự hash
            otp: verifyCode,
            otpExpiry: new Date(Date.now() + 600000),  
        });

        // truyền tham số cho sendVerifyEmail
        const verifyEmail = await sendVerifyEmail(
            email,
            "Xác thực Email của bạn - HKTstore",
            "Xác thực Email",
            VerificationEmail(fullName, verifyCode)
        );

        console.log('Email verification result:', verifyEmail);

        // Tạo JWT token cho người dùng mới
        const token = jwt.sign(
            { email: newUser.email, id: newUser.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );

        return response.status(201).json({ 
            success: true,
            error: false,
            message: verifyEmail.success 
                ? 'Đăng ký thành công! Vui lòng kiểm tra email để lấy mã xác thực.'
                : 'Đăng ký thành công! Nhưng gửi email thất bại, vui lòng thử lại.',
            token: token,
            emailSent: verifyEmail.success
        });
    }
    catch (error) {
        console.error('Register error:', error);
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function verifyUserEmail(request, response) { 
    try {
        const { email, otp } = request.body
        
        if (!email || !otp) {
            return response.status(400).json({
                success: false,
                error: true,
                message: 'Vui lòng nhập email và mã OTP.'
            });
        }

        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return response.status(400).json({
                success: false,
                message: 'Không tìm thấy người dùng.'
            });
        }

        const isOTPValid = user.otp === otp;
        const isNotExpired = user.otpExpiry > new Date();
        
        if (isOTPValid && isNotExpired) { 
            user.isVerified = true;
            user.otp = null;
            user.otpExpiry = null;
            await user.save();
            return response.status(200).json({
                success: true,
                message: 'Xác thực email thành công!'
            });
        }

        else if (!isOTPValid) {
            return response.status(400).json({
                success: false,
                message: 'Mã OTP không hợp lệ hoặc đã hết hạn.'
            });
        }

        else if (!isNotExpired) {
            return response.status(400).json({
                success: false,
                message: 'Mã OTP đã hết hạn.'
            });
        }

        await user.update({
            isEmailVerified: true,
            otp: null,
            otpExpiry: null
        });

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Xác thực email thành công!'
        });
    }
    catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function LoginForUser(request, response) { 
    try {
        const { email, password } = request.body;

        if ( !email || !password) { 
            return response.status(400).json({
                message: 'Vui lòng điền đầy đủ thông tin',
                error: true,
                success: false
            });
        }

        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return response.status(400).json({
                message: 'Email chưa được đăng ký',
                error: true,
                success: false
            });
        }

        if (!user.isVerified) {
            return response.status(400).json({
                message: 'Email chưa được xác thực',
                error: true,
                success: false
            });
        }

        const checkPassword = await bcryptjs.compare(password, user.password);
        if (!checkPassword) { 
            return response.status(400).json({
                message: "Mật khẩu không đúng",
                error: true,
                success: false
            });
        }
        
        const accessToken = await generateAccessToken(user.id);
        const refreshToken = await generateRefreshToken(user.id);
        await user.update(
            { lastLoginAt: new Date() }
        );

        response.cookie('accessToken', accessToken, {
            httpOnly: true, // Không cho JavaScript truy cập
            secure: process.env.NODE_ENV === 'production', // HTTPS only trong production
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            // Chống CSRF
            // 'lax' cho phép redirect từ external sites (tiện cho dev)
            maxAge:  5* 60 * 1000  // 5 phút
        });

        response.cookie('refreshToken', refreshToken, {
            httpOnly: true, // Không cho JavaScript truy cập
            secure: process.env.NODE_ENV === 'production', // HTTPS only trong production
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            // Chống CSRF
            // 'lax' cho phép redirect từ external sites (tiện cho dev)
            maxAge: 7 * 24 * 60 * 60 * 1000  // 7 ngày
        });

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Đăng nhập thành công',
            data: {
                accessToken: accessToken,
                refreshToken: refreshToken,
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role
                }
            }
        })

    }
    catch (error) {
        console.error('Login error:', error);
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function LogoutForUser(request, response) {
    try {
        const userID = request.user.id;

        // Xoá refresh token trong database
        await User.update(
            { refreshToken: null },  
            { where: { id: userID } }  
        );

        const cookiesOption = {
            httpOnly: true, // Không cho JavaScript truy cập
            secure: process.env.NODE_ENV === 'production', // HTTPS only trong production
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            // Chống CSRF
            // 'lax' cho phép redirect từ external sites (tiện cho dev)
        }

        response.clearCookie('accessToken', cookiesOption); 
        response.clearCookie('refreshToken', cookiesOption);

        return response.status(200).json({
            message: 'Đăng xuất thành công',
            error: false,
            success: true
        });
    }
    catch (error) {
        console.error('Logout error:', error);
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function forgotPassword(request, response) {
    try {
        const { email } = request.body;

        // Validate email
        if (!email) {
            return response.status(400).json({
                message: 'Vui lòng nhập email',
                error: true,
                success: false
            });
        }

        // Kiểm tra user tồn tại
        const user = await User.findOne({ 
            where: { email: email }
        });

        if (!user) {
            return response.status(404).json({
                message: 'Email không tồn tại trong hệ thống',
                error: true,
                success: false
            });
        }

        // Kiểm tra tài khoản có active không
        if (!user.isActive) {
            return response.status(400).json({
                message: 'Tài khoản đã bị vô hiệu hóa',
                error: true,
                success: false
            });
        }

        // Tạo OTP 6 số
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // Hết hạn sau 10 phút

        // Lưu OTP vào database
        await user.update({
            otp: otp,
            otpExpiry: otpExpiry
        });

        // Gửi email chứa OTP
        const emailResult = await sendEmail({
            to: email,
            subject: 'Đặt lại mật khẩu - HKT Store',
            title: 'Yêu cầu đặt lại mật khẩu',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Xin chào ${user.fullName},</h2>
                    <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản HKT Store.</p>
                    <p>Mã OTP của bạn là:</p>
                    <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #e74c3c;">
                            ${otp}
                        </span>
                    </div>
                    <p><strong>Lưu ý:</strong></p>
                    <ul>
                        <li>Mã OTP có hiệu lực trong <strong>10 phút</strong></li>
                        <li>Không chia sẻ mã này cho bất kỳ ai</li>
                        <li>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</li>
                    </ul>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #888; font-size: 12px;">
                        Email này được gửi tự động, vui lòng không trả lời.
                    </p>
                </div>
            `
        });

        if (!emailResult.success) {
            return response.status(500).json({
                message: 'Không thể gửi email. Vui lòng thử lại sau',
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Mã OTP đã được gửi đến email của bạn'
        });
    }
    catch (error) {
        console.error('Forgot password error:', error);
        return response.status(500).json({
            message: error.message || 'Lỗi server',
            error: true,
            success: false
        });
    }
}

export async function verifyForgotPasswordOTP(request, response) {
    try {
        const { email, otp } = request.body;

        // Validate input
        if (!email || !otp) {
            return response.status(400).json({
                message: 'Vui lòng nhập đầy đủ email và mã OTP',
                error: true,
                success: false
            });
        }

        // Tìm user
        const user = await User.findOne({
            where: { email: email }
        });

        if (!user) {
            return response.status(404).json({
                message: 'Email không tồn tại',
                error: true,
                success: false
            });
        }

        // Kiểm tra OTP
        if (user.otp !== otp) {
            return response.status(400).json({
                message: 'Mã OTP không đúng',
                error: true,
                success: false
            });
        }

        // Kiểm tra OTP hết hạn
        if (new Date() > new Date(user.otpExpiry)) {
            return response.status(400).json({
                message: 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới',
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Xác thực OTP thành công. Bạn có thể đặt lại mật khẩu'
        });
    }
    catch (error) {
        console.error('Verify forgot password OTP error:', error);
        return response.status(500).json({
            message: error.message || 'Lỗi server',
            error: true,
            success: false
        });
    }
}

export async function resetPassword(request, response) {
    try {
        const { email, otp, newPassword, confirmPassword } = request.body;

        // Validate input
        if (!email || !otp || !newPassword || !confirmPassword) {
            return response.status(400).json({
                message: 'Vui lòng nhập đầy đủ thông tin',
                error: true,
                success: false
            });
        }

        // Kiểm tra mật khẩu khớp nhau
        if (newPassword !== confirmPassword) {
            return response.status(400).json({
                message: 'Mật khẩu xác nhận không khớp',
                error: true,
                success: false
            });
        }

        // Validate độ mạnh mật khẩu
        if (newPassword.length < 6) {
            return response.status(400).json({
                message: 'Mật khẩu phải có ít nhất 6 ký tự',
                error: true,
                success: false
            });
        }

        // Tìm user
        const user = await User.findOne({
            where: { email: email }
        });

        if (!user) {
            return response.status(404).json({
                message: 'Email không tồn tại',
                error: true,
                success: false
            });
        }

        // Kiểm tra OTP
        if (user.otp !== otp) {
            return response.status(400).json({
                message: 'Mã OTP không đúng',
                error: true,
                success: false
            });
        }

        // Kiểm tra OTP hết hạn
        if (new Date() > new Date(user.otpExpiry)) {
            return response.status(400).json({
                message: 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới',
                error: true,
                success: false
            });
        }

        const salt = await bcryptjs.genSalt(10);
        user.password = newPassword; 
        user.otp = null;
        user.otpExpiry = null;
        user.refreshToken = null;
        
        await user.save(); 

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại'
        });
    }
    catch (error) {
        console.error('Reset password error:', error);
        return response.status(500).json({
            message: error.message || 'Lỗi server',
            error: true,
            success: false
        });
    }
}

export async function uploadUserAvatar(request, response) {
    try {
        const userID = request.user.id;
        const image = request.file; // File từ multer middleware

        if (!image) {
            return response.status(400).json({
                message: 'Vui lòng chọn ảnh',
                error: true,
                success: false
            });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(image.mimetype)) {
            fs.unlinkSync(image.path); // Xóa file không hợp lệ
            return response.status(400).json({
                message: 'Chỉ chấp nhận file ảnh (JPG, PNG, WebP)',
                error: true,
                success: false
            });
        }

        console.log('Upload avatar request:', { userID, file: image?.originalname });

        // Validate file size (max 5MB)
        if (image.size > 5 * 1024 * 1024) {
            fs.unlinkSync(image.path);
            return response.status(400).json({
                message: 'Kích thước ảnh không được vượt quá 5MB',
                error: true,
                success: false
            });
        }

        console.log('Uploading to Cloudinary...');
        console.log('File path:', image.path);

        // Upload lên Cloudinary
        const uploadResult = await cloudinary.uploader.upload(image.path, {
            folder: 'hktstore/avatars',
            public_id: `user_${userID}`,
            overwrite: true,
            resource_type: 'image',
            transformation: [
                { width: 500, height: 500, crop: 'fill', gravity: 'face' }, // Focus vào khuôn mặt
                { quality: 'auto:good' },
                { fetch_format: 'auto' } // Tự động chọn format tốt nhất
            ]
        });

        console.log('✅ Cloudinary upload result:', uploadResult.secure_url);
        
        // Xóa file tạm trong server
        fs.unlinkSync(image.path);

        // Tạo responsive URLs
        const avatarUrls = getResponsiveUrls(uploadResult.secure_url);

        // Cập nhật avatar URL vào database
        await User.update(
            { avatar: uploadResult.secure_url },
            { where: { id: userID } }
        );

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Upload avatar thành công',
            data: {
                avatar: uploadResult.secure_url,
                avatarUrls: avatarUrls, // Thêm responsive URLs
                cloudinaryPublicId: uploadResult.public_id
            }
        });
    }
    catch (error) {
        // Xóa file tạm nếu có lỗi
        if (request.file?.path) {
            try {
                fs.unlinkSync(request.file.path);
            } catch (unlinkError) {
                console.error('Error deleting temp file:', unlinkError);
            }
        }

        console.error('Upload avatar error:', error);
        return response.status(500).json({
            message: error.message || 'Lỗi khi upload avatar',
            error: true,
            success: false
        });
    }
}

export async function deleteUserAvatar(request, response) {
    try {
        const userID = request.user.id;

        // Lấy thông tin user hiện tại
        const user = await User.findOne({
            where: { id: userID },
            attributes: ['id', 'avatar']
        });

        if (!user) {
            return response.status(404).json({
                message: 'User không tồn tại',
                error: true,
                success: false
            });
        }

        // Kiểm tra có avatar không
        if (!user.avatar || user.avatar === 'default-avatar.png') {
            return response.status(400).json({
                message: 'Không có avatar để xóa',
                error: true,
                success: false
            });
        }

        // Xóa ảnh trên Cloudinary
        const publicId = `hktstore/avatars/user_${userID}`;
        
        try {
            await cloudinary.uploader.destroy(publicId);
            console.log(`Deleted avatar from Cloudinary: ${publicId}`);
        } catch (cloudinaryError) {
            console.error('Cloudinary delete error:', cloudinaryError);
            // Vẫn tiếp tục cập nhật database
        }

        // Cập nhật database - set về avatar mặc định
        await User.update(
            { avatar: 'default-avatar.png' },
            { where: { id: userID } }
        );

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Xóa avatar thành công'
        });
    }
    catch (error) {
        console.error('Delete avatar error:', error);
        return response.status(500).json({
            message: error.message || 'Lỗi khi xóa avatar',
            error: true,
            success: false
        });
    }
}

export async function getUserProfile(request, response) {
    try {
        const userID = request.user.id;

        const user = await User.findOne({
            where: { id: userID },
            attributes: ['id', 'fullName', 'email', 'phone', 'avatar', 'role', 'createdAt']
        });

        if (!user) {
            return response.status(404).json({
                message: 'User không tồn tại',
                error: true,
                success: false
            });
        }

        // Tạo responsive avatar URLs
        const avatarUrls = user.avatar && user.avatar !== 'default-avatar.png' 
            ? getResponsiveUrls(user.avatar)
            : null;

        return response.status(200).json({
            success: true,
            error: false,
            data: {
                ...user.toJSON(),
                avatarUrls
            }
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        return response.status(500).json({
            message: error.message || 'Lỗi server',
            error: true,
            success: false
        });
    }
}

export async function updateUserProfile(request, response) {
    try {
        const userID = request.user.id;
        const { fullName, phone } = request.body;

        // Tìm user
        const user = await User.findOne({
            where: { id: userID }
        });

        if (!user) {
            return response.status(404).json({
                message: 'User không tồn tại',
                error: true,
                success: false
            });
        }

        // Validate fullName
        if (fullName && fullName.trim().length < 2) {
            return response.status(400).json({
                message: 'Họ tên phải có ít nhất 2 ký tự',
                error: true,
                success: false
            });
        }

        // Validate phone
        if (phone && !/^[0-9]{10,11}$/.test(phone)) {
            return response.status(400).json({
                message: 'Số điện thoại không hợp lệ (10-11 số)',
                error: true,
                success: false
            });
        }

        // Cập nhật thông tin
        const updateData = {};
        if (fullName) updateData.fullName = fullName.trim();
        if (phone) updateData.phone = phone;

        await user.update(updateData);

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Cập nhật thông tin thành công',
            data: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                avatar: user.avatar
            }
        });
    }
    catch (error) {
        console.error('Update profile error:', error);
        return response.status(500).json({
            message: error.message || 'Lỗi server',
            error: true,
            success: false
        });
    }
}

export async function changePassword(request, response) {
    try {
        const userID = request.user.id;
        const { currentPassword, newPassword, confirmPassword } = request.body;

        // Validate input
        if (!currentPassword || !newPassword || !confirmPassword) {
            return response.status(400).json({
                message: 'Vui lòng nhập đầy đủ thông tin',
                error: true,
                success: false
            });
        }

        // Kiểm tra mật khẩu mới khớp
        if (newPassword !== confirmPassword) {
            return response.status(400).json({
                message: 'Mật khẩu xác nhận không khớp',
                error: true,
                success: false
            });
        }

        // Validate độ mạnh mật khẩu mới
        if (newPassword.length < 6) {
            return response.status(400).json({
                message: 'Mật khẩu mới phải có ít nhất 6 ký tự',
                error: true,
                success: false
            });
        }

        // Tìm user
        const user = await User.findOne({
            where: { id: userID }
        });

        if (!user) {
            return response.status(404).json({
                message: 'User không tồn tại',
                error: true,
                success: false
            });
        }

        // Kiểm tra mật khẩu hiện tại
        const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return response.status(400).json({
                message: 'Mật khẩu hiện tại không đúng',
                error: true,
                success: false
            });
        }

        // Kiểm tra mật khẩu mới khác mật khẩu cũ
        const isSamePassword = await bcryptjs.compare(newPassword, user.password);
        if (isSamePassword) {
            return response.status(400).json({
                message: 'Mật khẩu mới phải khác mật khẩu hiện tại',
                error: true,
                success: false
            });
        }

        user.password = newPassword;
        user.refreshToken = null;
        await user.save();

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Đổi mật khẩu thành công'
        });
    }
    catch (error) {
        console.error('Change password error:', error);
        return response.status(500).json({
            message: error.message || 'Lỗi server',
            error: true,
            success: false
        });
    }
}

export function getProductImageUrls(url) {
    if (!url) return null;
    
    return {
        thumbnail: url.replace('/upload/', '/upload/w_150,h_150,c_fill,f_webp,q_auto/'),
        card: url.replace('/upload/', '/upload/w_400,h_400,c_fill,f_webp,q_auto/'),
        detail: url.replace('/upload/', '/upload/w_800,h_800,c_fill,f_webp,q_auto/'),
        zoom: url.replace('/upload/', '/upload/w_1500,h_1500,c_fill,f_webp,q_auto/'),
        original: url
    };
}

export async function refreshAccessToken(request, response) {
    try {
        // Lấy refresh token từ cookie hoặc body
        const refreshToken = request.cookies?.refreshToken || request.body?.refreshToken;

        if (!refreshToken) {
            return response.status(401).json({
                message: 'Refresh token không tồn tại',
                error: true,
                success: false
            });
        }

        // Verify refresh token
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (err) {
            return response.status(401).json({
                message: 'Refresh token không hợp lệ hoặc đã hết hạn',
                error: true,
                success: false,
                code: 'INVALID_REFRESH_TOKEN'
            });
        }

        // Tìm user và kiểm tra refresh token trong database
        const user = await User.findOne({
            where: {
                id: decoded.id,
                refreshToken: refreshToken,
                isActive: true
            }
        });

        if (!user) {
            return response.status(401).json({
                message: 'Phiên đăng nhập không hợp lệ',
                error: true,
                success: false
            });
        }

        // Tạo access token mới
        const newAccessToken = await generateAccessToken(user.id);

        // Set cookie mới
        response.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: 5 * 60 * 1000 // 5 phút
        });

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Refresh token thành công',
            data: {
                accessToken: newAccessToken
            }
        });
    }
    catch (error) {
        console.error('Refresh token error:', error);
        return response.status(500).json({
            message: error.message || 'Lỗi server',
            error: true,
            success: false
        });
    }
}
 

export async function resendOTP(request, response) {
    try {
        const { email } = request.body;

        // Validate email
        if (!email) {
            return response.status(400).json({
                message: 'Vui lòng cung cấp email',
                error: true,
                success: false
            });
        }

        // Tìm user
        const user = await User.findOne({ where: { email: email } });
        
        if (!user) {
            return response.status(400).json({
                message: 'Email không tồn tại trong hệ thống',
                error: true,
                success: false
            });
        }

        // Kiểm tra nếu user đã verified rồi
        if (user.isVerified) {
            return response.status(400).json({
                message: 'Email đã được xác thực trước đó',
                error: true,
                success: false
            });
        }

        // Kiểm tra rate limit - không cho gửi lại quá nhanh (60 giây)
        if (user.otpExpiry) {
            const timeSinceLastOTP = new Date() - new Date(user.otpExpiry) + 600000; // 600000ms = 10 phút (thời gian expire)
            if (timeSinceLastOTP < 60000) { // 60 giây
                const remainingTime = Math.ceil((60000 - timeSinceLastOTP) / 1000);
                return response.status(429).json({
                    message: `Vui lòng đợi ${remainingTime} giây trước khi gửi lại`,
                    error: true,
                    success: false,
                    remainingTime: remainingTime
                });
            }
        }

        // Tạo OTP mới
        const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 600000); // 10 phút

        // Cập nhật OTP trong database
        await user.update({
            otp: newOTP,
            otpExpiry: otpExpiry
        });

        // Gửi email
        const verifyEmail = await sendVerifyEmail(
            email,
            "Mã xác thực mới - HKTstore",
            "Xác thực Email",
            VerificationEmail(user.fullName, newOTP)
        );

        if (!verifyEmail.success) {
            return response.status(500).json({
                message: 'Gửi email thất bại, vui lòng thử lại',
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Mã xác thực mới đã được gửi đến email của bạn'
        });
    }
    catch (error) {
        console.error('Resend OTP error:', error);
        return response.status(500).json({
            message: error.message || 'Lỗi server',
            error: true,
            success: false
        });
    }
}