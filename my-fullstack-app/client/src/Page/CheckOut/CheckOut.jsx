import React, { useState } from 'react';
import './CheckOut.css';

export const CheckOut = () => {
  // Dummy data for cart
  const cartItems = [
    {
      id: 1,
      name: ' PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC',
      image: "/src/assets/Product/PC/PC-AMD-Gaming/PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC/PC_AMD_GAMING_LUXURY_RYZEN_9_9950X3D-RTX_5090_32GB_OC_1.jpg", 
      price: 48880000,
      quantity: 1,
    },
    {
      id: 2,
      name: ' PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC',
      image: "/src/assets/Product/PC/PC-AMD-Gaming/PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC/PC_AMD_GAMING_LUXURY_RYZEN_9_9950X3D-RTX_5090_32GB_OC_1.jpg", 
      price: 48880000,
      quantity: 2,
    },
  ];

  // State for form fields
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '',
    district: '',
    ward: '',
    address: '',
    note: '',
    shippingMethod: 'standard',
    paymentMethod: 'cod',
  });

  const [errors, setErrors] = useState({});

  // Currency formatter
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
        currency: 'VND',
        currencyDisplay: 'code'
    }).format(amount);
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = formData.shippingMethod === 'express' ? 50000 : 30000;
  const discount = 0; // Logic for coupon can be added here
  const grandTotal = subtotal + shippingFee - discount;

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Simple Validation
  const validateForm = () => {
    let newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(formData.phone)) {
      newErrors.phone = 'Invalid VN phone number';
    }
    if (!formData.address) newErrors.address = 'Street address is required';
    if (!formData.city) newErrors.city = 'Required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert('Order Placed Successfully!');
      // Proceed to backend logic
    }
  };

  return (
    <div className="checkout-root">
      <div className="checkout-bg-overlay"></div>
      
      {/* Breadcrumbs */}
      <div className="checkout-breadcrumbs">
        <span>CART</span> <span className="separator">&gt;</span>
        <span className="active">Check Out</span> <span className="separator">&gt;</span>
        <span>PAYMENT</span> <span className="separator">&gt;</span>
        <span>COMPLETE</span>
      </div>

      <h1 className="checkout-title glitch" data-text="CHECKOUT">CHECKOUT</h1>

      <form className="checkout-layout" onSubmit={handleSubmit}>
        {/* LEFT COLUMN: INPUT FORMS */}
        <div className="checkout-left">
          
          {/* Shipping Info Block */}
          <section className="checkout-block">
            <h2 className="block-title">SHIPPING INFORMATION</h2>
            
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="fullName" 
                placeholder="Ex: Nguyen Van A" 
                value={formData.fullName}
                onChange={handleInputChange}
                className={errors.fullName ? 'input-error' : ''}
              />
              {errors.fullName && <span className="error-msg">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="text" 
                name="phone" 
                placeholder="Ex: 0901234567" 
                value={formData.phone}
                onChange={handleInputChange}
                className={errors.phone ? 'input-error' : ''}
              />
              {errors.phone && <span className="error-msg">{errors.phone}</span>}
            </div>

            <div className="address-grid">
              <div className="form-group">
                <label>City / Province</label>
                <select name="city" value={formData.city} onChange={handleInputChange} className={errors.city ? 'input-error' : ''}>
                  <option value="">Select City</option>
                  <option value="hcm">Ho Chi Minh</option>
                  <option value="hn">Ha Noi</option>
                  <option value="dn">Da Nang</option>
                </select>
              </div>
              <div className="form-group">
                <label>District</label>
                <select name="district" value={formData.district} onChange={handleInputChange}>
                  <option value="">Select District</option>
                  <option value="d1">District 1</option>
                  <option value="d2">District 2</option>
                </select>
              </div>
              <div className="form-group">
                <label>Ward</label>
                <select name="ward" value={formData.ward} onChange={handleInputChange}>
                  <option value="">Select Ward</option>
                  <option value="w1">Ward 1</option>
                  <option value="w2">Ward 2</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Street Address</label>
              <input 
                type="text" 
                name="address" 
                placeholder="House number, street name" 
                value={formData.address}
                onChange={handleInputChange}
                className={errors.address ? 'input-error' : ''}
              />
              {errors.address && <span className="error-msg">{errors.address}</span>}
            </div>

            <div className="form-group">
              <label>Note (Optional)</label>
              <textarea 
                name="note" 
                placeholder="Ex: Deliver during office hours"
                value={formData.note}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </section>

          {/* Shipping Method Block */}
          <section className="checkout-block">
            <h2 className="block-title">SHIPPING METHOD</h2>
            <div className="radio-group">
              <label className={`radio-card ${formData.shippingMethod === 'standard' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="shippingMethod" 
                  value="standard" 
                  checked={formData.shippingMethod === 'standard'}
                  onChange={handleInputChange}
                />
                <div className="radio-content">
                  <span className="radio-label">Standard Delivery</span>
                  <span className="radio-price">{formatCurrency(30000)}</span>
                </div>
              </label>

              <label className={`radio-card ${formData.shippingMethod === 'express' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="shippingMethod" 
                  value="express" 
                  checked={formData.shippingMethod === 'express'}
                  onChange={handleInputChange}
                />
                <div className="radio-content">
                  <span className="radio-label">Express Delivery </span>
                  <span className="radio-price">{formatCurrency(50000)}</span>
                </div>
              </label>
            </div>
          </section>

          {/* Payment Method Block */}
          <section className="checkout-block">
            <h2 className="block-title">PAYMENT METHOD</h2>
            <div className="radio-group vertical">
              <label className={`radio-card ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="cod" 
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleInputChange}
                />
                <div className="radio-content">
                  <span className="radio-label">Cash On Delivery (COD)</span>
                </div>
              </label>

              <label className={`radio-card ${formData.paymentMethod === 'banking' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="banking" 
                  checked={formData.paymentMethod === 'banking'}
                  onChange={handleInputChange}
                />
                <div className="radio-content">
                  <span className="radio-label">Bank Transfer (QR Code)</span>
                </div>
              </label>
              
              {formData.paymentMethod === 'banking' && (
                <div className="banking-info">
                  <p>Bank: MB Bank</p>
                  <p>Account: 999988887777</p>
                  <p>Name: E-COMMERCE STORE</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <div className="checkout-right">
          <div className="order-summary-card">
            <h2 className="block-title">ORDER SUMMARY</h2>
            
            <div className="product-list">
              {cartItems.map((item) => (
                <div key={item.id} className="product-item">
                  <div className="product-img-wrapper">
                    <img src={item.image} alt={item.name} />
                    <span className="product-qty">{item.quantity}</span>
                  </div>
                  <div className="product-info">
                    <p className="product-name">{item.name}</p>
                    <p className="product-price">{formatCurrency(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="coupon-section">
              <input type="text" placeholder="Coupon Code" />
              <button type="button" className="btn-apply">APPLY</button>
            </div>

            <div className="price-breakdown">
              <div className="price-row">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="price-row">
                <span>Shipping</span>
                <span>{formatCurrency(shippingFee)}</span>
              </div>
              <div className="price-row">
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
              <div className="price-row total">
                <span>GRAND TOTAL</span>
                <span className="neon-text">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <button type="submit" className="btn-place-order">
              PLACE ORDER
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckOut;