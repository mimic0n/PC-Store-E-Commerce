import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import './OrderSuccess.css';
import { FaCheckCircle } from 'react-icons/fa';

export const OrderSuccess = () => {
  const location = useLocation();
  const { orderId } = useParams();
  const order = location.state?.order;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      currencyDisplay: 'code'
    }).format(amount);
  };

  return (
    <div className="order-success-root">
      <div className="order-success-container">
        <div className="success-icon">
          <FaCheckCircle />
        </div>
        
        <h1 className="success-title">Order Placed Successfully!</h1>
        
        <p className="success-message">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>

        {order && (
          <div className="order-info">
            <div className="order-info-row">
              <span>Order Code:</span>
              <strong>{order.orderCode}</strong>
            </div>
            <div className="order-info-row">
              <span>Total Amount:</span>
              <strong className="total-amount">{formatCurrency(order.totalAmount)}</strong>
            </div>
            <div className="order-info-row">
              <span>Payment Method:</span>
              <span>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}</span>
            </div>
            <div className="order-info-row">
              <span>Estimated Delivery:</span>
              <span>{new Date(order.estimatedDelivery).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
        )}

        {order?.paymentMethod === 'banking' && (
          <div className="banking-reminder">
            <h3>⚠️ Payment Reminder</h3>
            <p>Please complete your bank transfer to confirm your order:</p>
            <div className="bank-details">
              <p><strong>Bank:</strong> MB Bank</p>
              <p><strong>Account:</strong> 999988887777</p>
              <p><strong>Name:</strong> HKT STORE</p>
              <p><strong>Amount:</strong> {formatCurrency(order.totalAmount)}</p>
              <p><strong>Content:</strong> {order.orderCode}</p>
            </div>
          </div>
        )}

        <div className="success-actions">
          <Link to="/MyAccount/orders" className="btn-view-orders">
            View My Orders
          </Link>
          <Link to="/ProductListing" className="btn-continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;