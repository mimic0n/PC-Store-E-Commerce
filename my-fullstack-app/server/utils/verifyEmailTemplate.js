const VerificationEmail = (username, otp) => { 
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Xác thực Email</title>
    </head>
    <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px;">
            <h2 style="color: #333; text-align: center;">Xác thực Email của bạn</h2>
            <p>Xin chào <strong>${username}</strong>,</p>
            <p>Cảm ơn bạn đã đăng ký tài khoản tại HKTstore!</p>
            <p>Mã xác thực của bạn là:</p>
            <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px; background-color: #f0f0f0; padding: 15px 30px; border-radius: 5px;">
                    ${otp}
                </span>
            </div>
            <p style="color: #666;">Mã này sẽ hết hạn sau <strong>10 phút</strong>.</p>
            <p style="color: #666;">Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="text-align: center; color: #999; font-size: 12px;">
                © 2024 HKTstore. All rights reserved.
            </p>
        </div>
    </body>
    </html>
    `;
};

export default VerificationEmail;