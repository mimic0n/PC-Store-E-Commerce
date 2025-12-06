import React, { useState } from 'react';
import './CartSummary.css';
import { FiTag, FiChevronDown, FiChevronUp, FiShoppingCart } from 'react-icons/fi';
import { IoCheckmarkCircle } from "react-icons/io5";
import { IoNewspaperOutline } from "react-icons/io5";
import { BsShieldLockFill } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const CartSummary = () => {
  const [promoExpanded, setPromoExpanded] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  // Mock data - replace with real data
  const subtotal = 48880000;
  const shipping = null;
  const tax = 0;
  const discount = appliedPromo ? 48880000 : 0;
  const total = subtotal + (shipping || 0) + tax - discount;

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      setAppliedPromo({
        code: promoCode,
        discount: 48880000
      });
      setPromoExpanded(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
        currency: 'VND',
        currencyDisplay: 'code'
    }).format(amount);
  };

    return (
    <div className="cart-summary-container">
        <div className="cart-summary">
            <div className="glitch-overlay"></div>
            
            <div className="cart-summary-header">
                <h2 className="cart-summary-title">
                <span className="title-icon"><IoNewspaperOutline /></span>
                    Total Orders
                </h2>
            </div>
                
            <div className='cart-summary-product'>
                <div className='cart-summary-product-item'>
                    <div className='cart-summary-product-item-img'>
                        <Link to={"/ProductDetails/:id"}>
                            <img
                                className='cart-summary-product-item-img-tag'
                                alt="Product"
                                src="/src/assets/Product/PC/PC-AMD-Gaming/PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC/PC_AMD_GAMING_LUXURY_RYZEN_9_9950X3D-RTX_5090_32GB_OC_1.jpg"
                            />        
                        </Link>
                    </div> 
                    <div className='cart-summary-product-item-info'>
                        <span className='cart-summary-product-item-info-name'>
                            <Link to={"/ProductDetails/:id"}
                                className='cart-summary-product-item-info-name-link'>
                                PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC
                            </Link>
                        </span>
                        <div className='cart-summary-product-item-info-details'>
                            <span className='cart-summary-product-item-info-quantity'>
                                Quantity: <span className='cart-summary-product-item-info-quantity-value'>1</span>
                            </span>
                            <span>X</span>
                            <span className='cart-summary-product-item-price'>
                            {formatCurrency(48880000)}
                            </span>
                        </div>
                        <RiDeleteBin6Line className="cart-summary-Delete-icon" />
                    </div>   
                </div>  
            </div>
            
                
            <div className="cart-summary-body">
                {/* Circuit pattern decoration */}
                <div className="circuit-pattern"></div>
                
                <div className="summary-row">
                <span className="summary-label">Temporarily calculated</span>
                <span className="summary-value">{formatCurrency(subtotal)}</span>
                </div>

                <div className="summary-row">
                <span className="summary-label">Shipping fee</span>
                <span className="summary-value shipping-value">
                    {shipping === null ? (
                    <span className="shipping-pending">
                        Calculated at checkout
                    </span>
                    ) : (
                    formatCurrency(shipping)
                    )}
                </span>
                </div>

                {tax > 0 && (
                <div className="summary-row">
                    <span className="summary-label">VAT</span>
                    <span className="summary-value">{formatCurrency(tax)}</span>
                </div>
                )}

                {appliedPromo && (
                <div className="summary-row discount-row">
                    <span className="summary-label discount-label">
                    <FiTag className="tag-icon" />
                    Discount ({appliedPromo.code})
                    </span>
                    <span className="summary-value discount-value">
                    -{formatCurrency(discount)}
                    </span>
                </div>
                )}

                <div className="summary-divider">
                    <div className="divider-glow"></div>
                </div>

                <div className="summary-row total-row">
                    <span className="summary-label total-label">Total : </span>
                    <span className="summary-value total-value">
                        {formatCurrency(total)}
                    </span>
                </div>

                <div className="promo-section">
                {!appliedPromo ? (
                    <>
                    <button
                        className="promo-toggle"
                        onClick={() => setPromoExpanded(!promoExpanded)}
                    >
                        <FiTag className="promo-icon" />
                        <span>Do you have a discount Vouncher?</span>
                        {promoExpanded ? <FiChevronUp /> : <FiChevronDown />}
                    </button>

                    {promoExpanded && (
                        <div className="promo-input-wrapper">
                            <input
                                type="text"
                                className="promo-input"
                                placeholder="Discount Vouncher"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                onKeyPress={(e) => e.key === 'Enter' && handleApplyPromo()}
                            />
                            <button className="promo-apply-btn" onClick={handleApplyPromo}>
                                Apply
                            </button>
                        </div>
                    )}
                    </>
                ) : (
                    <div className="promo-applied">
                    <IoCheckmarkCircle className="check-icon" />
                    <span>Applied: <strong>{appliedPromo.code}</strong></span>
                    <button className="promo-remove" onClick={handleRemovePromo}>
                        Remove
                    </button>
                    </div>
                )}
                </div>

                {/* Action Buttons Container */}
                <div className="action-buttons-container">
                    <Button className="view-cart-btn" fullWidth>
                        <FiShoppingCart className="btn-icon" />
                        <span className="btn-text">
                            <Link to="/CartPage/">
                                View Cart
                            </Link>
                        </span>
                    </Button>

                    <Button className="checkout-btn" fullWidth>
                        <span className="btn-text">
                            <Link to="/Checkout">
                                Proceed to payment
                            </Link>
                        </span>
                        <span className="btn-arrow">→</span>
                    </Button>
                </div>

                <div className="security-note">
                <span className="security-icon"><BsShieldLockFill /></span>
                <span className="security-text">Safe & Secure Payment</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default CartSummary;