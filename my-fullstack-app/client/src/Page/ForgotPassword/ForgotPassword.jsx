import React, { useState } from 'react';
import './ForgotPassword.css';
import { BsShieldLock, BsArrowLeft } from "react-icons/bs";

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset link sent to:", email);
    // Logic gọi API gửi mail ở đây
  };

  return (
    <div className='ForgotPassword'>
      {/* Background Effects */}
      <div className="fp-cyber-bg">
        <div className="fp-grid-overlay"></div>
        <div className="fp-neon-circle fp-circle-1"></div>
        <div className="fp-neon-circle fp-circle-2"></div>
      </div>

      {/* Main Card */}
      <div className="fp-card">
        <div className="fp-card-header">
          <div className="fp-icon-container">
            <BsShieldLock className="fp-icon" />
          </div>
          <h1 className="fp-title">Quên Mật Khẩu?</h1>
          <p className="fp-subtitle">
            Đừng lo lắng. Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn khôi phục.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="fp-form">
          <div className="fp-input-group">
            <input 
              type="email" 
              className="fp-input" 
              placeholder="Nhập địa chỉ email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className="fp-input-border"></span>
          </div>

          <button type="submit" className="fp-submit-btn">
            <span className="fp-btn-text">Gửi Link Khôi Phục</span>
            <div className="fp-btn-glitch"></div>
          </button>
        </form>

        <div className="fp-footer">
          <a href="/login" className="fp-back-link">
            <BsArrowLeft /> Quay lại đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;