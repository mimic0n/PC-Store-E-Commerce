import React, { useState, useContext, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import './Profile.css';
import { MyContext } from '../../../App';
import { updateUserProfile, changePassword } from '../../../api/authService';

export const Profile = () => {
  const { userData } = useOutletContext();
  const context = useContext(MyContext);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSaveChanges = async () => {

    if (!formData.fullName.trim()) {
      context.openAlertPanel("error", "Vui lòng nhập họ tên!");
      return;
    }

    if (formData.fullName.trim().length < 2) {
      context.openAlertPanel("error", "Họ tên phải có ít nhất 2 ký tự!");
      return;
    }

    // Validate phone nếu có nhập
    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone)) {
      context.openAlertPanel("error", "Số điện thoại không hợp lệ (10-11 số)!");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await updateUserProfile({
        fullName: formData.fullName.trim(),
        phone: formData.phone || null,
      });
      
      if (response.success) {
        // Cập nhật user trong context và localStorage
        const updatedUser = {
          ...context.user,
          fullName: response.data.fullName,
          phone: response.data.phone,
        };
        
        context.setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        context.openAlertPanel("success", "Cập nhật thông tin thành công!");
        setIsEditing(false);
      }
    }
    catch (error) {
      const errorMessage = error.response?.data?.message || "Cập nhật thất bại!";
      context.openAlertPanel("error", errorMessage);
    }
    finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async () => { 
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      context.openAlertPanel("error", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      context.openAlertPanel("error", "Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      context.openAlertPanel("error", "Mật khẩu xác nhận không khớp!");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await changePassword(passwordData);
      
      if (response.success) {
        context.openAlertPanel("success", "Đổi mật khẩu thành công!");
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    }
    catch (error) {
      const errorMessage = error.response?.data?.message || "Đổi mật khẩu thất bại!";
      context.openAlertPanel("error", errorMessage);
    }
    finally {
      setIsSubmitting(false);
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      fullName: userData?.name || '',
      email: userData?.email || '',
      phone: userData?.phone || '',
    });
  };

  const handleCancelPassword = () => {
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="myaccount-tab-content myaccount-profile-section">
      <div className="myaccount-section-header">
        <h2 className="myaccount-glitch-text" data-text="PROFILE INFORMATION">
          PROFILE INFORMATION
        </h2>
        <div className="myaccount-neon-line"></div>
      </div>
      
      <div className="myaccount-profile-grid">
        <div className="myaccount-form-group">
          <label className="myaccount-cyber-label">Full Name</label>
          <input 
             type="text" 
             name="fullName"
             className="myaccount-cyber-input" 
             value={formData.fullName}
             onChange={handleInputChange}
             disabled={!isEditing || isSubmitting}
             placeholder="Your full name"
          />
        </div>
        
        <div className="myaccount-form-group">
          <label className="myaccount-cyber-label">Email Address</label>
          <input 
           type="email" 
           name="email"
           className="myaccount-cyber-input" 
           value={formData.email}
           disabled={true}
           style={{ opacity: 0.7, cursor: 'not-allowed' }}
          />
          <small style={{ color: '#888', fontSize: '12px' }}>Email không thể thay đổi</small>
        </div>
        
        <div className="myaccount-form-group">
          <label className="myaccount-cyber-label">Phone Number</label>
          <input 
             type="tel" 
             name="phone"
             className="myaccount-cyber-input" 
             value={formData.phone}
             onChange={handleInputChange}
             disabled={!isEditing || isSubmitting}
             placeholder="Your Phone Number (10-11 số)"
          />
        </div>
        
        <div className="myaccount-form-group">
        <label className="myaccount-cyber-label">Role</label>
        <input 
          type="text" 
          className="myaccount-cyber-input" 
          value={userData?.role || 'user'}
          disabled={true}
          style={{ opacity: 0.7, cursor: 'not-allowed' }}
        />
      </div>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        {!isEditing ? (
          <button 
            className="myaccount-neon-button myaccount-primary"
            onClick={() => setIsEditing(true)}
            disabled={isChangingPassword}
          >
            <span className="myaccount-btn-text">EDIT PROFILE</span>
            <span className="myaccount-btn-glitch"></span>
          </button>
        ) : (
          <>
            <button 
              className="myaccount-neon-button myaccount-primary"
              onClick={handleSaveChanges}
              disabled={isSubmitting}
              style={{ opacity: isSubmitting ? 0.7 : 1 }}
            >
              <span className="myaccount-btn-text">
                {isSubmitting ? 'SAVING...' : 'SAVE CHANGES'}
              </span>
              <span className="myaccount-btn-glitch"></span>
            </button>
            <button 
              className="myaccount-neon-button"
              onClick={handleCancelEdit}
              disabled={isSubmitting}
              style={{ background: 'rgba(255,0,0,0.2)', borderColor: '#ff4444' }}
            >
              <span className="myaccount-btn-text">CANCEL</span>
            </button>
          </>
        )}
      </div>

      <div className="myaccount-section-header" style={{ marginTop: '2rem' }}>
        <h2 className="myaccount-glitch-text" data-text="CHANGE PASSWORD">
          CHANGE PASSWORD
        </h2>
        <div className="myaccount-neon-line"></div>
      </div>

      {!isChangingPassword ? (
        <button 
          className="myaccount-neon-button"
          onClick={() => setIsChangingPassword(true)}
          disabled={isEditing}
          style={{ 
            background: 'rgba(138, 43, 226, 0.2)', 
            borderColor: '#8a2be2',
            marginTop: '1rem'
          }}
        >
          <span className="myaccount-btn-text">CHANGE PASSWORD</span>
          <span className="myaccount-btn-glitch"></span>
        </button>
      ) : (
          <>
             <div className="myaccount-profile-grid" style={{ marginTop: '1rem' }}>
            <div className="myaccount-form-group">
              <label className="myaccount-cyber-label">Current Password</label>
              <input 
                type="password" 
                name="currentPassword"
                className="myaccount-cyber-input" 
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                disabled={isSubmitting}
                placeholder="Nhập mật khẩu hiện tại"
              />
            </div>
            
            <div className="myaccount-form-group">
              <label className="myaccount-cyber-label">New Password</label>
              <input 
                type="password" 
                name="newPassword"
                className="myaccount-cyber-input" 
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                disabled={isSubmitting}
                placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
              />
              </div>
              
              <div className="myaccount-form-group">
              <label className="myaccount-cyber-label">Confirm New Password</label>
              <input 
                type="password" 
                name="confirmPassword"
                className="myaccount-cyber-input" 
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                disabled={isSubmitting}
                placeholder="Xác nhận mật khẩu mới"
              />
            </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button 
              className="myaccount-neon-button myaccount-primary"
              onClick={handleChangePassword}
              disabled={isSubmitting}
              style={{ opacity: isSubmitting ? 0.7 : 1 }}
            >
              <span className="myaccount-btn-text">
                {isSubmitting ? 'UPDATING...' : 'UPDATE PASSWORD'}
              </span>
              <span className="myaccount-btn-glitch"></span>
            </button>
            <button 
              className="myaccount-neon-button"
              onClick={handleCancelPassword}
              disabled={isSubmitting}
              style={{ background: 'rgba(255,0,0,0.2)', borderColor: '#ff4444' }}
            >
              <span className="myaccount-btn-text">CANCEL</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;