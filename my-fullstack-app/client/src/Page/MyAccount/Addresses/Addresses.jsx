import React from 'react';
import { useOutletContext } from 'react-router-dom';
import './Addresses.css';

export const Addresses = () => {
  const { addresses = [] } = useOutletContext();

  if (!addresses || addresses.length === 0) {
    return (
      <div className="myaccount-tab-content myaccount-addresses-section">
        <div className="myaccount-section-header">
          <h2 className="myaccount-glitch-text" data-text="SHIPPING ADDRESSES">
            SHIPPING ADDRESSES
          </h2>
          <div className="myaccount-neon-line"></div>
        </div>
        
        <div className="myaccount-addresses-grid">
          <div className="myaccount-address-card myaccount-add-new">
            <div className="myaccount-add-icon">+</div>
            <span>ADD YOUR FIRST ADDRESS</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="myaccount-tab-content myaccount-addresses-section">
      <div className="myaccount-section-header">
        <h2 className="myaccount-glitch-text" data-text="SHIPPING ADDRESSES">
          SHIPPING ADDRESSES
        </h2>
        <div className="myaccount-neon-line"></div>
      </div>
      
      <div className="myaccount-addresses-grid">
        {addresses.map((addr) => (
          <div 
            key={addr.id} 
            className={`myaccount-address-card ${addr.isDefault ? 'myaccount-default' : ''}`}
          >
            {addr.isDefault && <span className="myaccount-default-badge">DEFAULT</span>}
            
            <div className="myaccount-address-type">
              <span className="myaccount-type-icon">◈</span>
              {addr.type}
            </div>
            
            <p className="myaccount-address-text">{addr.address}</p>
            
            <div className="myaccount-address-actions">
              <button className="myaccount-action-btn myaccount-edit">EDIT</button>
              <button className="myaccount-action-btn myaccount-delete">DELETE</button>
            </div>
          </div>
        ))}
        
        <div className="myaccount-address-card myaccount-add-new">
          <div className="myaccount-add-icon">+</div>
          <span>ADD NEW ADDRESS</span>
        </div>
      </div>
    </div>
  );
};

export default Addresses;