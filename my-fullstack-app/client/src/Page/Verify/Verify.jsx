import React, { useState, useEffect, useContext } from 'react'
import './Verify.css'
import { OTPInput } from '../../component/OTPinput/OTPinput.jsx';
import { BsFillShieldLockFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';
import { verifyEmail, resendOTP } from '../../api/authService';

export const Verify = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [email, setEmail] = useState('');
  
  useEffect(() => {
    const pendingEmail = localStorage.getItem('pendingVerifyEmail');
    if (pendingEmail) {
      // Mask email để hiển thị
      const [name, domain] = pendingEmail.split('@');
      const maskedName = name.substring(0, 2) + '***';
      setEmail(pendingEmail);
    } else {
      navigate('/Register');
    }
  }, [navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const onOtpSubmit = async (otp) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await verifyEmail(email, otp);
      
      if (response.success) {
        context.openAlertPanel("success", "Xác thực email thành công!");
        
        // Xóa email tạm
        localStorage.removeItem('pendingVerifyEmail');
        
        // Chuyển đến trang đăng nhập
        navigate('/Login');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Mã OTP không hợp lệ';
      context.openAlertPanel("error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleResend = async () => {
    if (!canResend || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await resendOTP(email);
      
      if (response.success) {
        context.openAlertPanel("success", response.message || "Đã gửi lại mã xác thực!");
        setCountdown(60);
        setCanResend(false);
      }
    }
    catch (error) {
      const errorMessage = error.response?.data?.message || "Gửi lại mã thất bại";
      if (error.response?.data?.remainingTime) {
        context.openAlertPanel("error", `Vui lòng đợi ${error.response.data.remainingTime} giây`);
      } else {
        context.openAlertPanel("error", errorMessage);
      }
    }
    finally {
      setIsSubmitting(false);
    }
  }

  const getMaskedEmail = () => {
    if (!email) return '';
    const [name, domain] = email.split('@');
    const maskedName = name.substring(0, 2) + '***';
    return `${maskedName}@${domain}`;
  };

  return (
    <div className="verify-container">
      {/* Background Effects */}
      <div className="cyber-bg">
        <div className="grid-overlay"></div>
        <div className="glitch-effect"></div>
        <div className="neon-circle neon-circle-1"></div>
        <div className="neon-circle neon-circle-2"></div>
        <div className="neon-circle neon-circle-3"></div>
      </div>

      {/* Main Content */}
      <div className="verify-card">
        <div className="card-glow"></div>
        
        {/* Header */}
        <div className="verify-header">
          <div className="icon-wrapper">
            <div className="security-icon">
              <span className="icon-glow"></span>
              <BsFillShieldLockFill />
            </div>
          </div>
          <h1 className="verify-title">
            Xác Thực Tài Khoản
            <span className="title-glitch">Xác Thực Tài Khoản</span>
          </h1>
          <p className="verify-subtitle">
            Chúng tôi đã gửi mã 6 số đến email
          </p>
          <p className="email-display">
            <span className="email-highlight">{getMaskedEmail()}</span>
          </p>
        </div>

        {/* OTP Input */}
        <div className="otp-section">
          <OTPInput 
            length={6} 
            onOtpSubmit={onOtpSubmit} 
            disabled={isSubmitting}
          />
          {isSubmitting && (
            <p style={{ color: '#8E54E9', marginTop: '10px' }}>Đang xác thực...</p>
          )}
      </div>

        {/* Countdown & Resend */}
        <div className="verify-footer">
          <div className="countdown-wrapper">
            {!canResend ? (
              <p className="countdown-text">
                Mã có hiệu lực trong
                <span className="countdown-timer"> {countdown}s</span>
              </p>
            ) : (
              <p className="expired-text">Mã đã hết hạn</p>
            )}
          </div>

          <button
            className={`resend-btn ${canResend && !isSubmitting ? 'active' : 'disabled'}`}
            onClick={handleResend}
            disabled={!canResend || isSubmitting}
          >
            <span className="btn-text">
              {isSubmitting ? 'Đang gửi...' : 'Gửi Lại Mã'}
            </span>
            <span className="btn-glow"></span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Verify