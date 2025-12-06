import React, { useState, useContext, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import './MyAccount.css';
import { MyContext } from '../../App';


export const MyAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const context = useContext(MyContext);

  useEffect(() => {
    if (!context.isLoading && !context.isLogin) {
      context.openAlertPanel("error", "Vui lòng đăng nhập để truy cập trang này");
      navigate('/Login');
    }
  }, [context.isLogin, context.isLoading, navigate]);

  // Mock user data
  const userData = {
    name: context.user?.fullName || 'Guest', 
    email: context.user?.email || '',
    phone: context.user?.phone || '',
    avatar: context.user?.avatar || `https://api.dicebear.com/7.x/cyberpunk/svg?seed=${context.user?.fullName || 'Guest'}`,
    memberSince: context.user?.createdAt 
      ? new Date(context.user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : 'N/A',
    tier: 'PLATINUM',
    points: 12500,
    role: context.user?.role || 'user'
  };


  // Mock orders data
  const orders = [
    { id: 'ORD-2024-001', date: '2024-11-20', status: 'Delivered', total: 1250000 },
    { id: 'ORD-2024-002', date: '2024-11-15', status: 'Shipping', total: 890000 },
    { id: 'ORD-2024-003', date: '2024-11-10', status: 'Processing', total: 2100000 },
  ];

  // Mock addresses
  const addresses = [
    { id: 1, type: 'Home', address: '123 Neon Street, District 7, Neo Tokyo', isDefault: true },
    { id: 2, type: 'Office', address: '456 Cyber Avenue, Tech Park, Night City', isDefault: false },
  ];

  // Xác định tab active dựa trên URL
  const getActiveTab = () => {
    const path = location.pathname.split('/').pop();
    if (path === 'MyAccount' || path === '') return 'profile';
    return path;
  };

  const activeTab = getActiveTab();

  // Navigation handlers
  const handleNavigate = (path) => {
    navigate(`/MyAccount/${path}`);
  };

  const handleLogout = () => {
    context.handleLogout();
    navigate('/Login');
  };

  if (context.isLoading) {
    return (
      <div className="myaccount-root">
        <div className="myaccount-loading">Loading...</div>
      </div>
    );
  }


  return (
    <div className="myaccount-root">
      {/* Background Effects */}
      <div className="myaccount-bg-grid"></div>
      <div className="myaccount-bg-scanline"></div>
      
      <div className="myaccount-container">
        {/* Header Section */}
        <div className="myaccount-header">
          <h1 className="myaccount-title">
            <span className="myaccount-glitch" data-text="MY ACCOUNT">MY ACCOUNT</span>
          </h1>
          <div className="myaccount-cyber-border"></div>
        </div>

        <div className="myaccount-content">
          {/* Sidebar */}
          <aside className="myaccount-sidebar">
            {/* User Card */}
            <div className="myaccount-user-card">
              <div className="myaccount-avatar-container">
                <div className="myaccount-avatar-ring"></div>
                <img src={userData.avatar} alt="Avatar" className="myaccount-avatar" />
                <div className="myaccount-avatar-glitch"></div>
              </div>
              <div className="myaccount-user-info">
                <h3 className="myaccount-user-name">{userData.name}</h3>
                <span className="myaccount-user-email">{userData.email}</span>
              </div>
              <div className="myaccount-tier-badge">
                <span className="myaccount-tier-icon">⬡</span>
                <span className="myaccount-tier-text">{userData.tier}</span>
              </div>
              <div className="myaccount-points-display">
                <span className="myaccount-points-label">REWARD POINTS</span>
                <span className="myaccount-points-value">{userData.points.toLocaleString()}</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="myaccount-nav">
              <button
                className={`myaccount-nav-item ${activeTab === 'profile' ? 'myaccount-active' : ''}`}
                onClick={() => handleNavigate('profile')}
              >
                <span className="myaccount-nav-icon">◈</span>
                <span className="myaccount-nav-text">Profile</span>
                <span className="myaccount-nav-arrow">›</span>
              </button>
              <button
                className={`myaccount-nav-item ${activeTab === 'orders' ? 'myaccount-active' : ''}`}
                onClick={() => handleNavigate('orders')}
              >
                <span className="myaccount-nav-icon">◈</span>
                <span className="myaccount-nav-text">Orders</span>
                <span className="myaccount-nav-arrow">›</span>
              </button>
              <button
                className={`myaccount-nav-item ${activeTab === 'addresses' ? 'myaccount-active' : ''}`}
                onClick={() => handleNavigate('addresses')}
              >
                <span className="myaccount-nav-icon">◈</span>
                <span className="myaccount-nav-text">Addresses</span>
                <span className="myaccount-nav-arrow">›</span>
              </button>
              <button
                className={`myaccount-nav-item ${activeTab === 'wishlist' ? 'myaccount-active' : ''}`}
                onClick={() => handleNavigate('wishlist')}
              >
                <span className="myaccount-nav-icon">◈</span>
                <span className="myaccount-nav-text">Wishlist</span>
                <span className="myaccount-nav-arrow">›</span>
              </button>
              <button className="myaccount-nav-item myaccount-logout" onClick={handleLogout}>
                <span className="myaccount-nav-icon">◈</span>
                <span className="myaccount-nav-text">Logout</span>
                <span className="myaccount-nav-arrow">›</span>
              </button>
            </nav>
          </aside>

          {/* Main Content - Outlet sẽ render component con ở đây */}
          <main className="myaccount-main">
            <Outlet context={{ userData, orders, addresses }} />
          </main>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="myaccount-corner-decor myaccount-top-left"></div>
      <div className="myaccount-corner-decor myaccount-top-right"></div>
      <div className="myaccount-corner-decor myaccount-bottom-left"></div>
      <div className="myaccount-corner-decor myaccount-bottom-right"></div>
    </div>
  );
};

export default MyAccount;