import sendEmail from "./emailService.js";

const sendVerifyEmail = async (to, subject, title, html) => { 
    try {
        // truyền object cho sendEmail vì emailService nhận object
        const result = await sendEmail({ to, subject, title, html });
        
        if (result.success) {
            return {
                success: true,
                message: 'Email xác thực đã được gửi thành công.'
            };
        } else {
            return {
                success: false,
                message: 'Gửi email xác thực thất bại.'
            };
        }
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Lỗi khi gửi email.'
        };
    }
};

export default sendVerifyEmail;