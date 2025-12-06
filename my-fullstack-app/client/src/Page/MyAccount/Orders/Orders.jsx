import React from 'react';
import { useOutletContext } from 'react-router-dom';
import './Orders.css';

export const Orders = () => {
  const { orders = [] } = useOutletContext();

  if (!orders || orders.length === 0) {
    return (
      <div className="myaccount-tab-content myaccount-orders-section">
        <div className="myaccount-section-header">
          <h2 className="myaccount-glitch-text" data-text="ORDER HISTORY">
            ORDER HISTORY
          </h2>
          <div className="myaccount-neon-line"></div>
        </div>
        <div className="myaccount-empty-state">
          <p>No orders found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="myaccount-tab-content myaccount-orders-section">
      <div className="myaccount-section-header">
        <h2 className="myaccount-glitch-text" data-text="ORDER HISTORY">
          ORDER HISTORY
        </h2>
        <div className="myaccount-neon-line"></div>
      </div>
      
      <div className="myaccount-orders-list">
        {orders.map((order) => (
          <div key={order.id} className="myaccount-order-card">
            <div className="myaccount-order-header">
              <span className="myaccount-order-id">{order.id}</span>
              <span className={`myaccount-order-status myaccount-status-${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
            
            <div className="myaccount-order-details">
              <div className="myaccount-order-info">
                <span className="myaccount-info-label">Date</span>
                <span className="myaccount-info-value">{order.date}</span>
              </div>
              <div className="myaccount-order-info">
                <span className="myaccount-info-label">Total</span>
                <span className="myaccount-info-value myaccount-neon-text">
                  {order.total.toLocaleString('vi-VN')} ₫
                </span>
              </div>
            </div>
            
            <button className="myaccount-neon-button myaccount-secondary">
              VIEW DETAILS
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;