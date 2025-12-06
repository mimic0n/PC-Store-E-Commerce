import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

console.log('📧 Email Config:', {
    user: process.env.EMAIL || ' NOT SET',
    pass: process.env.EMAIL_PASSWORD ? '✅ SET (' + process.env.EMAIL_PASSWORD.length + ' chars)' : ' NOT SET'
});

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Email connection failed:', error.message);
    } else {
        console.log('✅ Email server ready!');
    }
});

async function sendEmail({ to, subject, title, html }) { 
    try {
        const info = await transporter.sendMail({
            from: `"HKTstore" <${process.env.EMAIL}>`,
            to,
            subject,
            html
        });
        return { success: true, messageID: info.messageId };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error: error.message || error };
    }
}

export default sendEmail;