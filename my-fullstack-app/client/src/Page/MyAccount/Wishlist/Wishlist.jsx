import React from 'react';
import { useOutletContext } from 'react-router-dom';
import './Wishlist.css';

export const Wishlist = () => {
  const { wishlist = [] } = useOutletContext();

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="myaccount-tab-content myaccount-wishlist-section">
        <div className="myaccount-section-header">
          <h2 className="myaccount-glitch-text" data-text="WISHLIST">
            WISHLIST
          </h2>
          <div className="myaccount-neon-line"></div>
        </div>
        
        <div className="myaccount-wishlist-empty">
          <div className="myaccount-empty-icon">♡</div>
          <h3>Your Wishlist is Empty</h3>
          <p>Add items you love to your wishlist</p>
          <button className="myaccount-neon-button">
            START SHOPPING
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="myaccount-tab-content myaccount-wishlist-section">
      <div className="myaccount-section-header">
        <h2 className="myaccount-glitch-text" data-text="WISHLIST">
          WISHLIST
        </h2>
        <div className="myaccount-neon-line"></div>
      </div>
      
      <div className="myaccount-wishlist-grid">
        {wishlist.map((item) => (
          <div key={item.id} className="myaccount-wishlist-card">
            <div className="myaccount-wishlist-image">
              {item.image ? (
                <img src={item.image} alt={item.name} />
              ) : (
                <div className="myaccount-image-placeholder">
                  <span className="myaccount-circuit-pattern">◇◆◇</span>
                </div>
              )}
              <button className="myaccount-remove-wishlist">✕</button>
            </div>
            
            <div className="myaccount-wishlist-info">
              <h4>{item.name}</h4>
              <span className="myaccount-wishlist-price">
                {item.price.toLocaleString('vi-VN')} ₫
              </span>
            </div>
            
            <button className="myaccount-neon-button myaccount-full-width">
              ADD TO CART
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;